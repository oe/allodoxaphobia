/**
 * 地理位置
 */
import utils from '@/utils'
import store from '@/utils/store'
import createScheme from './scheme-base'
const INDUSTRY_TYPES = [
  '全部行业',
  '美食',
  '酒店',
  '购物',
  '生活服务',
  '丽人',
  '旅游景点',
  '休闲娱乐',
  '运动健身',
  '教育培训',
  '文化传媒',
  '医疗',
  '汽车服务',
  '交通设施',
  '金融',
  '房地产',
  '公司企业',
  '政府机构',
  '出入口',
  '自然地物'
]

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
      options: INDUSTRY_TYPES,
      tip: '选择准确的行业可避免搜索到无关的位置'
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
      default: '1',
      options: ['500m', '1km', '2km', '3km', '5km', '10km', '20km', '50km', '100km', '200km']
    }
  ],
  async validateForm (form) {
    const opt = this.preprocessForm(form)
    wx.showLoading({
      title: '正在校验...',
      mask: true
    })
    const len = await this.getOptionCount(opt)
    wx.hideLoading()
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
    if (/^(\d+)([a-z]+)$/.test(form.distanceRang)) {
      form.radius = parseInt(RegExp.$1, 10) * (RegExp.$2 === 'km' ? 1000 : 1)
    } else {
      console.warn('distance', form.distanceRang, 'from form', form, 'is invalid')
      form.radius = 1000
    }
    if (form.tag === INDUSTRY_TYPES[0]) {
      delete form.tag
    }
    // delete form.tag
    delete form.distanceRang
    return form
  },
  locations: [],
  locationCount: 0,
  lastCall: null,
  async getOptionCount (form) {
    // 结果缓存10s
    const CACHE_TIME = 60 * 1000
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
    return result.results
  },
  getAnOption (idx) {
    return this.locations[idx]
  },
  getSchemeDesc (form) {
    let desc = `从方圆 ${form.distanceRang} 中选出`
    if (form.tag !== INDUSTRY_TYPES[0]) {
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
