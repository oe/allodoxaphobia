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
      tip: '自定义选项, 一行一个选项, 也可以使用分号(;) 分割选项'
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
    console.log('validate options form', form)
    const options = form.options.split('\n')
    const optionCount = options.length
    if (!form.options || !optionCount) throw new Error('无可用选项')
    let duplicated = options.filter((k, i) => i !== options.indexOf(k))
    // remove duplicated key in {duplicated}
    duplicated = duplicated.filter((k, i) => i === duplicated.indexOf(k))
    if (duplicated.length) throw new Error(`以下选项重复, 请检查后再提交\n${duplicated.join(';')}`)
    // 结果不允许重复时, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount <= form.choosedCount) throw new Error(`可用选项数量(${optionCount})应大于筛选项数量(${form.choosedCount})`)
  },
  // 使用前预处理数据
  preprocessForm (form) {
    form = Object.assign({}, form)
    form.options = form.options.split('\n')
    return form
  }
}
