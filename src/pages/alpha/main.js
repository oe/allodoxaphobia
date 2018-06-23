import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#992299',
    navigationBarTextStyle: 'white',
    backgroundColor: '#992299',
    backgroundTextStyle: 'light',
    navigationBarTitleText: '关爱选择困难症'
  }
}
