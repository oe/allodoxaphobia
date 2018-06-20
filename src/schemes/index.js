import utils from '../utils'
import location from './location'
import a2z from './a2z'
import number from './number'
import options from './options'

const schemes = {
  location,
  a2z,
  number,
  options
}

function pickIdxs (len, count, allowDuplicated) {
  const allIdxs = Array.apply(0, Array(10)).map((v, i) => i)
  if (count === len) return allIdxs
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
async function getResult(schemeConfig) {
  const scheme = schemes[schemeConfig.type]
  if (!scheme) throw new Error('找不到可用的挑选方案')
  // 总选项个数
  const optionsCount = await scheme.getOptionsCount(schemeConfig)
  let schemeForm = schemeConfig.form
  // 预处理表单内容
  if (scheme.preprocessForm) {
    schemeForm = scheme.preprocessForm(schemeForm)
  }
  if (!schemeForm.allowDuplicated && schemeForm.choosedCount > optionsCount) {
    throw new Error('可用选项不够选')
  }
  const idxs = pickIdxs(optionsCount, schemeForm.choosedCount , schemeForm.allowDuplicated)
  return idxs
    .map((v) => scheme.getAnOption(v, schemeConfig))
    .filter( v => typeof v !== 'undefined')
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
  // 获取方案类型对应的默认配置
  getDefaultForm (schemeType) {
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
  getResult,
}
