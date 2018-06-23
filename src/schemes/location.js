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
      options: ['1KM', '2KM', '3KM', '5KM', '10KM', '20KM']
    }
  ],
  // 使用前预处理数据
  preprocessForm (form) {
    form = Object.assign({}, form)
    form.distance = parseInt(form.distanceRang, 10) * 1000
    delete form.distanceRang
    return form
  },
  locations: [],
  async getOptionCount (form) {
    const result = await this.getLocations(form)
    return result.length
  },
  async getLocations (form) {
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
  }
}
