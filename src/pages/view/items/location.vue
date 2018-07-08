<template>
<div class="location-item" v-if="item">
  <div class="location-info" @tap="onTapItem(item)">
    <h4 class="title">{{item.name}}</h4>
    <div class="desc">{{item.address}}</div>
    <div class="spec">
      <rater extCls="itm" v-if="detail.rating" :value="detail.rating" fontSize="14"></rater>
      <span class="itm" v-if="detail.commentNum">{{detail.commentNum}}</span>
      <span class="itm" v-if="detail.price">{{detail.price}}</span>
    </div>
    <div class="spec">
      <span class="itm" v-if="detail.distance">{{detail.distance}}</span>
      <span class="itm" v-if="detail.tags" :key="i" v-for="(tag, i) in detail.tags">{{tag}}</span>
    </div>
  </div>
  <div v-if="item.telephone" class="act-btn" @tap="onMakeCalls(item.telephone)">☎️ 拨打电话</div>
  <div class="act-btn primary" @tap="openLocation">导航到该位置</div>
  <div class="location-tip" v-if="!isFromShare && locTotal">{{locTip}}</div>
  <div class="location-disclaimer">数据由百度地图提供, 本程序不保证信息的准确性</div>
</div>
</template>

<script>
import mixin from './mixin'
import utils from '@/utils'
import { mapState } from 'vuex'
import Rater from '@/components/rater'
export default {
  components: { Rater },
  mixins: [mixin],
  props: {
    isFromShare: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['locTotal', 'locReceivedCount', 'locPageSize']),
    detail () {
      const detail = (this.item && this.item.detail_info) || {}
      const desc = {
        tags: detail.tag && detail.tag.split(';')
      }
      if (detail.distance) {
        desc.distance = '距离' + utils.formatDistance(detail.distance)
      }
      if (detail.price) {
        desc.price = `人均${detail.price}元`
      }
      if (detail.overall_rating) {
        desc.rating = parseFloat(detail.overall_rating)
      }
      if (detail.comment_num) {
        desc.commentNum = `${detail.comment_num}条评论`
      }
      return desc
    },
    locTip () {
      if (!this.locTotal || !this.locReceivedCount) return ''
      let tip = ''
      if (this.locReceivedCount <= this.locPageSize && this.locTotal <= this.locPageSize) {
        if (this.locReceivedCount === 1) {
          tip = '有点尴尬, 当前这个位置是当前范围内绝无仅有的一个'
        } else {
          tip = `在周边共找到了${this.locReceivedCount}个位置`
        }
        tip += '. 你可以尝试点击下方的 微调 按钮, 调大距离后再试'
      } else {
        tip = `周边共找到不少于 ${this.locTotal} 个符合条件的位置, 结果特别多哦, 程序仅会从其中离你最近的 ${this.locPageSize} 个位置为为你挑选出一个. 你可以尝试点击下方的 微调 按钮, 调小距离范围后再试`
      }
      return tip
    }
  },
  methods: {
    onTapItem () {
      this.openLocation()
    },
    onMakeCalls (phones) {
      const itemList = phones.split(';')
      if (itemList.length > 1) {
        wx.showActionSheet({
          itemList,
          success: (res) => {
            console.warn('idex', itemList[res.tapIndex])
            wx.makePhoneCall({
              phoneNumber: itemList[res.tapIndex]
            })
          }
        })
      } else {
        wx.makePhoneCall({
          phoneNumber: itemList[0]
        })
      }
    },
    openLocation () {
      const item = this.item
      wx.openLocation({
        latitude: item.location.lat,
        longitude: item.location.lng,
        name: item.name,
        address: item.address
      })
    },
    openBaidu () {
      let url = this.detail.detail_url
      console.warn('url', url)
      url = `../webview/webview?url=${encodeURIComponent(url)}`
      // url = `../webview/webview?url=${encodeURIComponent('https://mp.weixin.qq.com/s/4J40rrKCBABAtTl6dWLnEA')}`
      console.log('url', url)
      wx.navigateTo({url})
    }
  }
}
</script>

<style lang="scss">
.location-item {
  padding: 10px;
  color: #333;
}

.location-info {
  color: #777;
  font-size: 14px;
  .title { font-size: 24px; color: #333; }
  .desc {font-size: 16px; color: #444; }
  .spec .itm {
    padding-right: 5px;

    + .itm {
      padding-left: 5px;
    }
  }
}

.location-tip,
.location-disclaimer {
  margin: 6px 10px;
  color: #999;
  font-size: 14px;
}
.location-disclaimer { font-size: 12px; }
.act-btn {
  margin-top: 10px;
  text-align: center;
  padding: 8px 16px;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  border: 1px solid #ccc;
  &.primary {
    background-color: #2f89fc;
    color: white;
    border-color: #2f89fc;
  }
}
</style>
