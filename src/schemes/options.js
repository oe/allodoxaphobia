/**
 * 自定义选项
 */
export default {
  getOptionCount (config) {
    return config.options.length
  },
  getAnOption (idx, config) {
    return config.options[idx]
  }
}
