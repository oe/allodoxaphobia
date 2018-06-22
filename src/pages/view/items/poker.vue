<template>
<div class="poker-item" :class="'is-' + item.color">
  {{item.char}}
</div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin]
}
</script>

<style lang="scss">
.poker-item {
  color: #333;
  padding: 30px 10px;
  font-size: 100px;
  text-align: center;

  &.is-red {
    color: red;
  }

  &.is-black {
    color: #333;
  }
}

</style>
