/**
 * 自定义选项
 */
export default {
  name: '自定义选项',
  form: [
    {
      key: 'options',
      label: '自定义选项',
      type: 'textarea',
      default: '',
      placeholder: '自定义选项, 一行一个选项, 也可以使用分号(;) 分割选项'
    }
  ],
  getOptionCount (form) {
    return form.options.length
  },
  getAnOption (idx, form) {
    return form.options[idx]
  },
  // 清理要保存的数据
  purgeForm (form) {
    form = Object.assign({}, form)
    form.options = form.options
      .split(/[\n;；]/g)
      .map(v => v.trim())
      .filter(v => !!v).join('\n')
    return form
  },
  // 校验数据合法性
  validateForm (form) {
    const optionCount = form.options.split('\n')
    if (!form.options || !optionCount) throw new Error('无可用选项')
    // 选项不允许重复, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount <= form.choosedCount) throw new Error(`筛选项数量(${form.choosedCount})不应大于可用选项数量(${optionCount})`)
  },
  // 使用前预处理数据
  preprocessForm (form) {
    form = Object.assign({}, form)
    form.options = form.options.split('\n')
    return form
  }
}
