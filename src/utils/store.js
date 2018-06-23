// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isIphoneX: false,
    blueprints: [],
    blueprint: null
  },
  mutations: {
    init (state) {
      const blueprints = (wx.getStorageSync('blueprints') || [])
      state.blueprints = blueprints
    },
    switch2 (state, id) {
      state.blueprint = (id && state.blueprints.find(s => s.id === id)) || null
    },
    // 清空缓存的 blueprint
    clearBlueprint (state) {
      state.blueprint = null
    },
    removeBlueprint (state, id) {
      const idx = state.blueprints.findIndex(b => b.id === id)
      if (idx === -1) return
      state.blueprints.splice(idx, 1)
      saveBlueprints(state.blueprints)
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
      saveBlueprints(state.blueprints)
    },
    set2iphoneX (state) {
      state.isIphoneX = true
    }
  },
  actions: {
    detectDevice (ctx) {
      wx.getSystemInfo({
        success: (res) => {
          let modelmes = res.model
          console.log('system info', res)
          if (modelmes.search('iPhone X') !== -1) {
            ctx.commit('set2iphoneX')
          }
        },
        fail (e) {
          console.warn('failed to get system info')
        }
      })
    }
  }
})

function saveBlueprints (blueprints) {
  wx.setStorageSync('blueprints', blueprints)
}
// debugger
store.commit('init')
store.dispatch('detectDevice')
export default store
