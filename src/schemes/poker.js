/**
 * 扑克牌
 */
import createScheme from './scheme-base'
const SUITE = ['♠️', '♥️', '♣️', '♦️']
const COLORS = ['black', 'red']
const SUITE_START = '🂡'
const SUITE_COUNT = 13
const JOKER = '🃟'

const child = {
  name: '从扑克牌中选择',
  // 校验数据合法性
  validateForm (form) {
    const optionCount = this.getOptionsCount()
    // 选项不允许重复, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount <= form.choosedCount) throw new Error(`筛选项数量(${form.choosedCount})不能大于扑克牌总数量`)
  },
  getOptionCount () {
    return SUITE_COUNT * SUITE.length + 2
  },
  getAnOption (idx) {
    const sc = Math.ceil((idx + 1) / SUITE_COUNT)
    if (sc > SUITE.length) {
      return {
        char: JOKER,
        color: COLORS[idx % 2]
      }
    } else {
      let cp = SUITE_START.codePointAt(0) + idx
      // 增加offset, 系统自带的扑克符号中J和Q中多了一个C
      cp += Math.floor(idx / SUITE_COUNT) * 3 + Math.floor((idx % SUITE_COUNT) / 11)
      return {
        char: String.fromCodePoint(cp),
        color: COLORS[(sc - 1) % 2]
      }
    }
  },
  getSchemeDesc (form) {
    let desc = `从${this.getOptionCount()}张扑克牌中选出`
    desc += form.allowDuplicated ? '重复的' : '不重复的'
    desc += `${form.choosedCount}张牌`
    return desc
  }
}

export default createScheme(child)
