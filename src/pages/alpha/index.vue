<template>
  <div class="app-main">
    <card type="food">What to eat</card>
    <card type="location" @tap="navigateTo('location')">Where to eat</card>
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
  methods: {
    navigateTo(name) {
      console.log('navigator')
      wx.navigateTo({url: `../${name}/${name}`})
    }
  }
}

</script>
<style lang="scss">
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
