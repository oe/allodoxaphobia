export default {
  methods: {
    getAdjustList () {
      const ranges = []
      ranges.push(['结果不可重复', '结果可重复'])
      if (!this.blueprint) return ranges
      let cc = this.blueprint.form.choosedCount
      let limit = Infinity
      if (!this.blueprint.allowDuplicated) {
        let form = this.blueprint.form
        if (this.scheme.preprocessForm) form = this.scheme.preprocessForm(form)
        limit = this.scheme.getOptionCount(form)
      }
      const min = Math.max(1, cc - 15)
      const max = Math.min(min + 30, limit)
      console.log('get adjust range', min, max, limit)
      const ccRange = Array
        .apply(null, Array(max - min + 1))
        .map((v, k) => '选' + (min + k) + '个')
      ranges.push(ccRange)
      return ranges
    },
    getResultDesc (result, blueprint) {
      return blueprint.title + '\n' + result.join('\n')
    }
  }
}
