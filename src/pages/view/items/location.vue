<template>
<div class="location-item">
  <div class="location-info" @tap="onTapItem(item)">
  <h4 class="title">{{item.name}}</h4>
  <p class="desc">{{item.address}}</p>
  <p class="spec">
    <span v-if="item.detail_info.distance">距离{{distance}}</span>
    <span v-if="item.telephone">☎️{{item.telephone}}</span>
    <span v-if="item.detail_info.price">¥{{item.detail_info.price}}</span>
  </p>
  </div>
  <div><small>地图数据由百度提供, 如有差错, 不关我事</small></div>
  <button @tap="openBaidu" v-if="hasBaiduURL">在百度上查看</button>
  <button @tap="openLocation">导航到该位置</button>
</div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  computed: {
    hasBaiduURL () {
      return this.item && this.item.detail_info.detail_url
    },
    distance () {
      if (!this.item) return 0
      const d = this.item.detail_info.distance
      if (d <= 1000) return `${d}m`
      else return (d / 1000).toFixed(2) + 'km'
    }
  },
  methods: {
    onTapItem () {
      this.openLocation()
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
      const item = this.item
      let url = item.detail_info.detail_url
      url = `../webview/webview?url=${encodeURIComponent(url)}`
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
</style>
