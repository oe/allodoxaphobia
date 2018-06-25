/**
 * 数字范围
 */

export default {
  name: '从数字范围选择',
  // 定义选项内容
  form: [
    {
      key: 'min',
      label: '数字范围起点',
      default: 1,
      type: 'number'
    },
    {
      key: 'max',
      label: '数字范围终点',
      default: 10,
      type: 'number'
    }
  ],
  // 校验数据合法性
  validateForm (form) {
    if (form.min === form.max) throw new Error('区间范围不能相等')
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
  }
}
