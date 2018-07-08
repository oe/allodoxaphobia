/**
 * 自定义选项
 */
import createScheme from './scheme-base'
const child = {
  name: '自定义选项',
  form: [
    {
      key: 'options',
      label: '自定义选项',
      type: 'textarea',
      default: '',
      tip: '一行一个选项, 也可以使用分号(;) 分割选项',
      onChangeTip: true
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
    let options = form.options
      .split(/[\n;；]/g)
      .map(v => v.trim())
      .filter(v => !!v)

    form.options = options.filter((k, i) => i === options.indexOf(k)).join('\n')
    return form
  },
  onOptionsChange (opts) {
    const allOpts = opts
      .split(/[\n;；]/g)
      .map(v => v.trim())
      .filter(v => !!v)
    const uniqueOpts = allOpts.filter((k, i) => i === allOpts.indexOf(k))
    if (!uniqueOpts.length) return ''
    let tip = `共找到 ${uniqueOpts.length} 个不重复选项`
    const duplicatedCount = allOpts.length - uniqueOpts.length
    if (duplicatedCount) {
      tip += `, ${duplicatedCount} 个重复项, 重复项将在保存时自动去除`
    }
    console.log('tip', tip)
    return tip
  },
  // 校验数据合法性
  validateForm (form) {
    console.log('validate options form', form)
    const options = form.options.split('\n')
    const optionCount = options.length
    if (!form.options || !optionCount) throw new Error('无可用选项')
    if (form.choosedCount > 1000) throw new Error(`😅选${form.choosedCount}个是认真的么? 暂时不支持选出这么多结果啊, 若有使用场景可点左下角 反馈 按钮反馈`)
    // 结果不允许重复时, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount < form.choosedCount) throw new Error(`总共只有 ${optionCount} 可选, 没法选出 ${form.choosedCount} 个不重复的结果`)
  },
  // 使用前预处理数据
  preprocessForm (form) {
    form = Object.assign({}, form)
    form.options = form.options.split('\n')
    return form
  },
  getSchemeDesc (form) {
    form = this.preprocessForm(form)
    let desc = `从${form.options.length}个选项中选出`
    desc += form.allowDuplicated ? '重复的' : '不重复的'
    desc += `${form.choosedCount}个选项`
    return desc
  }
}

export default createScheme(child)
