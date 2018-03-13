<template>
<div class="card" :class="{'card-active': isActive }"
  @tap="onTap"
  @touchstart="onTouchstart"
  @touchcancel="onTouchEnd"
  @touchend="onTouchEnd">
  <div class="card-overlay" :class="type"></div>
  <div class="card-inner">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      isActive: false
    }
  },
  props: {
    type: String
  },
  computed: {
  },
  methods: {
    onTap (e) {
      this.$emit('tap', e)
    },
    onTouchstart () {
      this.isActive = true
    },
    onTouchEnd (e) {
      this.isActive = false
    }
  }
}
</script>

<style lang="scss">
.card {
  position: relative;
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  margin: 10px;
  height: 200px;
  // background-color: lightblue;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  font-size: 40px;
  font-weight: 200;
  text-shadow: 0 1px 10px rgba(0,0,0,.6);

  &.card-active {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    text-shadow: 0 1px 5px rgba(0,0,0,.6);
  }

  .card-overlay {
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: contain;
    filter: blur(1.5px);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: .5;

    &.food {
      background-color: pink;
      background-image: url('~static/icons/food.svg');
    }

    &.location {
      background-color: lightblue;
      background-image: url('~static/icons/location.svg');
    }
    &.morra {
      background-color: #ead0a9;
      background-image: url('~static/icons/scissors-hand.svg');
    }
  }
  &:nth-child(even) {
    .card-overlay {
      background-position: left bottom;
    }
  }
}
</style>
