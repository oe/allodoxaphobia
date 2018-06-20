// 预制方案定义
export default [
  {
    title: '去哪儿吃饭'
    type: 'location',
    form: {
      tag: '美食',
      query: '美食',
      distanceRang: '1KM'
    }
  },
  {
    title: '周末玩什么'
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
    title: '掷骰子'
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
    title: '划拳'
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
    title: '抛硬币'
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
