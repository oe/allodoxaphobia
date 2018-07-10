/**
 * 字母A~Z
 */
import createScheme from './scheme-base'
const LETTER_RANGE = 'AZ'
const child = {
  name: '从字母A~Z选择',
  // 校验数据合法性
  validateForm (form) {
    const optionCount = this.getOptionCount()
    // 选项不允许重复, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount <= form.choosedCount) {
      throw new Error(
        `英文字母总共 ${optionCount} 个, 没法选出不重复的 ${
          form.choosedCount
        } 个😳`
      )
    }
  },
  getOptionCount () {
    return LETTER_RANGE.charCodeAt(1) - LETTER_RANGE.charCodeAt(0) + 1
  },
  getAnOption (idx) {
    return String.fromCharCode(LETTER_RANGE.charCodeAt(0) + idx)
  },
  getSchemeDesc (form) {
    let desc = '从26个字母中选出'
    desc += form.allowDuplicated ? '重复的' : '不重复的'
    desc += `${form.choosedCount}个字母`
    return desc
  }
}

export default createScheme(child)
