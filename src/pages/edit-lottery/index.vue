<template>
<div class="location">
  <div class="xinput-cell">
    <input
      v-model="name"
      type="text"
      placeholder="选项主题">
    <!-- <span class="btn" @tap="onSearch">GO</span> -->
  </div>
  <div class="xinput-cell">
    <textarea></textarea>
  </div>
  <div class="xinput-cell">
    <input type="number" v-model="max" placeholder="最多选几项">
  </div>
  <div class="pick-btn" @tap="onSave">保存</div>
</div>
</template>

<script>
import utils from '@/utils/index'

export default {
  data () {
    return {
      name,
      max: 0,
      maxSelect: ['1个', '2个', '3个', '4个', '5个', '6个', '7个', '8个'],
      rolls: [],
      roll: {}
    }
  },
  created () {
    this.rolls = (wx.getStorageSync('rolls') || [])
  },
  mounted () {
  },
  methods: {
    onMaxChange (e) {
      this.max = e.target.value
    },
    onSave () {
    }
  }
}
</script>

<style lang="scss">
.location {
  position: relative;

  .xinput-cell {
    width: 90%;
    max-width: 300px;
    margin: 10px auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 100;

    input, textarea {
      padding: 4px 8px;
    }

    select {
      text-align: center;
      width: 120px;
      color: #999;
    }

    textarea {
      height: 400px;
    }

  }

  .result-list {
    padding-left: 10px;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    font-weight: 200;

    .item {
      padding: 8px 10px;
      & + .item {
        border-top: 1px solid whitesmoke;
      }

      .desc {
        font-size: 14px;
        color: #777;
      }

      .spec {
        font-size: 10px;
        color: #aaa;

        span {
          margin-right: 6px;
        }
      }
    }
  }

  .info-tip {
    color: #777;
    text-align: center;
    font-size: 16px;
    font-weight: 200;
  }

  .pick-btn {
    position: fixed;
    bottom: 30px;
    width: 50px;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #32c24d;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    padding: 4px 6px;
    font-weight: 100;
    line-height: 50px;
    font-size: 14px;
    opacity: .9;

    &:active {
      opacity: 1;
    }
  }
}
</style>
