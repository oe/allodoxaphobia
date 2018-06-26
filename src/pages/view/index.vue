<template>
<div class="view-page" :class="isIphoneX ? 'is-iphonex' : ''">
  <div class="blueprint page-main" :class="'is-' + blueprint.type" v-if="blueprint">
    <div class="blueprint-title">{{ blueprint.title }}</div>
    <div class="blueprint-desc">{{ blueprintDesc }}</div>
    <div v-if="status === 'failed'" class="scheme-error">
      {{error}}
    </div>
    <div v-if="status === 'success'" class="scheme-result">
      <template v-if="blueprint.type === 'location'">
        <location-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </location-item>
      </template>
      <template v-if="blueprint.type === 'options'">
        <options-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </options-item>
      </template>
      <template v-if="blueprint.type === 'number'">
        <options-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </options-item>
      </template>
      <template v-if="blueprint.type === 'a2z'">
        <options-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </options-item>
      </template>
      <template v-if="blueprint.type === 'poker'">
        <poker-item
          v-for="(item, k) in result"
          :key="k"
          :item="item">
        </poker-item>
      </template>
    </div>
    <div v-if="status === 'pending'" class="scheme-pending">
      loading...
    </div>
  </div>
  <NoBlueprint v-else></NoBlueprint>
  <div class="toolbar" v-if="blueprint">
    <div class="toolbar-item-2">
      <div class="toolbar-item" @tap="copyResult" v-if="!!result">
        <div class="icon icon-copy"></div>
        复制结果
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
      <div class="btn-center icon icon-gift" @tap="onOnemore"></div>
    </div>
    <div class="toolbar-item" @tap="onEditBlueprint">
      <div class="icon icon-edit"></div>
      编辑
    </div>
    <div class="toolbar-item">
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
import pmixin from '../pmixin'
import schemeMixin from './scheme-mixin'
import NoBlueprint from './no-blueprint'
import LocationItem from './items/location'
import OptionsItem from './items/options'
import PokerItem from './items/poker'

export default {
  mixins: [pmixin, schemeMixin],
  data () {
    return {
      status: 'pending',
      error: '',
      result: null,
      lastShakeTime: 0,
      adjustIdxs: [0],
      oldAdjustIdxs: [0],
      adjustRange: [['其他请编辑']]
    }
  },
  // components,
  components: {
    NoBlueprint,
    LocationItem,
    OptionsItem,
    PokerItem
  },
  created () {
    this.status = 'pending'
    this.result = null
  },
  mounted () {
    const query = this.$root.$mp.query
    console.log('quryid', query)
    this.switch2(query.id)
    this.updatePage()
    this.getAdjustList()
  },
  computed: {
    ...mapState(['blueprint']),
    scheme () {
      if (!this.blueprint) return
      return schemes.getScheme(this.blueprint.type)
    },
    blueprintDesc () {
      if (!this.scheme || !this.scheme.getSchemeDesc) return ''
      return this.scheme.getSchemeDesc(this.blueprint.form, this.blueprint)
    }
  },
  methods: {
    ...mapMutations(['switch2', 'editBlueprint']),
    updatePage () {
      if (!this.blueprint) return
      this.getResult()
      wx.onAccelerometerChange(this.shake)
    },
    getAdjustList () {
      let result
      if (!this.scheme || !this.blueprint) return []
      if (this.scheme.getAdjustList) {
        result = this.scheme.getAdjustList(this.blueprint.form)
      } else {
        result = this.getDefaultAdjustList()
        console.log('range result', result)
      }
      result.ranges.push(['其他请编辑'])
      result.indexs.push(0)
      this.adjustRange = result.ranges
      this.adjustIdxs = result.indexs
      this.oldAdjustIdxs = result.indexs
    },
    onEditBlueprint () {
      const id = this.blueprint.id
      console.log('going to edit of id', id)
      wx.navigateTo({url: `../edit/edit?id=${id}`})
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
      if (this.scheme.adjustChange) {
        this.scheme.adjustChange(e.mp.detail, this)
      } else {
        this.adjustChange(e.mp.detail, this)
      }
      wx.showToast({
        title: '配置已保存, 即将重新获取结果',
        mask: true,
        icon: 'none'
      })
      this.getResult()
    },
    onAdjustCancel () {
      this.getAdjustList()
    },
    onColumnchange (e) {
      console.log('onColumnchange', e.detail, e)
      if (this.scheme.columnChange) {
        this.scheme.columnChange(e.mp.detail, this)
      } else {
        this.columnChange(e.mp.detail, this)
      }
    },
    onOnemore () {
      if (this.status === 'pending') return
      this.getResult()
    },
    async getResult () {
      try {
        this.status = 'pending'
        let result = await schemes.getResult(this.blueprint)
        if (!Array.isArray(result)) result = [result]
        if (!result.length) {
          throw new Error('😱木有找到任何可用选项, 这可能是个bug')
        }
        wx.vibrateShort()
        this.result = result
        this.status = 'success'
      } catch (e) {
        this.status = 'failed'
        if (e.isLocation) {
          this.error = '获取地理位置失败, 请先授权小程序获取地理位置, 或者授权允许微信获取地理位置'
        } else {
          this.error = e.message
        }
      }
    },
    // 复制结果
    copyResult () {
      let str
      if (this.scheme.getResultDesc) {
        str = this.scheme.getResultDesc(this.result, this.blueprint)
      } else {
        str = this.getResultDesc(this.result, this.blueprint)
      }
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
