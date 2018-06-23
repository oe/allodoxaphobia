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
      <view class="btn-center add-option iconfont icon-add" @tap="addOption"></view>
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
  background-color: whitesmoke;

  .add-option {
    text-align: center;
    line-height: 60px;
    font-size: 25px;
    background-color: rgba(153, 34, 153, .7);
    &:before {
      display: block;
    }
  }
}


</style>
