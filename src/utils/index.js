import md5 from 'blueimp-md5'
const bdMapSearchApi = 'https://api.map.baidu.com/place/v2/search'
const bdMapDetailApi = 'https://api.map.baidu.com/place/v2/detail'
const bdMapSK = 'dCGxoToz0SiyIGsYjunrz83Il1gdM4d6'
const bdMapAK = 'kjvTGlp5qFHq913s4MCmiO170D4LFBeH'
const LOCATION_SCOPE = 'scope.userLocation'

// https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html
function request (options) {
  return new Promise((resolve, reject) => {
    options.success = resolve
    options.fail = reject
    wx.request(options)
  })
}

// http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi #周边检索
// 算法参考 https://github.com/MadHouses/baidu_map/blob/master/index.js
// 请求参数
// api: http://api.map.baidu.com/place/v2/search
//  {
//    query: '', // 关键字
//    tag: '', // POI分类
//    location: '', // 位置 lat,lng
//    radius: '1000', // 检索距离半径 m
//    radius_limit: false, // 严格按半径检索
//    output: 'json', // 响应数据类型
//    scope: '2', // 返回的数据详细程度, 2 详细信息
//    filter: '', // 排序过滤选项
//    coord_type: 2, // 坐标类型 2 为 火星坐标系
//    ret_coordtype: 'gcj02ll', // 返回的坐标类型
//    page_size: 20, // 每页最多多少条
//    page_num: 0, // 页码
//    ak: 'kjvTGlp5qFHq913s4MCmiO170D4LFBeH',
//    sn: 'xxx',
//    timestamp: 'xxx'
//  }
// 使用百度地图接口请求周边位置数据
async function getNearbyLocations (data, options = {}) {
  const defaultOptions = {
    radius: '1000', // 检索距离半径 m
    radius_limit: false, // 严格按半径检索
    output: 'json', // 响应数据类型
    scope: '2', // 返回的数据详细程度, 2 详细信息
    // filter: '', // 排序过滤选项
    coord_type: 2, // 坐标类型 2 为 火星坐标系
    ret_coordtype: 'gcj02ll', // 返回的坐标类型
    page_size: 20, // 每页最多多少条
    page_num: 0, // 页码
    ak: bdMapAK,
    timestamp: Date.now()
  }
  const requestData = Object.assign({}, defaultOptions, data)
  if (typeof requestData.location === 'object') {
    requestData.location = `${requestData.location.latitude},${requestData.location.longitude}`
  }
  let rawStr = bdMapSearchApi.split('.com').pop() + '?' + serializeObj(requestData)
  rawStr += bdMapSK
  requestData.sn = md5(fixedEncodeURIComponent(rawStr))
  options.data = requestData
  options.url = bdMapSearchApi
  const result = await request(options)
  // console.warn('result', result)
  if (result.data.status !== 0) throw new Error(JSON.stringify(result.data))

  return result.data.results
}

async function getLocationDetail (uid) {
  const defaultOptions = {
    output: 'json', // 响应数据类型
    scope: '2', // 返回的数据详细程度, 2 详细信息
    ak: bdMapAK,
    timestamp: Date.now()
  }
  const options = {uid}
  const requestData = Object.assign({}, defaultOptions, options)
  let rawStr = bdMapDetailApi.split('.com').pop() + '?' + serializeObj(requestData)
  rawStr += bdMapSK
  requestData.sn = md5(fixedEncodeURIComponent(rawStr))
  options.data = requestData
  options.url = bdMapDetailApi
  const result = await request(options)
  // console.warn('result', result)
  if (result.data.status !== 0) throw new Error(JSON.stringify(result.data))
  return result.data.result
}

function serializeObj (obj) {
  return Object.keys(obj).map(n => {
    return fixedEncodeURIComponent(n) + '=' + fixedEncodeURIComponent(obj[n])
  }).join('&')
}
// 修正 EncodeURIComponent对特殊字符的处理
function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16)
  })
}

// 获取地理位置
async function getLocation () {
  const config = await getSetting()
  if (!config || !config[LOCATION_SCOPE]) {
    await authorize(LOCATION_SCOPE)
  }
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('get location success')
        res.lat = res.latitude
        res.lng = res.longitude
        // this.location = res
        // this.statusTip = '坐标获取成功😏'
        resolve(res)
      },
      fail: (err) => {
        console.log('get location failed', err)
        // this.statusTip = '坐标获取失败😭, 麻烦先授权小程序获取地理位置🙏🏻'
        err.isLocation = true
        reject(err)
      },
      complete (ee) {
        console.log('get location complete')
      }
    })
  })
}

// 授权
function authorize (scope) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
      success: resolve,
      fail: reject
    })
  })
}

// 获取微信配置项
function getSetting () {
  return new Promise((resolve, reject) => {
    wx.getSetting({success: (res) => resolve(res.authSetting), fail: reject})
  })
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

function confirm (config) {
  return new Promise((resolve, reject) => {
    wx.showModal(Object.assign({}, config, {
      success: (res) => {
        if (res.confirm) resolve(res)
        else {
          res.isConfirm = true
          reject(res)
        }
      },
      fail (err) {
        console.warn('failed to call wx.showModal with config', config, err)
      }
    }))
  })
}

function formatDistance (d) {
  if (!d) return
  if (d <= 1000) return `${d}m`
  else return (d / 1000).toFixed(2) + 'km'
}

function copy (str, tip) {
  wx.setClipboardData({
    data: str
  })
  wx.showToast({
    title: tip,
    mask: true,
    icon: 'success'
  })
}

// 深度比较对象是否相等
function deepEqual (o1, o2) {
  const t1 = typeof o1
  const t2 = typeof o2
  if (t1 !== t2) return false
  if (t1 === 'object') {
    if (!o1 || !o2) {
      if (o1 !== o2) return false
    } else {
      const ks = Object.keys(o1)
      for (let i = 0; i < ks.length; i++) {
        const k = ks[i]
        if (!deepEqual(o1[k], o2[k])) return false
      }
    }
  } else {
    if (o1 !== o2) return false
  }
  return true
}

export default {
  deepEqual,
  copy,
  formatDistance,
  confirm,
  guid,
  request,
  getLocation,
  getNearbyLocations,
  getLocationDetail
}
