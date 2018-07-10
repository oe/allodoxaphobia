// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isIphoneX: false,
    windowWidth: 320,
    blueprints: [],
    blueprint: null,
    locTotal: 0,
    locReceivedCount: 0,
    locPageSize: 0,
    guidance: {}
  },
  getters: {
    // whether guidance tip has shown before
    isGuidanceShown: state => pname => {
      return state.guidance[pname] || false
    }
  },
  mutations: {
    init (state) {
      const blueprints = wx.getStorageSync('blueprints') || []
      const guidance = wx.getStorageSync('guidance') || {}
      state.blueprints = blueprints
      state.guidance = guidance
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
    removeAllBlueprint (state) {
      state.blueprints = []
      saveBlueprints([])
    },
    addBlueprints (state, blueprints) {
      if (!Array.isArray(blueprints)) blueprints = [blueprints]
      const newBps = []
      for (let i = 0; i < blueprints.length; i++) {
        const blueprint = blueprints[i]
        if (!blueprint) continue
        if (blueprint.id) {
          const bp = state.blueprints.find(b => b.id === blueprint.id)
          if (bp) {
            Object.assign(bp, blueprint)
            continue
          }
        } else {
          blueprint.id = utils.guid()
        }
        newBps.push(blueprint)
      }
      newBps.length && state.blueprints.push(...newBps)
      saveBlueprints(state.blueprints)
    },
    editBlueprint (state, { id, form }) {
      console.log('editBlueprint arguments', id, form)
      const blueprint = state.blueprints.find(b => b.id === id)
      if (!blueprint) {
        console.warn('can not find blueprint with index', id)
        return
      }
      Object.assign(blueprint.form, form)
      console.log('editBlueprint', blueprint, state.blueprints)
      saveBlueprints(state.blueprints)
    },
    updateDeviceInfo (state, payload) {
      Object.keys(payload).forEach(k => {
        if (k in state) {
          state[k] = payload[k]
        }
      })
    },
    updateLocResStat (state, payload) {
      if (payload) {
        state.locTotal = payload.locTotal
        state.locPageSize = payload.locPageSize
        state.locReceivedCount = payload.locReceivedCount
      } else {
        state.locTotal = 0
        state.locReceivedCount = 0
        state.locPageSize = 0
      }
    },
    setBp2Top (state, payload) {
      const idx = payload.index
      if (idx === 0 || !state.blueprints[idx]) return
      const bp = state.blueprints.splice(idx, 1)
      state.blueprints.unshift(bp[0])
      saveBlueprints(state.blueprints)
    },
    setGuidanceShown (state, payload) {
      if (state.guidance[payload.pname] === true) return
      console.log('set ', payload, 'shown')
      state.guidance[payload.pname] = true
      wx.setStorageSync('guidance', state.guidance)
    }
  },
  actions: {
    detectDevice (ctx) {
      wx.getSystemInfo({
        success: res => {
          let modelmes = res.model
          console.log('system info', res)
          const payload = {
            isIphoneX: modelmes.search('iPhone X') !== -1,
            windowWidth: res.windowWidth
          }
          ctx.commit('updateDeviceInfo', payload)
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
