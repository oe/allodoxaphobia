<template>
<div class="view-result">
  {{result}}
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import schemes from '@/schemes'

export default {
  data () {
    return {
      result: '',
      lastShakeTime: 0,
      lastShake: { x: 0, y: 0, z: 0 }
    }
  },
  mounted () {
    if (!this.blueprint) {
      const query = this.$root.$mp.query
      query.id && this.switch2(query.id)
    }
    this.updatePage()
  },
  computed: {
    ...mapState(['blueprint'])
  },
  methods: {
    ...mapMutations(['switch2']),
    updatePage () {
      this.updateTitle()
      if (!this.blueprint) return
      this.getResult()
      wx.onAccelerometerChange(this.shake)
    },
    updateTitle () {
      console.log('title', this.blueprint && this.blueprint.title)
      wx.setNavigationBarTitle({
        title: this.blueprint && this.blueprint.title || '找不到选项'
      })
    },
    async getResult () {
      const result = await schemes.getResult(this.blueprint)
      this.result = JSON.stringify(result)
    },
    shake (acc) {
      const nowTime = Date.now() // 记录当前时间
      // 如果这次摇的时间距离上次摇的时间有一定间隔 才执行
      if (nowTime - this.lastShakeTime < 100) return
      var diffTime = nowTime - this.lastShakeTime // 记录时间段
      this.lastShakeTime = nowTime // 记录本次摇动时间，为下次计算摇动时间做准备
      const cur = {
        x: acc.x, // 获取x轴数值，x轴为垂直于北轴，向东为正
        y: acc.y, // 获取y轴数值，y轴向正北为正
        z: acc.z  // 获取z轴数值，z轴垂直于地面，向上为正
      }
      // 计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
      var speed = Math.abs(cur.x + cur.y + cur.z - this.lastShake.x - this.lastShake.y - this.lastShake.z) / diffTime * 10000
      console.log(speed)
      // //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
      if (speed > 80) {
        wx.vibrateLong()
        console.log('on shake')
        this.getResult()
      }
      this.lastShake = cur
    }
  }
}
</script>

<style lang="scss">
</style>
