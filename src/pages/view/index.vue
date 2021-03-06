<template>
<div class="view-page" :class="isIphoneX ? 'is-iphonex' : ''">
  <div class="blueprint page-main" :class="'is-' + blueprint.type" v-if="blueprint">
    <div class="blueprint-title">{{ blueprint.title }}</div>
    <div class="blueprint-desc">{{ blueprintDesc }}</div>
    <div v-if="status === 'failed'" class="scheme-error">
      {{error}}
    </div>
    <div v-if="status === 'success'" class="scheme-result" :class="{'has-little-result': hasLittleResult}">
      <block v-if="blueprint.type === 'location'">
        <location-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </location-item>
      </block>
      <block v-if="blueprint.type === 'options'">
        <options-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </options-item>
      </block>
      <block v-if="blueprint.type === 'number'">
        <options-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </options-item>
      </block>
      <block v-if="blueprint.type === 'a2z'">
        <options-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </options-item>
      </block>
      <block v-if="blueprint.type === 'poker'">
        <poker-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </poker-item>
      </block>
    </div>
    <easter-egg v-if="easterEgg"></easter-egg>
    <div v-if="status === 'pending'" class="scheme-pending">
      {{loadingTip}}
    </div>
  </div>
  <NoBlueprint v-else></NoBlueprint>
  <Actionsheet ref="acs"></Actionsheet>
  <div class="toolbar" v-if="blueprint">
    <div class="toolbar-item-2">
      <div class="toolbar-item" @tap="onShare" v-if="!!result">
        <div class="icon icon-share"></div>
        分享
      </div>
      <div class="toolbar-item" v-else></div>
      <picker
        class="toolbar-item"
        mode="multiSelector"
        @change="onAdjustChange"
        @columnchange="onColumnchange"
        @cancel="onAdjustCancel"
        :value="adjustIdxs"
        :range="adjustRange">
        <div class="icon icon-adjust"></div>
        微调
      </picker>
    </div>
    <div class="toolbar-item">
      <div class="btn-center icon icon-shuffle" @tap="onOnemore"></div>
    </div>
    <div class="toolbar-item" @tap="onEditBlueprint">
      <div class="icon icon-edit"></div>
      编辑
    </div>
    <div class="toolbar-item" @tap="onFeedBack">
      <div class="icon icon-feedback"></div>
      反馈
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import schemes from '@/schemes'
import utils from '@/utils'
import Actionsheet from '@/components/actionsheet'
import LZString from 'lz-string'
import pmixin from '../pmixin'
import NoBlueprint from './items/no-blueprint'
import LocationItem from './items/location'
import OptionsItem from './items/options'
import PokerItem from './items/poker'
import EasterEgg from './items/easter-egg'

