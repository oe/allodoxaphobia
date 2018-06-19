// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    schemes: []
  },
  getters: {
    getSchemeByID: (state) => (sid) => {
      return schemes.find(s => s.id === sid)
    }
  },
  mutations: {
    init (state) {
      const schemes = (wx.getStorageSync('schemes') || [])
      state.schemes = schemes
    }
  }
})

export default store
