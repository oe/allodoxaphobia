/**
 * 麻将
 */

const COLORS = ['♠️黑桃', '♥️红桃', '♣️梅花', '♦️方块']
const SUITE_CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const SUITE_COUNT = SUITE_CARDS.length
const JOKERS = ['大王', '小王']

export default {
  getOptionsCount () {
    return SUITE_COUNT * COLORS.length + JOKERS.length
  },
  getAnOption (idx) {
    const sc = Match.ceil(idx / SUITE_COUNT)
    if (sc > COLORS.length) {
      return JOKERS[idx % JOKERS.length]
    } else {
      return COLORS[sc - 1] + SUITE_CARDS[idx % SUITE_CARDS.length]
    }
  }
}
