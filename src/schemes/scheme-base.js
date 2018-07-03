// import LZString from 'lz-string'
// import utils from '@/utils'

const base = {
  // get view page adjust panel
  getAdjustList (form, vm) {
    const ranges = []
    ranges.push(['结果不可重复', '结果可重复'])
    if (!vm.blueprint) return ranges
    const ccRange = this.getSecondList(vm, form.allowDuplicated)
    ranges.push(ccRange)
    const allowDuplicated = !!form.allowDuplicated
    const count = '' + form.choosedCount
    const cIdx = ccRange.findIndex(r => /(\d+)/.test(r) && count === RegExp.$1)
    return {
      ranges,
      indexs: [
        Number(allowDuplicated),
        cIdx === -1 ? 0 : cIdx
      ]
    }
  },
  // get options count list
  getSecondList (vm, allowDuplicated) {
    const isSame = allowDuplicated === vm.blueprint.form.allowDuplicated
    let cc = vm.blueprint.form.choosedCount
    let limit = Infinity
    if (!allowDuplicated) {
      if (!isSame) cc = 1
      let form = vm.blueprint.form
      if (vm.scheme.preprocessForm) form = vm.scheme.preprocessForm(form)
      limit = vm.scheme.getOptionCount(form)
    }
    const min = Math.max(1, cc - 15)
    const max = Math.min(min + 29, limit)
    // console.log('get adjust range', min, max, limit)
    const ccRange = Array
      .apply(null, Array(max - min + 1))
      .map((v, k) => '选' + (min + k) + '个')
    return ccRange
  },
  // on click save button on adjust panel
  adjustChange (detail, vm) {
    const form = vm.blueprint.form
    console.log('on change detail', detail)
    const allowDuplicated = vm.adjustIdxs[0] === 1
    let count = form.choosedCount
    if (/(\d+)/.test(vm.adjustRange[1][vm.adjustIdxs[1]])) {
      count = +RegExp.$1
    }
    console.log('adjustChange', allowDuplicated, count)
    return {
      allowDuplicated,
      choosedCount: count
    }
  },
  // on adjust panel column change
  columnChange (detail, vm) {
    console.log('this.detail', detail)
    if (detail.column !== 0) return
    vm.adjustRange[1].splice(0,
      vm.adjustRange[1].length,
      ...vm.getSecondList(detail.value === 1))
  },
  // get result words desc for copy
  getResultDesc (result, blueprint) {
    return blueprint.title + '\n' + result.join('\n')
  },
  // get share query string object
  getShareQs (result, blueprint) {
    const qs = {
      id: blueprint.id,
      title: blueprint.title,
      type: blueprint.type,
      result: result.join('\n')
    }
    console.log('qs', qs)
    return qs
  }
}

export default function extend (child) {
  return Object.assign({}, base, child)
}
