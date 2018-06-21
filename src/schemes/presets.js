import store from '@/utils/store'
// 预制方案定义
const presets = [
  {
    id: 'allodoxaphobia-food',
    title: '🍛 去哪儿吃饭',
    type: 'location',
    form: {
      choosedCount: 1,
      tag: '美食',
      query: '美食',
      distanceRang: '1KM'
    }
  },
  {
    id: 'allodoxaphobia-play',
    title: '🎾 周末玩什么',
    type: 'options',
    form: {
      choosedCount: 1,
      options: [
        '爬山',
        'K歌',
        '看电影',
        '骑单车',
        '宅'
      ].join('\n')
    }
  },
  {
    id: 'allodoxaphobia-dices',
    title: '🎲 掷骰子',
    type: 'options',
    form: {
      choosedCount: 1,
      options: [
        '⚀',
        '⚁',
        '⚂',
        '⚃',
        '⚄',
        '⚅'
      ].join('\n')
    }
  },
  {
    id: 'allodoxaphobia-morra',
    title: '✌️ 划拳',
    type: 'options',
    form: {
      choosedCount: 1,
      options: [
        '✌️',
        '✋',
        '✊'
      ].join('\n')
    }
  },
  {
    id: 'allodoxaphobia-coins',
    title: '🥇 抛硬币',
    type: 'options',
    form: {
      choosedCount: 1,
      options: [
        '正面',
        '反面'
      ].join('\n')
    }
  }
]

export default function () {
  const hasInstalled = wx.getStorageSync('presets-installed')
  if (hasInstalled) {
    console.log('presets installed already')
    return
  }
  console.log('start install presets')
  wx.setStorageSync('presets-installed', 'installed')
  store.commit('addBlueprints', presets)
  console.log('install presets sucessfully')
}
