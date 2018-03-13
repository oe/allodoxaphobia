<template>
<div>
  <p>当前位置</p>
  <p v-if="location">
    hahah {{location.longitude}}
    {{JSON.stringify(location)}}
  </p>
  <p v-else> no location info</p>
</div>
</template>

<script>
import utils from '@/utils/index'

export default {
  data () {
    return {
      location: {}
    }
  },
  mounted () {
    // wx.request({
    //   url: 'https://api.map.baidu.com/place/v2/search?radius=1000&query=%E7%BE%8E%E9%A3%9F&coord_type=2&location=22.53332%2C113.93041&output=json&page_num=0&page_size=20&radius_limit=false&ret_coordtype=gcj02ll&scope=2&ak=kjvTGlp5qFHq913s4MCmiO170D4LFBeH&timestamp=1520869194896&sn=89214828c73f88cd35896f02008c98cf'
    // })
    utils.getNearByLocations({
      query: '美食',
      location: this.location
    }, {
      fail (err) {
        console.log('failed', err)
      },
      success (data) {
        console.log('success', data)
      }
    })
  },
  created () {
    wx.getLocation({
      type: 'gcj02',
      success:  (res) => {
        console.log('res', res)
        this.location = res
        console.log(this.location)
      },
      fail: (err) => {
        console.log(err, arguments)
      }
    })
  }
}
</script>

<style>
</style>
