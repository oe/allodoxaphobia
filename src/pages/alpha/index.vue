<template>
  <div class="app-main" :class="isIphoneX ? 'is-iphonex' : ''">
    <div class="page-main">
      <scroll-view
        v-if="blueprints && blueprints.length"
        :class="{'is-sorting': isSort}"
        class="blueprint-list">
        <div
          class="blueprint-item"
          v-for="(bp, idx) in blueprints"
          :key="bp.id">
          <div class="left-handler" @tap="onSetTop(bp, idx)">🔝</div>
          <div class="item-innter" @tap="viewOption(bp.id)">{{bp.title}}</div>
        </div>
      </scroll-view>
      <div class="no-blueprints" v-else>
        😢 木有任何可用方案, 请点击下方的 + 新建
      </div>
    </div>
    <div class="toolbar">
      <div class="toolbar-item-2">
        <div class="toolbar-item" @tap="onToggleSort">
          <div class="icon icon-order"></div>
          {{isSort ? '完成' : '排序'}}
        </div>
      </div>
      <div class="toolbar-item" @tap="addOption">
        <view class="btn-center icon icon-add"></view>
      </div>
      <div class="toolbar-item-2">
        <div class="toolbar-item" @tap="onFeedBack">
          <div class="icon icon-feedback"></div>
          反馈
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import SliderLeft from '@/components/slider-left'
import pmixin from '../pmixin'
export default {
  mixins: [pmixin],
  name: 'alpha',
  data () {
    return {
      canScroll: true,
      isSort: false
    }
  },
  // components: { SliderLeft },
  computed: {
    ...mapState(['blueprints']),
    usageTip () {
      return '欢迎使用小程序, 本程序已预置了一些选择方案, 你可以点击下方的 加号 添加自己的方案, 也可以删除你不需要的方案.'
    }
  },
  onShow () {
    this.clearBlueprint()
    wx.stopAccelerometer()
  },
  onShareAppMessage () {
    const shareObj = {
      title: '关爱选择困难症',
      path: '/pages/alpha/main'
    }
    console.warn('home page', shareObj)
    return shareObj
  },
  methods: {
    ...mapMutations(['clearBlueprint', 'setBp2Top']),
    viewOption (id) {
      this.isSort = false
      wx.navigateTo({url: `../view/main?id=${id}`})
    },
    addOption () {
      this.isSort = false
      wx.navigateTo({url: `../edit/main`})
    },
    onToggleSort () {
      this.isSort = !this.isSort
    },
    onSetTop (bp, idx) {
      this.setBp2Top({
        index: idx
      })
    }
  }
}
</script>
<style lang="scss">
$left-handler-width: 30px;
.blueprint-list {
  .blueprint-item {
    position: relative;
    margin: 10px;
    .item-innter {
      position: relative;
      font-weight: 200;
      // color: #efefef;
      padding: 10px 8px;
      // background: rgba(0,0,140,.08);
      background-color: rgba(0,0,140,.3);
      border-radius: 6px;
      z-index: 2;
      transition: transform .2s linear;
      transform: translateX(0);
    }

    .left-handler {
      position: absolute;
      top: 2px;
      left: 0;
      bottom: 2px;
      width: $left-handler-width;
      padding: 6px 8px;
      border-radius: 6px;
      text-align: center;
      color: white;
      background-color: rgba(255,255,255,.3);
      z-index: 1;
      opacity: 0;
    }
  }

  &.is-sorting {
    .item-innter {
      transform: translateX($left-handler-width + 20px);
    }

    .left-handler {
      transition: opacity .3s;
      opacity: 1;
    }
  }
}



</style>
