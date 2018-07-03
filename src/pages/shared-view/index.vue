<template>
<div class="share-page">
  <div class="blueprint-title">{{ pageArgs.title }}</div>
  <block v-if="pageArgs.type === 'location'">
    <location-item
      v-for="(item, k) in pageArgs.result"
      :key="k"
      :itemDetail="item">
    </location-item>
  </block>
  <block v-if="pageArgs.type === 'options'">
    <options-item
      v-for="(item, k) in pageArgs.result"
      :key="k"
      :item="item">
    </options-item>
  </block>
  <block v-if="pageArgs.type === 'poker'">
    <poker-item
      v-for="(item, k) in pageArgs.result"
      :key="k"
      :item="item">
    </poker-item>
  </block>
</div>
</template>

<script>
import LZString from 'lz-string'
import OptionsItem from '@/pages/view/items/options'
import PokerItem from '@/pages/view/items/poker'
import LocationItem from '@/pages/view/items/location'
import pmixin from '../pmixin'

export default {
  mixins: [pmixin],
  data () {
    return {
      pageArgs: {}
    }
  },
  components: {
    LocationItem,
    PokerItem,
    OptionsItem
  },
  mounted () {
    const query = this.$root.$mp.query
    let pageArgs
    if (query.lzstr) {
      pageArgs = LZString.decompressFromEncodedURIComponent(query.lzstr)
      pageArgs = JSON.parse(pageArgs)
      if (!Array.isArray(pageArgs.result)) pageArgs.result = [pageArgs.result]
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
.share-page {
  .blueprint-title {
    padding: 4px 8px;
    margin-top: 10px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }
}
</style>
