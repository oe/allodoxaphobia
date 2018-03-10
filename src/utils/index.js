import md5 from 'blueimp-md5'
const bdMapApi = 'https://api.map.baidu.com/place/v2/search'
const bdMapSK = 'dCGxoToz0SiyIGsYjunrz83Il1gdM4d6'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html
function request (options) {
  wx.request(options)
}

// http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi #周边检索
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

function getNearByLocations (data, options) {
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
    ak: 'kjvTGlp5qFHq913s4MCmiO170D4LFBeH'
  }
  if (typeof data.location === 'object') {
    data.location = `${data.location.latitude},${data.location.longitude}`
  }
  const requestData = Object.assign({}, defaultOptions, data)
  console.warn('requestData', requestData, serializeObj(requestData))
  let rawStr = bdMapApi.split('.com').pop() + '?' + serializeObj(requestData)
  rawStr += bdMapSK
  console.warn('rawStr', rawStr)
  requestData.sn = md5(rawStr)
  requestData.timestamp = Math.floor(Date.now() / 1000)
  options.data = requestData
  options.url = bdMapApi
  // console.log('before send')
  request(options)
}

function serializeObj (obj) {
  return Object.keys(obj).map(n => {
    return encodeURIComponent(n) + '=' + encodeURIComponent(obj[n])
  }).join('&')
}

export default {
  formatTime,
  request,
  getNearByLocations
}