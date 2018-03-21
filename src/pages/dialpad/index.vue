<template>
<div class="dialpad">
  <div class="item add" @tap="onAdd">
    <div>+添加</div>
  </div>
  <div class="item" v-for="item in rolls">{{item.name}}</div>
</div>
</template>

<script>
// Use Vuex
import store from './store'
import sectors from '@/components/sectors'

export default {
  data () {
    return {
      rolls: [],
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
    onAdd () {
      this.navigateTo('edit-lottery')
    },
    navigateTo(name) {
      wx.navigateTo({url: `../${name}/${name}`})
    }
  },
  created () {
    this.rolls = (wx.getStorageSync('rolls') || [])
  }
}

</script>
<style lang="scss">
.dialpad {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .item {
    display: flex;
    align-items: center;
    flex: auto;
    width: 100px;
    height: 100px;
    margin: 4px 8px;
    border: 1px solid #ccc;
    box-shadow: 0 4px 2px #fafafa;
    border-radius: 6px;
    text-align: center;
    justify-content: center;
    &.add {
      flex: unset;
    }
  }
}
</style>
