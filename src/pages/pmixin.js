import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['isIphoneX']),
    ...mapGetters(['isGuidanceShown'])
  },
  mounted () {
    const pname = this.$options.name
    // no page name, no usage tip, or guidance has shown
    if (!pname || !this.usageTip || this.isGuidanceShown(pname)) return
    const confirmTexts = [
      '知道了',
      '了解了',
      '已阅',
      '朕知道了',
      '懂了',
      '行了, 你够了, 俺会用'
    ]
    this.setGuidanceShown({ pname })
    wx.showModal({
      title: '使用小贴士',
      content: this.usageTip,
      showCancel: false,
      // random text form confirm button
      confirmText: confirmTexts[Math.floor(Math.random() * confirmTexts.length)]
    })
  },
  methods: {
    ...mapMutations(['setGuidanceShown']),
    onFeedBack () {
      // let url = 'https://mp.weixin.qq.com/s/nfWtbQrcR_yCLfZ7h1QDOQ'
      let url = 'https://mp.weixin.qq.com/s/xzjQcPdA1EPdSgziHWHUvw'
      url = `/pages/webview/main?url=${encodeURIComponent(url)}`
      wx.navigateTo({ url })
    }
  }
}
