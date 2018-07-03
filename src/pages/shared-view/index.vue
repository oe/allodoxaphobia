<template>
<div class="help-page">

</div>
</template>

<script>
import LZString from 'lz-string'

export default {
  data () {
    return {
      pageArgs: {}
    }
  },
  mounted () {
    const query = this.$root.$mp.query
    let pageArgs
    if (query.lzs) {
      pageArgs = LZString.decompressFromEncodedURIComponent(query.pageArgs)
    } else {
      pageArgs = Object.keys(query).reduce((acc, k) => {
        acc[k] = decodeURIComponent(query[k])
        return acc
      }, {})
    }
    console.log('pageArgs', pageArgs)
    this.pageArgs = pageArgs
  },
  methods: {
    getLocationDetail (url) {

    }
  }
}
</script>

<style lang="scss">

</style>
