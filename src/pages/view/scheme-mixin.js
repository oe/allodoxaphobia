export default {
  methods: {
    getDefaultAdjustList () {
      const ranges = []
      ranges.push(['结果不可重复', '结果可重复'])
      if (!this.blueprint) return ranges
      const form = this.blueprint.form
      const ccRange = this.getSecondList(form.allowDuplicated)
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
    getSecondList (allowDuplicated) {
      let cc = this.blueprint.form.choosedCount
      let limit = Infinity
      if (!allowDuplicated) {
        let form = this.blueprint.form
        if (this.scheme.preprocessForm) form = this.scheme.preprocessForm(form)
        limit = this.scheme.getOptionCount(form)
      }
      const min = Math.max(1, cc - 15)
      const max = Math.min(min + 29, limit)
      // console.log('get adjust range', min, max, limit)
      const ccRange = Array
        .apply(null, Array(max - min + 1))
        .map((v, k) => '选' + (min + k) + '个')
      console.log('get range', allowDuplicated, ccRange)
      return ccRange
    },
    adjustChange (detail) {
      const form = this.blueprint.form
      console.log('on change detail', detail)
      const allowDuplicated = this.adjustIdxs[0] === 1
      let count = form.choosedCount
      if (/(\d+)/.test(this.adjustRange[1][this.adjustIdxs[1]])) {
        count = +RegExp.$1
      }
      console.log('adjustChange', allowDuplicated, count)
      // has change
      this.editBlueprint({
        id: this.blueprint.id,
        form: {
          allowDuplicated,
          choosedCount: count
        }
      })
    },
    columnChange (detail, vm) {
      console.log('this.detail', detail)
      if (detail.column !== 0) return
      this.adjustIdxs[detail.column] = detail.value
      this.adjustRange[1].splice(0,
        this.adjustRange[1].length,
        ...this.getSecondList(detail.value === 1))
      console.log('this.adjustRange', this.adjustRange)
    },
    getResultDesc (result, blueprint) {
      return blueprint.title + '\n' + result.join('\n')
    }
  }
}
