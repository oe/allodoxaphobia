/**
 * 字母A~Z
 */

const LETTER_RANGE = 'AZ'
export default {
  name: '从字母A~Z选择',
  // 校验数据合法性
  validateForm (form) {
    const optionCount = this.getOptionCount()
    // 选项不允许重复, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount <= form.choosedCount) throw new Error(`筛选项数量(${form.choosedCount})不能大于字母总数量(${optionCount})`)
  },
  getOptionCount (config) {
    return LETTER_RANGE.charCodeAt(1) - LETTER_RANGE.charCodeAt(0) + 1
  },
  getAnOption (idx) {
    return String.fromCharCode(LETTER_RANGE.charCodeAt(0) + idx)
  }
}
