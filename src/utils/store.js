// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    blueprints: [],
    blueprint: null
  },
  mutations: {
    init (state) {
      const blueprints = (wx.getStorageSync('blueprints') || [])
      state.blueprints = blueprints
    },
    switch2 (state, id) {
      state.blueprint = state.blueprints.find(s => s.id === id)
    },
    addBlueprints (state, blueprints) {
      if (!Array.isArray(blueprints)) blueprints = [blueprints]
      for (let i = 0; i < blueprints.length; i++) {
        const blueprint = blueprints[i]
        if (!blueprint) continue
        if (blueprint.id) {
          const idx = state.blueprints.findIndex(b => b.id === blueprint.id)
          if (idx !== -1) {
            state.blueprints.splice(idx, 1, blueprint)
            return
          }
        } else {
          blueprint.id = utils.guid()
        }
      }
      state.blueprints.push(...blueprints)
      saveBlueprints(state)
    }
  }
})
function saveBlueprints (state) {
  wx.setStorageSync('blueprints', state.blueprints)
}
// debugger
store.commit('init')

export default store
