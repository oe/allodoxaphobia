/**
 * 字母A~Z
 */

const LETTER_RANGE = 'AZ'
export default {
  getOptionsCount (config) {
    return LETTER_RANGE.charCodeAt(1) - LETTER_RANGE.charCodeAt(0) + 1
  },
  getAnOption (idx) {
    return String.fromCharCode(LETTER_RANGE.charCodeAt(0) + idx)
  }
}
