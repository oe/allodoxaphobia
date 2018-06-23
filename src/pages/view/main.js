import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#fffdb7',
    navigationBarTextStyle: 'black',
    backgroundColor: '#fffdb7',
    backgroundTextStyle: 'dark',
    navigationBarTitleText: '查看结果'
  }
}
