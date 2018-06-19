// 方案定义
export default [
  {
    type: 'options',
    name: '自定义选项',
    form: [
      {
        key: 'options',
        label: '自定义选项',
        type: 'textarea'
        placeholder: '自定义选项, 一行一个选项, 也可以使用分号(;) 分割选项'
      }
    ]
  },
  {
    type: 'location',
    name: '基于地理位置筛选',
    // 不允许多选
    allMulti: false,
    form: [
      {
        key: 'cat',
        label: '位置类型',
        type: 'select',
        options: [
          {
            label: '',
            value: ''
          }
        ]
      },
      {
        key: 'kwd',
        label: '位置关键字',
        placeholder: '位置关键字, 可空'
      },
      {
        key: 'distance',
        label: '距离范围',
        type: 'select',
        options: ['1KM', '2KM', '3KM', '5KM', '10KM', '20KM']
      }
    ]
  },
  {
    type: 'a2z',
    name: '从字母A~Z选择'
  },
  {
    type: 'number',
    name: '从数字范围选择',
    form: [
      {
        key: 'min',
        label: '数字范围',
        type: 'number'
      },
      {
        key: 'max',
        label: '数字范围',
        type: 'number'
      }
    ]
  }
]