export default {
  name: 'view',
  mixins: [pmixin],
  data () {
    return {
      isBlueprintChanged: false,
      status: 'idle',
      error: '',
      result: null,
      lastShakeTime: 0,
      adjustIdxs: [0],
      ltid: 0,
      easterEgg: false,
      // 连续点击获取结果的次数
      getResTimes: 0,
      oldAdjustIdxs: [0],
      adjustRange: [['其他请编辑']]
    }
  },
  // components,
  components: {
    EasterEgg,
    NoBlueprint,
    LocationItem,
    OptionsItem,
    PokerItem,
    Actionsheet
  },
  created () {
    this.status = 'idle'
    this.result = null
  },
  mounted () {
    const query = this.$root.$mp.query
    console.log('view page scheme id', query)
    wx.onAccelerometerChange(this.shake)
    this.switch2(query.id)
    this.updatePage()
  },
  computed: {
    ...mapState(['blueprint']),
    usageTip () {
      let tip = '摇一摇 也可以查看新结果哦.'
      tip += '点击左下角的 分享 按钮可以复制文字结果, 也可以将也页面分享给其他好友'
      return tip
    },
    scheme () {
      if (!this.blueprint) return
      return schemes.getScheme(this.blueprint.type)
    },
    blueprintDesc () {
      if (!this.scheme || !this.scheme.getSchemeDesc) return ''
      return this.scheme.getSchemeDesc(this.blueprint.form, this.blueprint)
    },
    // has only small chars result
    hasLittleResult () {
      const result = this.result
      if (!result || typeof result[0] === 'object') return false
      if (result.length < 4) {
        return result.every(itm => String(itm).length <= 4)
      }
      return false
    },
    loadingTip () {
      let tip = ''
      if (this.getResTimes > 25) {
        this.easterEgg = true
        setTimeout(() => {
          this.easterEgg = false
        }, 8000)
        return tip
      }
      if (this.getResTimes > 15) {
        tip += `点击次数 ${this.getResTimes}, 手机即将爆炸, 倒计时 ${26 - this.getResTimes}`
      } else if (this.getResTimes > 10) {
        tip += '亲, 慢些点, 放轻松☕️, 再拼命按手机就要爆炸啦!'
      } else {
        tip += `程序正在${this.getResTimes > 1 ? '持续' : ''}思考中🤔...`
      }
      return tip
    }
  },
  onShareAppMessage () {
    const qs = this.scheme.getShareQs(this.result, this.blueprint)
    const qsStr = 'lzstr=' + LZString.compressToEncodedURIComponent(JSON.stringify(qs))
    const shareObj = {
      title: '关爱选择困难症',
      path: '/pages/shared-view/main?' + qsStr
    }
    console.warn(shareObj)
    return shareObj
  },
  onShow () {
    console.log('on page show', this.isBlueprintChanged, this.blueprint)
    if (this.isBlueprintChanged && this.blueprint) {
      wx.showToast({
        icon: 'none',
        title: '正在重新获取结果...',
        duration: 500
      })
      this.$nextTick(() => this.updatePage())
    }
  },
  onUnload () {
    wx.stopAccelerometer()
  },
  methods: {
    ...mapMutations(['switch2', 'editBlueprint']),
    updatePage () {
      if (!this.blueprint) return
      this.getAdjustList()
      this.getResult()
    },
    getAdjustList () {
      let result
      if (!this.scheme || !this.blueprint) return []
      result = this.scheme.getAdjustList(this.blueprint.form, this)
      result.ranges.push(['其他请编辑'])
      result.indexs.push(0)
      this.adjustRange = result.ranges
      this.adjustIdxs = result.indexs
      this.oldAdjustIdxs = result.indexs.slice(0)
    },
    onAdjustChange (e) {
      console.log('on change', e, e.target.value)
      this.adjustIdxs = e.mp.detail.value.map(v => v || 0)
      // no change
      if (this.adjustIdxs.join(',') === this.oldAdjustIdxs.join(',')) {
        wx.showToast({
          title: '配置未修改',
          mask: true,
          icon: 'none'
        })
        return
      }
      let form
      try {
        form = this.scheme.adjustChange(e.mp.detail, this)
      } catch (e) {
        wx.showToast({
          title: `配置保存失败, ${e.message}`,
          mask: true,
          icon: 'none'
        })
        return
      }
      // save change
      this.editBlueprint({
        id: this.blueprint.id,
        form
      })
      this.$nextTick(() => this.getAdjustList())
      wx.showToast({
        title: '配置已保存, 即将重新获取结果',
        mask: true,
        icon: 'none'
      })
      this.oldAdjustIdxs = this.adjustIdxs.slice(0)
      this.getResult()
    },
    onAdjustCancel () {
      this.getAdjustList()
    },
    onColumnchange (e) {
      const detail = e.mp.detail
      this.adjustIdxs[detail.column] = detail.value
      this.scheme.columnChange(detail, this)
    },
    onOnemore () {
      this.getResult()
    },
    async getResult () {
      const MIN_TIME_GAP = 500
      this.isBlueprintChanged = false
      const lastTime = Date.now()
      this.startTime = lastTime
      this.getResTimes += 1
      this.stopShowResult()
      try {
        this.status = 'pending'
        let result = await schemes.getResult(this.blueprint)
        this.stopShowResult()
        if (!Array.isArray(result)) result = [result]
        if (!result.length) {
          throw new Error('😱木有找到任何可用选项, 这可能是个bug')
        }
        const now = Date.now()
        // console.log('after result done', now, lastTime, now - lastTime)
        if ((now - lastTime) >= MIN_TIME_GAP) {
          this.getResTimes = 0
          wx.vibrateShort()
          this.result = result
          this.status = 'success'
        } else {
          const gap = MIN_TIME_GAP - (now - lastTime)
          const tid = setTimeout(() => {
            this.getResTimes = 0
            wx.vibrateShort()
            this.result = result
            this.status = 'success'
          }, gap)
          this.ltid = tid
        }
      } catch (e) {
        this.stopShowResult()
        this.getResTimes = 0
        this.status = 'failed'
        if (e.isLocation) {
          this.error = '获取地理位置失败, 请先授权小程序获取地理位置, 或者授权允许微信获取地理位置'
        } else {
          this.error = e.errMsg || e.message
        }
      }
      this.isBlueprintChanged = false
    },
    stopShowResult () {
      clearTimeout(this.ltid)
    },
    onEditBlueprint () {
      const id = this.blueprint.id
      console.log('going to edit of id', id)
      wx.navigateTo({url: `../edit/main?id=${id}`})
    },
    onShare () {
      this.$refs.acs.showSheet({
        onButtonClicked: (idx, item) => {
          if (item.cmd === 'copy') {
            this.copyResult()
          }
        },
        buttons: [
          {
            text: '分享页面给好友',
            openType: 'share'
          },
          {
            text: '复制文字结果',
            cmd: 'copy'
          }
        ]
      })
    },
    // 复制结果
    copyResult () {
      let str = this.scheme.getResultDesc(this.result, this.blueprint.title)
      utils.copy(str, '结果已复制')
    },
    shake (acc) {
      const nowTime = Date.now() // 记录当前时间
      // 如果这次摇的时间距离上次摇的时间有一定间隔 才执行
      if (nowTime - this.lastShakeTime < 1000) return
      if (acc.x > 1 && acc.y > 1) {
        this.getResult()
        wx.vibrateLong()
      }
      this.lastShakeTime = nowTime // 记录本次摇动时间，为下次计算摇动时间做准备
    }
  },
  watch: {
    blueprint: {
      deep: true,
      handler (nv, old) {
        console.warn('view page blueprint changed', nv, old)
        if (old) {
          this.isBlueprintChanged = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/style/base.scss';
.view-page {
  .blueprint-title {
    padding: 4px 8px;
    margin-top: 10px;
    font-size: 20px;
    text-align: center;
    color: $font-color;
  }
  .blueprint-desc {
    padding: 0 8px 6px;
    text-align: center;
    font-size: 14px;
    color: darken($font-color, 5%);
  }
  .scheme-error,
  .scheme-pending {
    margin-top: 10px;
    color: darken($font-color, 5%);
    height: 60%;
    padding: 10px;
    font-size: 16px;
    display: flex;//必须有，不然没有效果
    justify-content: center;
    align-items: center;
  }
}
</style>
