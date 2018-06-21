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
.options-item {
  color: #333;
  padding: 30px 10px;
  font-size: 100px;
  text-align: center;
}

</style>
