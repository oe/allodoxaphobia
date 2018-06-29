<template>
  <div class="app-main" :class="isIphoneX ? 'is-iphonex' : ''">
    <div class="page-main">
      <scroll-view
        v-if="blueprints && blueprints.length"
        class="blueprint-list">
        <movable-area>
          <movable-view>
          </movable-view>
        </movable-area>
        <div
          class="blueprint-item"
          v-for="bp in blueprints"
          :key="bp.id"
          @tap="viewOption(bp.id)">
          {{bp.title}}
        </div>
      </scroll-view>
      <div class="no-blueprints" v-else>
        😢 木有任何可用方案, 请点击下方的 + 新建
      </div>
    </div>
    <div class="toolbar">
      <div class="toolbar-item"></div>
      <div class="toolbar-item">
        <div class="icon icon-order"></div>
        排序
      </div>
      <div class="toolbar-item" @tap="addOption">
        <view class="btn-center icon icon-add"></view>
      </div>
      <div class="toolbar-item" @tap="onFeedBack">
        <div class="icon icon-feedback"></div>
        反馈
      </div>
      <div class="toolbar-item"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import pmixin from '../pmixin'
export default {
  mixins: [pmixin],
  data () {
    return {
      canScroll: true
    }
  },
  computed: {
    ...mapState(['blueprints'])
  },
  onShow () {
    this.clearBlueprint()
    wx.stopAccelerometer()
  },
  methods: {
    ...mapMutations(['clearBlueprint']),
    viewOption (id) {
      wx.navigateTo({url: `../view/view?id=${id}`})
    },
    addOption () {
      wx.navigateTo({url: `../edit/edit`})
    },
    onFeedBack () {
      let url = 'https://mp.weixin.qq.com/s/0-M2wAiqPioay2BLVWoefg'
      url = `../webview/webview?url=${encodeURIComponent(url)}`
      wx.navigateTo({url})
    }
  }
}

</script>
<style lang="scss">
.blueprint-list {
  // padding-bottom: $bar-height;
  // overflow-y: auto;

  // .is-iphonex & {
  //   padding-bottom: $bar-height + $iphonex-bottom;
  // }
}
.blueprint-item {
  color: #666;
  margin: 10px;
  padding: 10px 8px;
  background-color: #efefef;
  border-radius: 6px;
}
.toolbar {

  .btn-center {
    color: white;
    background-color: rgba(153, 34, 153, .7);
  }
}


</style>
