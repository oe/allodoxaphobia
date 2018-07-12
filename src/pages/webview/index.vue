<template>
<div class="webview">
  <web-view :src="url"></web-view>
</div>
</template>

<script>

export default {
  name: 'webview',
  data () {
    return {
      url: ''
    }
  },
  onShareAppMessage () {
    const shareObj = {
      title: '关爱选择困难症',
      path: '/pages/alpha/main'
    }
    return shareObj
  },
  onLoad (options) {
    const query = this.$root.$mp.query
    console.warn(query)
    const url = decodeURIComponent(query.url)
    console.warn(url)
    this.url = url.replace(/^http:/, 'https:')
  }
}
</script>

<style lang="scss">

</style>
