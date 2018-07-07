import store from '@/utils/store'
// 预制方案定义
const presets = [
  {
    id: 'allodoxaphobia-where-food',
    title: '📌 去哪儿吃饭',
    type: 'location',
    form: {
      choosedCount: 1,
      tag: '餐饮',
      query: '美食',
      distanceRang: '1km'
    }
  },
  {
    id: 'allodoxaphobia-eat-what',
    title: '🍛 吃什么',
    type: 'options',
    form: {
      allowDuplicated: false,
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
      allowDuplicated: false,
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
      allowDuplicated: false,
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
      allowDuplicated: false,
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
      allowDuplicated: false,
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
    id: 'allodoxaphobia-get-number',
    title: '💯 选个幸运数',
    type: 'number',
    form: {
      allowDuplicated: false,
      choosedCount: 1,
      min: 1,
      max: 100
    }
  },
  {
    id: 'allodoxaphobia-getnumber',
    title: '🔤 选个幸运字母',
    type: 'a2z',
    form: {
      allowDuplicated: false,
      choosedCount: 1
    }
  },
  {
    id: 'allodoxaphobia-duty-order',
    title: '💼 周末值班顺序',
    type: 'options',
    form: {
      allowDuplicated: false,
      choosedCount: 10,
      options: [
        '刘一',
        '陈二',
        '张三',
        '李四',
        '王五',
        '赵六',
        '孙七',
        '周八',
        '吴九',
        '郑十'
      ].join('\n')
    }
  },
  {
    id: 'allodoxaphobia-pick-prize-winner',
    title: '🎁 年会特等奖选手抽取',
    type: 'options',
    form: {
      allowDuplicated: false,
      choosedCount: 1,
      options: [
        '刘一',
        '陈二',
        '张三',
        '李四',
        '王五',
        '赵六',
        '孙七',
        '周八',
        '吴九',
        '郑十'
      ].join('\n')
    }
  }
]

export default function () {
  const ver = '0.9'
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
