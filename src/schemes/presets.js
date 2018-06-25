import store from '@/utils/store'
// 预制方案定义
const presets = [
  {
    id: 'allodoxaphobia-wherefood',
    title: '📌 去哪儿吃饭',
    type: 'location',
    form: {
      choosedCount: 1,
      tag: '美食',
      query: '美食',
      distanceRang: '1km'
    }
  },
  {
    id: 'allodoxaphobia-eatfood',
    title: '🍛 吃什么',
    type: 'options',
    form: {
      choosedCount: 1,
      options: [
        '湘菜',
        '烧烤',
        '粤菜',
        '川菜',
        '沙县小吃',
        '火锅'
      ].join('\n')
    }
  },
  {
    id: 'allodoxaphobia-play',
    title: '🏖 周末玩什么',
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
  },
  // {
  //   id: 'allodoxaphobia-getpoker',
  //   title: '🃏 选张扑克牌',
  //   type: 'poker',
  //   form: {
  //     choosedCount: 1
  //   }
  // },
  {
    id: 'allodoxaphobia-getnumber',
    title: '💯 选个幸运数',
    type: 'number',
    form: {
      choosedCount: 1,
      min: 1,
      max: 100
    }
  }
]

export default function () {
  const ver = '0.4'
  const installedVer = wx.getStorageSync('presets-installed')
  if (installedVer === ver) {
    console.log('presets installed already')
    return
  }
  console.log('start install presets')
  store.commit('removeAllBlueprint')
  wx.setStorageSync('presets-installed', ver)
  store.commit('addBlueprints', presets)
  console.log('install presets sucessfully')
}
