/**
 * 数字范围
 */
import utils from '../utils'

export default {
  name: '从数字范围选择',
  // 定义选项内容
  form: [
    {
      key: 'min',
      label: '数字范围',
      default: 1,
      type: 'number'
    },
    {
      key: 'max',
      label: '数字范围',
      default: 10,
      type: 'number'
    }
  ],
  // 提交前清理数据
  purgeForm (form) {
    form = Object.assign({}, form)
    form.min = form.min.trim()
    form.max = form.max.trim()
    return form
  },
  // 校验数据合法性
  validateForm (form) {
    if (form.min === form.max) throw new Error('区间范围不能相等')
    if (!utils.isInt(form.min) || !utils.isInt(form.max)) throw new Error('数字范围边界必须为整数')
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
  getOptionCount (config) {
    return config.form.max - config.form.min + 1
  },
  getAnOption (idx, config) {
    return config.form.min + idx
  }
}
