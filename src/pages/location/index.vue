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
        this.location = res
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
