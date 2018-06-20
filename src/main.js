import Vue from 'vue'
import App from './App'
import presets from './schemes/presets'
import store from './utils/store'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'
presets()
const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [], // Will be filled in webpack
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}
