<template>
<div class="view-page" :class="isIphoneX ? 'is-iphonex' : ''">
  <div class="blueprint page-main" :class="'is-' + blueprint.type" v-if="blueprint">
    <div class="blueprint-title">{{ blueprint.title }}</div>
    <div v-if="status === 'failed'" class="scheme-error">
      {{error}}
    </div>
    <div v-if="status === 'success'" class="scheme-result">
      <block v-if="blueprint.type === 'location'">
        <location-item
          v-for="(item, k) in result"
          :isFromShare="true"
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
    <div v-if="status === 'pending'" class="scheme-pending">
      loading...
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
    </div>
    <div class="toolbar-item">
      <div class="btn-center icon icon-home" @tap="onGohome"></div>
    </div>
    <div class="toolbar-item-2">
      <div class="toolbar-item" @tap="onFeedBack">
        <div class="icon icon-feedback"></div>
        反馈
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import schemes from '@/schemes'
import utils from '@/utils'
import Actionsheet from '@/components/actionsheet'
import LZString from 'lz-string'
import pmixin from '../pmixin'
import NoBlueprint from '@/pages/view/items/no-blueprint'
import LocationItem from '@/pages/view/items/location'
import OptionsItem from '@/pages/view/items/options'
import PokerItem from '@/pages/view/items/poker'

export default {
  name: 'shared-view',
  mixins: [pmixin],
  data () {
    return {
      blueprint: null,
      // success, fail
      status: 'pending',
      error: '',
      result: null,
      lastShakeTime: 0,
      adjustIdxs: [0],
      oldAdjustIdxs: [0],
      adjustRange: [['其他请编辑']],
      acs: null
    }
  },
  // components,
  components: {
    NoBlueprint,
    LocationItem,
    OptionsItem,
    PokerItem,
    Actionsheet
  },
  created () {
    this.status = 'pending'
    this.result = null
  },
  async mounted () {
    const query = this.$root.$mp.query
    let pageArgs
    if (query.lzstr) {
      pageArgs = LZString.decompressFromEncodedURIComponent(query.lzstr)
      pageArgs = JSON.parse(pageArgs)
    } else {
      pageArgs = Object.keys(query).reduce((acc, k) => {
        acc[k] = decodeURIComponent(query[k])
        return acc
      }, {})
    }
    this.blueprint = {
      title: pageArgs.title,
      id: pageArgs.id,
      type: pageArgs.type
    }
    console.warn('pageArgs', pageArgs)
    if (pageArgs.type !== 'location') {
      if (!Array.isArray(pageArgs.result)) pageArgs.result = [pageArgs.result]
      this.result = pageArgs.result
      this.status = 'success'
    } else {
      try {
        const result = await utils.getLocationDetail(pageArgs.result)
        console.log('location detail', result)
        this.result = [result]
        this.status = 'success'
      } catch (e) {
        console.log('failed to get location info', e)
        this.error = e.message
        this.status = 'failed'
      }
    }
  },
  computed: {
    ...mapState(['guidance']),
    scheme () {
      if (!this.blueprint) return
      return schemes.getScheme(this.blueprint.type)
    },
    usageTip () {
      let tip = '点击页面下方中间的按钮可以回到小程序首页哦.'
      // first time for this user
      if (!Object.keys(this.guidance).length) {
        tip += '点击左下角的 分享 按钮可以复制文字结果, 也可以将也页面分享给其他好友'
      }
      return tip
    }
  },
  onShareAppMessage () {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const shareObj = {
      title: '关爱选择困难症',
      path: current.route
    }
    console.warn(shareObj)
    return shareObj
  },
  methods: {
    onGohome () {
      wx.reLaunch({
        url: `../alpha/main`
      })
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
    }
  }
}
</script>

<style lang="scss">
.view-page {
  .blueprint-title {
    padding: 4px 8px;
    margin-top: 10px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }
  .blueprint-desc {
    padding: 0 8px 6px;
    text-align: center;
    font-size: 14px;
    color: #888;
  }
  .scheme-error,
  .scheme-pending {
    color: #888;
    height: 60%;
    padding: 8px;
    display: flex;//必须有，不然没有效果
    justify-content: center;
    align-items: center;
  }
  .toolbar {
    .btn-center {
      background-color: #2f89fc;
      color: white;
    }
  }

}
</style>
