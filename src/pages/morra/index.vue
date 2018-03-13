<template>
<div class="morra">
  <div class="hands" :class="'hand-' + (handNo%3)">
    <div class="hand outline"></div>
    <div class="hand rock"></div>
    <div class="hand scissors"></div>
  </div>
  <div class="btn" @tap="onTap">One more time</div>
</div>
</template>

<script>
import utils from '@/utils/index'

var x = 0,
  y = 0,
  z = 0,
  lastX = 0,
  lastY = 0,
  lastZ = 0; //此组变量分别记录对应x、y、z三轴的数值和上次的数值
var shakeSpeed = 110; //设置阈值
//编写摇一摇方法

export default {
  data () {
    return {
      //此变量用来记录上次摇动的时间
      lastShakeTime: 0,
      handNo: 1,
      toNo: 0,
      tid: 0,
      lastShake: { x: 0, y: 0, z: 0 }
    }
  },
  onHide () {
    console.log('stop listen')
    // wx.stopAccelerometer()
  },
  onShow () {
    console.log('start listen')
    this.onTap()
    wx.onAccelerometerChange(this.shake)
  },
  methods: {
    shake(acc) {
      const nowTime = Date.now(); //记录当前时间
      //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
      if (nowTime - this.lastShakeTime < 100) return
      var diffTime = nowTime - this.lastShakeTime; //记录时间段
      this.lastShakeTime = nowTime; //记录本次摇动时间，为下次计算摇动时间做准备
      const cur = {
        x: acc.x, // 获取x轴数值，x轴为垂直于北轴，向东为正
        y: acc.y, // 获取y轴数值，y轴向正北为正
        z: acc.z  // 获取z轴数值，z轴垂直于地面，向上为正
      }
      //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
      var speed = Math.abs(cur.x + cur.y + cur.z - this.lastShake.x - this.lastShake.y - this.lastShake.z) / diffTime * 10000;
      console.log(speed)
      // //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
      if (speed > 80) {
        wx.vibrateLong()
        console.log('on shake')
        this.onTap()
      }
      this.lastShake = cur
    },
    onTap () {
      clearTimeout(this.tid)
      this.toNo = Math.floor(Math.random() * 10 + Date.now()) % 16 + 4
      this.handNo = 0
      console.log('toNo', this.toNo)
      this.runGame()
    },
    runGame () {
      if (this.handNo >= this.toNo) return
      this.tid = setTimeout(() => {
        this.handNo += 1
        this.runGame()
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.morra {
  .hands {
    position: relative;
    width: 80%;
    padding-top: 80%;
    margin: 0 auto;

    > .hand {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
      opacity: 0;
      transition: opacity .2s;

      &.outline {
        background-image: url('~static/icons/outline-hand.svg');
      }
      &.rock {
        background-image: url('~static/icons/rock-hand.svg');
      }
      &.scissors {
        background-image: url('~static/icons/scissors-hand.svg');
      }
    }

    &.hand-1 {
      .outline {
        opacity: 1;
      }
    }

    &.hand-2 {
      .rock {
        opacity: 1;
      }
    }

    &.hand-0 {
      .scissors {
        opacity: 1;
      }
    }
  }

  .btn {
    width: 40%;
    max-height: 150px;
    margin: 20px auto;
    font-size: 20px;
    color: #fff;
    font-weight: 100;
    padding: 6px 10px;
    border-radius: 4px;
    text-align: center;
    background-color: #32c24d;
    // box-shadow: 0 2px 3px rgba(0,0,0, .3);
  }
}
</style>
