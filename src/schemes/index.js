import location from './location'
import a2z from './a2z'
import number from './number'
import options from './options'
// import poker from './poker'

const schemes = {
  options,
  location,
  a2z,
  number
  // poker
}

/**
 * 从数量 len
 * @param  {Number} len             最大可选项数量
 * @param  {Number} count           要选出的数量
 * @param  {Boolean} allowDuplicated 是否允许有重复的结构
 * @return {Array}                 选出的结果的索引
 */
function pickIdxs (len, count, allowDuplicated) {
  const allIdxs = Array.apply(null, Array(len)).map((v, i) => i)
  // 随机排序
  if (count === len) return allIdxs.sort(() => Math.random() > 0.5 ? -1 : 1)
  const result = []
  while (count--) {
    const idx = Math.floor(Math.random() * allIdxs.length)
    const val = allIdxs[idx]
    if (!allowDuplicated) {
      allIdxs.splice(idx, 1)
    }
    result.push(val)
  }
  return result
}

// 获取筛选结果
async function getResult (schemeConfig) {
  const scheme = schemes[schemeConfig.type]
  if (!scheme) throw new Error('找不到可用的挑选方案')
  let schemeForm = schemeConfig.form
  // 预处理表单内容
  if (scheme.preprocessForm) {
    schemeForm = scheme.preprocessForm(schemeForm)
  }
  // 总选项个数
  const optionsCount = await scheme.getOptionCount(schemeForm, schemeConfig)
  if (!schemeForm.allowDuplicated && schemeForm.choosedCount > optionsCount) {
    let tip = '可用选项不够选'
    if (!optionsCount && schemeConfig.type === 'location') {
      tip = '附近有点荒凉啊, 没有找到任何相关位置'
    } else {
      console.error('can not get enough options to choose', schemeConfig, 'optionsCount', optionsCount)
    }
    throw new Error(tip)
  }
  const idxs = pickIdxs(optionsCount, schemeForm.choosedCount || 1, schemeForm.allowDuplicated)
  return idxs
    .map((v) => scheme.getAnOption(v, schemeForm))
    .filter(v => typeof v !== 'undefined')
}

export default {
  // 获取可用的方案类型及描述
  getSchemeTypes () {
    return Object.keys(schemes).map((k) => {
      return {
        value: k,
        label: schemes[k].name
      }
    })
  },
  getScheme (schemeType) {
    return schemes[schemeType]
  },
  // 获取方案类型对应的默认配置
  getDefaultSchemeForm (schemeType) {
    const scheme = schemes[schemeType]
    const form = {}
    if (scheme.form) {
      scheme.form.reduce((acc, cur) => {
        acc[cur.key] = cur.default
        return acc
      }, form)
    }
    form.allowDuplicated = false
    form.choosedCount = 1
    return form
  },
  getResult
}
