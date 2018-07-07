/**
 * 地理位置
 */
import utils from '@/utils'
import store from '@/utils/store'
import createScheme from './scheme-base'
const INDUSTRY_TYPE = {
  '生活娱乐': 'life',
  '餐饮': 'cater',
  '宾馆': 'hotel'
}

const child = {
  name: '基于地理位置筛选',
  // 只能选一个
  singleton: true,
  form: [
    {
      key: 'tag',
      label: '位置行业类型',
      type: 'select',
      default: '0',
      options: [
        '全部行业(不在下述行业中时可选此项)',
        '餐饮',
        '生活娱乐',
        '宾馆'
      ]
    },
    {
      key: 'query',
      label: '位置关键字',
      default: '',
      tip: '使用 $ 分割多个关键字'
    },
    {
      key: 'distanceRang',
      label: '距离范围',
      type: 'select',
      default: '2',
      options: ['1km', '2km', '3km', '5km', '10km', '20km', '50km', '100km', '200km']
    }
  ],
  async validateForm (form) {
    const opt = this.preprocessForm(form)
    const len = await this.getOptionCount(opt)
    if (len) return
    await utils.confirm({
      title: '附近无相关位置',
      content: `在附近方圆 ${form.distanceRang} 未找到 ${form.tag} 类别中包含关键字 "${form.query}" 的位置, 是否继续添加?`,
      cancelText: '再想想',
      confirmText: '仍然添加',
      confirmColor: '#E6A23C'
    })
  },
  // 使用前预处理数据
  preprocessForm (form) {
    form = Object.assign({}, form)
    form.radius = parseInt(form.distanceRang, 10) * 1000
    if (INDUSTRY_TYPE[form.tag]) {
      form.filter = 'industry_type:' + INDUSTRY_TYPE[form.tag]
    }
    delete form.tag
    delete form.distanceRang
    return form
  },
  locations: [],
  locationCount: 0,
  lastCall: null,
  async getOptionCount (form) {
    // 结果缓存10s
    const CACHE_TIME = 10 * 1000
    const now = Date.now()
    const kwd = form.tag + '|' + form.distance + '|' + form.query
    // 搜索条件相关, 时间在 CACHE_TIME 之类, 则使用缓存结果
    if (this.lastCall &&
      this.lastCall.kwd === kwd &&
      (now - this.lastCall.time) <= CACHE_TIME) {
      return this.locations.length
    }
    const result = await this.getLocations(form)
    this.lastCall = {
      kwd,
      time: now
    }
    return result.length
  },
  async getLocations (form) {
    console.warn('get locations with', form)
    const PAGE_SIZE = 20
    this.locations = []
    store.commit('updateLocResStat')
    const location = await utils.getLocation()
    const result = await utils.getNearbyLocations(Object.assign({}, form, {
      location,
      page_size: PAGE_SIZE
    }))
    store.commit('updateLocResStat', {
      locTotal: result.total,
      locReceivedCount: result.results.length,
      locPageSize: PAGE_SIZE
    })
    this.locations = result.results
    return result
  },
  getAnOption (idx) {
    return this.locations[idx]
  },
  getSchemeDesc (form) {
    let desc = `从方圆 ${form.distanceRang} 中选出`
    if (INDUSTRY_TYPE[form.tag]) {
      desc += ` ${form.tag} 类别中`
    }
    desc += `包含关键字 ${form.query} 的位置`
    return desc
  },
  getResultDesc (result, title) {
    let str = title + '\n'
    return str + result.map((item) => {
      let ls = [
        item.name,
        item.address
      ]
      let str = ''
      if (item.detail_info && item.detail_info.distance) {
        str += '距离: ' + utils.formatDistance(item.detail_info.distance)
      }
      if (item.detail_info.overall_rating) str += ' / 评分: ' + item.detail_info.overall_rating
      if (item.detail_info.comment_num) str += ' / 评论数: ' + item.detail_info.comment_num
      if (item.telephone) str += ' / 电话: ' + item.telephone
      if (item.detail_info.price) {
        str += ' / 价格: ¥' + item.detail_info.price
      }
      ls.push(str.replace(/^\s*\/\s*/, ''))
      if (item.detail_info.tag) {
        ls.push('地图标签: ' + item.detail_info.tag)
      }
      if (item.detail_info && item.detail_info.detail_url) {
        ls.push('百度详情: ' + item.detail_info.detail_url)
      }
      return ls.join('\n')
    }).join('\n\n')
  },
  getAdjustList (form, vm) {
    const distanceRangs = this.getDistanceRanges()
    const distanceRang = form.distanceRang
    const idx = distanceRangs.findIndex(d => d === distanceRang)
    return {ranges: [ distanceRangs ], indexs: [ idx === -1 ? 0 : idx ]}
  },
  getDistanceRanges () {
    let distanceRangs = this.form.find(itm => itm.key === 'distanceRang')
    return distanceRangs.options
  },
  columnChange () {},
  adjustChange (detail, vm) {
    const idx = detail.value[0]
    const distanceRangs = this.getDistanceRanges()
    return {
      distanceRang: distanceRangs[idx]
    }
  },
  getShareQs (result, blueprint) {
    const first = result[0]
    const qs = {
      id: blueprint.id,
      title: blueprint.title,
      type: blueprint.type,
      result: first.uid
    }
    console.log('qs', qs)
    return qs
  }
}

export default createScheme(child)
