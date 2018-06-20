/**
 * 扑克牌
 */

const SUITE = ['♠️', '♥️', '♣️', '♦️']
const COLORS = ['black', 'red']
const SUITE_START = '🂢'
const SUITE_COUNT = 13
const JOKER = '🃟'

export default {
  name: '从扑克牌中选择',
  // 校验数据合法性
  validateForm (form) {
    const optionCount = this.getOptionsCount()
    // 选项不允许重复, 且筛选出的数量超过选项总数量
    if (!form.allowDuplicated && optionCount <= form.choosedCount) throw new Error(`筛选项数量(${form.choosedCount})不能大于扑克牌总数量`)
  },
  getOptionsCount () {
    return SUITE_COUNT * SUITE.length + 2
  },
  getAnOption (idx) {
    const sc = Match.ceil(idx / SUITE_COUNT)
    if (sc > SUITE.length) {
      return {
        char: JOKER,
        color: COLORS[idx % 2]
      }
    } else {
      let cp = SUITE_START.codePointAt(0) + idx
      // 增加offset, 系统自带的扑克符号中J和Q中多了一个C
      cp += Math.floor(idx / SUITE_COUNT) + Math.floor((idx % SUITE_COUNT) / 11)
      return {
        char: String.fromCodePoint(cp),
        color: COLORS[(sc - 1) % 2]
      }
    }
  }
}
