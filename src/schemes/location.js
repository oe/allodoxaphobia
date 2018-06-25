/**
 * 地理位置
 */
import utils from '@/utils'

export default {
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
        '美食', '酒店', '购物', '生活服务', '丽人', '旅游景点', '休闲娱乐', '运动健身', '教育培训', '文化传媒', '医疗', '汽车服务', '交通设施', '金融', '房地产', '公司企业', '政府机构', '出入口', '自然地物'
      ]
    },
    {
      key: 'query',
      label: '位置关键字',
      default: '',
      tip: '位置关键字, 使用 $ 分割多个关键字'
    },
    {
      key: 'distanceRang',
      label: '距离范围',
      type: 'select',
      default: '2',
      options: ['1km', '2km', '3km', '5km', '10km', '20km']
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
    form.distance = parseInt(form.distanceRang, 10) * 1000
    delete form.distanceRang
    return form
  },
  locations: [],
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
    this.locations = []
    const location = await utils.getLocation()
    const result = await utils.getNearbyLocations(Object.assign({}, form, {
      location
    }))
    this.locations = result
    return result
  },
  getAnOption (idx) {
    return this.locations[idx]
  },
  getSchemeDesc (form) {
    const desc = `从方圆${form.distanceRang}中选出${form.tag}类别中包含关键字${form.query}的位置`
    return desc
  }
}
