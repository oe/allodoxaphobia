<template>
  <div class="app-main" :class="isIphoneX ? 'is-iphonex' : ''">
    <div class="page-main">
      <div
        class="blueprint-item"
        v-for="bp in blueprints"
        :key="bp.id"
        @tap="viewOption(bp.id)">
        {{bp.title}}
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
import { mapState } from 'vuex'
import pmixin from '../pmixin'
export default {
  mixins: [pmixin],
  computed: {
    ...mapState(['blueprints'])
  },
  onShow () {
    wx.stopAccelerometer()
  },
  methods: {
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
$bar-height: 50px;
$iphonex-bottom: 34px;
.blueprint-list {
  padding-bottom: $bar-height;
  overflow-y: auto;

  .is-iphonex & {
    padding-bottom: $bar-height + $iphonex-bottom;
  }
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
