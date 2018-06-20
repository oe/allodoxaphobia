<template>
  <div class="app-main">
    <div
      class="blueprint-item"
      v-for="bp in blueprints"
      :key="bp.id"
      @tap="navigateTo(bp.id)">
      {{bp.title}}
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['blueprints'])
  },
  onShow () {
    wx.stopAccelerometer()
  },
  methods: {
    ...mapMutations(['switch2']),
    navigateTo (id) {
      this.switch2(id)
      console.log('navigator')
      wx.navigateTo({url: `../view/view?sid=${id}`})
    }
  }
}

</script>
<style lang="scss">
.blueprint-item {
  color: #666;
  margin: 10px;
  padding: 4px 8px;
  background-color: #efefef;
  border-radius: 6px;
}
</style>
