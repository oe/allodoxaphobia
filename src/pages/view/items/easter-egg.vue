<template>
<div class="easter-egg">
  <div class="egg" v-for="itm in totoal" :key="itm" :style="styles[itm]"></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      totoal: 50,
      styles: []
    }
  },
  created () {
    this.styles = Array.apply(null, Array(this.totoal)).map((v, idx) => {
      return this.getStyle(idx)
    })
  },
  methods: {
    getStyle () {
      let sty = `left: ${(Math.random() * 100).toFixed(1)}vw;`
      const duration = (Math.random() * 4 + 1).toFixed(1)
      const delay = (5 - duration).toFixed(1)
      const scale = (0.2 + Math.random() * 3).toFixed(1)
      sty += `animation-duration:${duration}s;animation-delay:${delay}s;transform:scale(${scale});`
      return sty
    }
  }
}
</script>

<style lang="scss">
@keyframes dropdown{
  0% {
    top: -10vh;
  }
  100% {
    top: 130vh;
  }
}
.easter-egg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(200, 200, 200, .6);

  .egg {
    position: absolute;
    width: 100px;
    height: 100px;
    top: -60px;
    font-style: normal;
    animation-iteration-count:infinite;
    animation-name: dropdown;

    &:before { content: '😈'; }
    &:nth-child(3n+2) {
      &:before {
        content: '🍗';
      }
    }
    &:nth-child(7n+2) {
      &:before {
        content: '👻';
      }
    }
  }
}
</style>
