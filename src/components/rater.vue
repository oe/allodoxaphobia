<!-- fork from https://github.com/wux-weapp/wux-weapp/blob/master/src/rater -->
<template>
<view :class="'wux-rater ' + extCls">
  <block v-for="idx in stars" :key="idx">
    <view
      :class="'wux-rater__box ' + (val > idx ? 'wux-rater__box--active' : '')"
      @tap="handlerClick"
      :data-index="idx"
      :style="{
        color: (colors && colors[idx] ? colors[idx]: '#ccc'),
        'margin-right': margin + 'px',
        'font-size': fontSize + 'px',
        width: fontSize + 'px',
        height: fontSize + 'px',
        'line-height': fontSize + 'px'}">
      <view class="wux-rater__inner">
        {{ star }}
        <view class="wux-rater__outer" :style="{color: activeColor, width:  cutPercent + '%' }" v-if="cutPercent > 0 && cutIndex === idx">
            {{ star }}
        </view>
      </view>
    </view>
  </block>
</view>
</template>

<script>
export default {
  data () {
    return {
      stars: [],
      colors: [],
      cutPercent: 0,
      cutIndex: 0,
      val: 0
    }
  },
  props: {
    max: {
      type: Number,
      default: 5
    },
    star: {
      type: String,
      default: '★'
    },
    value: {
      type: Number,
      default: 0
    },
    activeColor: {
      type: String,
      default: '#fc6'
    },
    margin: {
      type: Number,
      default: 2
    },
    fontSize: {
      type: Number,
      default: 25
    },
    disabled: {
      type: Boolean,
      default: true
    },
    extCls: {
      type: String,
      default: ''
    }
  },
  created () {
    this.updateStars()
    this.updateValue(this.value)
  },
  methods: {
    updateStars () {
      const max = this.max
      this.stars = [...new Array(max)].map((n, i) => i)
    },
    updateValue (value) {
      const max = this.max
      const activeColor = this.activeColor
      const newVal = value < 0 ? 0 : value > max ? max : value
      const colors = [...new Array(max)].reduce((a, b, i) => {
        const v = i <= value - 1 ? activeColor : '#ccc'
        a.push(v)
        return a
      }, [])
      const _val = newVal.toString().split('.')
      const sliceValue = _val.length === 1 ? [_val[0], 0] : _val
      this.colors = colors
      this.cutIndex = sliceValue[0] * 1
      this.cutPercent = sliceValue[1] * 10
      this.val = newVal
    },
    handlerClick (e) {
      const { index } = e.currentTarget.dataset
      if (this.disabled) return
      const newVal = this.val === index + 1 ? index : index + 1
      this.val = newVal
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (!this.disabled) {
        this.updateValue(newVal)
      }
    }
  }
}
</script>

<style lang="scss">
@mixin clearfix {
  &:before,
  &:after {
    display: table;
      content: " ";
  }

  &:after {
    clear: both;
  }
}

.wux-rater {
  display: inline-block;
  margin: 0;
  padding: 0;
  line-height: normal;
  // vertical-align: middle;
  vertical-align:top;
  font-weight: 400;
  font-style: normal;
  @include clearfix;

  &__box {
    position: relative;
    display: inline-block;
    float: left;
    text-align: center;
    cursor: pointer;
    color: #ccc;
    transition: color .3s ease;

    &:last-child {
      padding-right: 2px !important;
      margin-right: 0px !important;
    }

    &--disabled {
      color: #ccc !important;
      cursor: not-allowed;
    }
  }

  &__inner {
    position: relative;
    display: inline-block;
  }

  &__outer {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    overflow: hidden;
  }
}
</style>
