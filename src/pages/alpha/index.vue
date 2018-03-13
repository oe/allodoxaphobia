<template>
  <div class="app-main">
    <card type="food" @tap="navigateTo('dialpad')">What to eat</card>
    <card type="location" @tap="navigateTo('location')">Where to eat</card>
    <card type="morra" @tap="navigateTo('morra')">Guess my finger</card>
  </div>
</template>

<script>
// Use Vuex
import card from '@/components/card'
import store from './store'

export default {
  data () {
  },
  components: {
    card
  },
  computed: {
    count () {
      return store.state.count
    }
  },
  onShow () {
    console.log('main show')
    wx.stopAccelerometer()
  },
  methods: {
    navigateTo(name) {
      console.log('navigator')
      wx.navigateTo({url: `../${name}/${name}`})
    }
  }
}

</script>
<style lang="scss">
</style>
