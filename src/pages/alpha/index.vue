<template>
  <div class="app-main">
    <div
      class="blueprint-item"
      v-for="bp in blueprints"
      :key="bp.id"
      @tap="viewOption(bp.id)">
      {{bp.title}}
    </div>
    <button class="blueprint-item" @tap="addOption">add option</button>
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
    viewOption (id) {
      this.switch2(id)
      console.log('navigator')
      wx.navigateTo({url: `../view/view?sid=${id}`})
    },
    addOption () {
      wx.navigateTo({url: `../edit/edit`})
    }
  }
}

</script>
<style lang="scss">
.blueprint-item {
  color: #666;
  margin: 10px;
  padding: 10px 8px;
  background-color: #efefef;
  border-radius: 6px;
}
</style>
