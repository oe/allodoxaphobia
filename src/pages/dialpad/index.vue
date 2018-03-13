<template>
  <div class="dialpad">
    <input type="text" class="x-input" v-model="kwd">
  </div>
</template>

<script>
// Use Vuex
import store from './store'
import sectors from '@/components/sectors'

export default {
  data () {
    return {
      kwd: ''
    }
  },
  components: {
    sectors
  },
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    navigateTo(name) {
      wx.navigateTo({url: `../${name}/${name}`})
    }
  }
}

</script>
<style lang="scss">
.x-input {
  width: 80%;
  margin: 0 auto;
  border: 1px solid lightblue;
}
</style>
