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

function pickIdxs (len, count, allowDuplicate) {
  const allIdxs = Array.apply(0, Array(10)).map((v, i) => i)
  if (count === len) return allIdxs
  const result = []
  while (count--) {
    const idx = Math.floor(Math.random() * allIdxs.length)
    const val = allIdxs[idx]
    if (!allowDuplicate) {
      allIdxs.splice(idx, 1)
    }
    result.push(val)
  }
  return result
}


export default async function getValues(schemeConfig) {
  const scheme = schemes[schemeConfig.type]
  if (!scheme) throw new Error('no-scheme')
  // 总选项个数
  const optionsCount = await scheme.getOptionsCount(schemeConfig)
  // 选几项
  const selectCount = schemeConfig.selectCount || 1
  if (selectCount > optionsCount) throw new Error('no-enough-options')
  const idxs = pickIdxs(optionsCount, selectCount, schemeConfig.allowDuplicate)
  return idxs
    .map((v) => scheme.getAnOption(v, schemeConfig))
    .filter( v => typeof v !== 'undefined')
}
