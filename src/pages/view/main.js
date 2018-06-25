import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#2f89fc',
    navigationBarTextStyle: 'white',
    backgroundColor: '#2f89fc',
    backgroundTextStyle: 'dark',
    navigationBarTitleText: '查看结果'
  }
}
