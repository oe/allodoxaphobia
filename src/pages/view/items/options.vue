<template>
<div class="options-item">
  {{item}}
</div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin]
}
</script>

<style lang="scss">
@import '~@/style/base.scss';
.options-item {
  color: darken($font-color, 5%);
  padding: 10px 10px;
  font-size: 50px;
  text-align: center;

  .has-little-result & {
    font-size: 80px;
  }
}

</style>
