/**
 * 数字范围
 */
export default {
  getOptionCount (config) {
    return config.max - config.min + 1
  },
  getAnOption (idx, config) {
    return config.min + idx
  }
}
