<template>
<div class="sectors">
  <template v-for="(val, idx) in list">
    <div :class=" 'sector sector-' + idx">
      with {{idx}} & {{idx + 1}} cls {{cls}}, getTransform {{getTransform(idx)}}
    </div>
  </template>
</div>
</template>

<script>
export default {
  name: 'sectors',
  data () {
    return {
      idx: 0,
      val: '22',
      list: Array(15).fill(0)
    }
  },
  computed: {
    cls () {
      // console.log('cls')
      // const val = this.idx
      // this.idx += 1
      return 'sector-0'// + (val)
    }
  },
  methods: {
    getTransform (idx) {
      console.log('sector-' + idx)
      console.log('idx', idx)
      return 'sector-' + idx
    }
  }
}
</script>

<style lang="scss">
.sectors {
  width: 100%;
  /*height: 300px;*/
  padding-top: 100%;
  /*border: 1px solid #ccc;*/
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  .sector {
    position: absolute;
    transform-origin: 100% 100%;
    background: #ccc;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    border: 1px solid #999;
    margin-top: -100%;
    margin-left: -100%;

    @for $i from 0 through 14 {
      &.sector-#{$i} {
        $val: 75 + $i * 30;
        transform: rotate(#{$val}deg) skew(60deg);
      }
    }
  }

}
</style>
