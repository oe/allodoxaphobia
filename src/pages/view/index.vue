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
    <div class="toolbar-item">
      <div class="icon icon-adjust"></div>
      微调
    </div>
    <div class="toolbar-item">
      <div class="icon icon-copy"></div>
      复制结果
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
import pmixin from '../pmixin'
import NoBlueprint from './no-blueprint'
import LocationItem from './items/location'
import OptionsItem from './items/options'
import PokerItem from './items/poker'

export default {
  mixins: [pmixin],
  data () {
    return {
      status: 'pending',
      error: '',
      result: null,
      lastShakeTime: 0,
      lastShake: { x: 0, y: 0, z: 0 }
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
    ...mapMutations(['switch2']),
    updatePage () {
      // this.updateTitle()
      if (!this.blueprint) return
      this.getResult()
      wx.onAccelerometerChange(this.shake)
    },
    onEditBlueprint () {
      const id = this.blueprint.id
      console.log('going to edit of id', id)
      wx.navigateTo({url: `../edit/edit?id=${id}`})
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
    shake (acc) {
      const nowTime = Date.now() // 记录当前时间
      // 如果这次摇的时间距离上次摇的时间有一定间隔 才执行
      if (nowTime - this.lastShakeTime < 100) return
      var diffTime = nowTime - this.lastShakeTime // 记录时间段
      this.lastShakeTime = nowTime // 记录本次摇动时间，为下次计算摇动时间做准备
      const cur = {
        x: acc.x, // 获取x轴数值，x轴为垂直于北轴，向东为正
        y: acc.y, // 获取y轴数值，y轴向正北为正
        z: acc.z  // 获取z轴数值，z轴垂直于地面，向上为正
      }
      // 计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
      var speed = Math.abs(cur.x + cur.y + cur.z - this.lastShake.x - this.lastShake.y - this.lastShake.z) / diffTime * 10000
      // console.log(speed)
      // //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
      if (speed > 80) {
        wx.vibrateLong()
        console.log('on shake')
        this.getResult()
      }
      this.lastShake = cur
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
      background-color: #fffdb7;
    }
  }

}
</style>
