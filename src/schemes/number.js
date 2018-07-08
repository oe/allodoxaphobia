/**
 * 数字范围
 */
import createScheme from './scheme-base'
const child = {
  name: '从数字范围选择',
  // 定义选项内容
  form: [
    {
      key: 'min',
      label: '数字范围起点',
      default: 1,
      type: 'number',
      altTipKey: 'max',
      onChangeTip: true
    },
    {
      key: 'max',
      label: '数字范围终点',
      default: 10,
      type: 'number',
      onChangeTip: true
    }
  ],
  // 校验数据合法性
  validateForm (form) {
    if (form.min === form.max) throw new Error('区间范围不能相等')
    if (form.choosedCount > 1000) throw new Error(`😅选 ${form.choosedCount} 个是认真的么? 暂时不支持选出这么多结果啊, 若有使用场景可点左下角 反馈 按钮反馈`)
    if (form.allowDuplicated) return
    const totalCount = Math.abs(form.min - form.max) + 1
    if (form.choosedCount > totalCount) throw new Error(`以上范围有 ${totalCount} 个数字, 无法选出不重复的 ${form.choosedCount} 个`)
  },
  onInputChange (form) {
    if (form.max === '' || form.min === '') return ''
    return `上述范围内共有 ${Math.abs(form.min - form.max) + 1} 个数字`
  },
  onMaxChange (max, form) {
    console.warn(max, form)
    return this.onInputChange(form)
  },
  onMinChange (min, form) {
    console.warn(min, form)
    return this.onInputChange(form)
  },
  // 实际使用前预处理数据
  preprocessForm (form) {
    form = Object.assign({}, form)
    form.min = parseInt(form.min, 10)
    form.max = parseInt(form.max, 10)
    if (form.min > form.max) {
      let v = form.max
      form.max = form.min
      form.min = v
    }
    return form
  },
  getOptionCount (form) {
    return form.max - form.min + 1
  },
  getAnOption (idx, form) {
    return form.min + idx
  },
  getSchemeDesc (form) {
    form = this.preprocessForm(form)
    let desc = `从${form.min}~${form.max}中选出`
    desc += form.allowDuplicated ? '重复的' : '不重复的'
    desc += `${form.choosedCount}个数字`
    return desc
  },
  getAdjustList (form, vm) {
    form = this.preprocessForm(form)
    let start = form.min - 15
    if (start < 0) start = Math.max(0, start)
    const range1 = Array.apply(null, Array(30)).map((v, k) => start + k)
    const idx1 = range1.indexOf(form.min)

    start = form.max - 15
    const range2 = Array.apply(null, Array(30)).map((v, k) => start + k)
    const idx2 = range1.indexOf(form.max)
    return {ranges: [ range1, range2 ], indexs: [ idx1, idx2 ]}
  },
  columnChange () {},
  getAdjustedForm (detail, vm) {
    const ranges = vm.adjustRange
    let min = ranges[0][detail.value[0]]
    let max = ranges[1][detail.value[1]]
    const form = {min, max}
    this.validateForm(form)
    return form
  }
}

export default createScheme(child)
