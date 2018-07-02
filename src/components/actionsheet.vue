<template>
<view class="actionsheet" :class="show ? 'is-show' : ''" @tap="cancel">
  <view class="backdrop" @tap="cancel"></view>
  <view class="acs">
    <view class="acs-title" v-if="title">{{title}}</view>
    <view class="acs-group">
      <block v-for="(btn, idx) in buttons" :key="idx">
        <button class="acs-button" :data-index="idx" @tap="buttonClicked">
          {{ btn.text }}
        </button>
      </block>
    </view>
    <view class="acs-group " v-if="cancelText">
      <button class="acs-button cancel" @tap="cancel">{{ cancelText }}</button>
    </view>
  </view>
</view>
</template>

<script>
const defaults = {
  titleText: 'wwww',
  buttons: [{text: 'aaaa'}],
  onButtonClicked () {},
  cancelText: '取消',
  onCancel () {}
}
function override (dfts, opts) {
  const keys = Object.keys(dfts)
  return keys.reduce((acc, k) => {
    if (k in opts) acc[k] = opts[k]
    else acc[k] = dfts[k]
    return acc
  }, {})
}

export default {
  data () {
    return Object.assign({show: false}, defaults)
  },
  methods: {
    /**
     * 显示
     */
    showSheet (opts = {}) {
      Object.assign(this, override(defaults, opts))
      this.show = true
    },
    /**
     * 隐藏
     */
    removeSheet (callback) {
      if (!this.show) return false
      this.show = false
      if (typeof callback === 'function') {
        callback(this.buttons)
      }
    },
    /**
     * 按钮点击事件
     */
    buttonClicked (e) {
      const { index } = e.currentTarget.dataset
      if (this.onButtonClicked(index, this.buttons[index]) === false) return
      this.removeSheet()
    },
    /**
     * 取消按钮点击事件
     */
    cancel () {
      this.removeSheet(this.onCancel)
    }
  }
}
</script>

<style lang="scss">
.actionsheet {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  z-index: 9999;

  .is-iphonex & {
    .acs {
      padding-bottom: 34px;
    }
  }

  .backdrop {
    transition: opacity .2s linear;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(33,33,33,.5);
  }

  .acs {
    transition: transform .2s linear;
    transform: translateY(100%);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
  }

  &.is-show {
    visibility: visible;

    .backdrop { opacity: 1; }
    .acs { transform: translateY(0); }
  }
}
</style>
