<template>
<div class="location-item">
  <div class="location-info" @tap="onTapItem(item)">
    <h4 class="title">{{item.name}}</h4>
    <div class="desc">{{item.address}}</div>
    <div class="spec">
      <span v-if="detail.rating">{{detail.rating}}</span>
      <span v-if="detail.commentNum">{{detail.commentNum}}</span>
      <span v-if="detail.price">{{detail.price}}</span>
    </div>
    <div class="spec">
      <span v-if="detail.distance">{{detail.distance}}</span>
      <span v-if="detail.tags" :key="i" v-for="(tag, i) in detail.tags">{{tag}}</span>
    </div>
  </div>
  <div v-if="item.telephone" class="act-btn" @tap="onMakeCalls(item.telephone)">☎️ 拨打电话</div>
  <div class="act-btn" @tap="onShowDetails(item.uid)">查看位置详情</div>
  <div class="act-btn primary" @tap="openLocation">导航到该位置</div>
</div>
</template>

<script>
import mixin from './mixin'
import utils from '@/utils'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  computed: {
    ...mapState(['blueprint']),
    detail () {
      console.log('location detail', this.item)
      const detail = this.item.detail_info || {}
      const desc = {
        distance: '距离' + utils.formatDistance(detail.distance),
        tags: detail.tag && detail.tag.split(';')
      }
      if (detail.price) {
        desc.price = `人均${detail.price}元`
      }
      if (detail.rating) {
        desc.rating = `评分${detail.overall_rating}(共5分)`
      }
      if (detail.commentNum) {
        desc.commentNum = `${detail.comment_num}条评论`
      }
      return desc
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
    // 查看位置详情
    onShowDetails (id) {
      const args = {
        title: this.blueprint.title,
        type: this.blueprint.type,
        result: id
      }
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
  .spec span {
    padding-right: 5px;

    + span {
      padding-left: 5px;
    }
  }
}

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
