<template>
<div class="location">
  <div class="xinput-cell">
    <input
      v-model="name"
      type="text"
      placeholder="选项的主题, 如: 去哪儿吃">
    <!-- <span class="btn" @tap="onSearch">GO</span> -->
  </div>
  <div class="xinput-cell">
    <textarea v-model="optionText" placeholder="你可以以空白字符(空格, 换行等)以及逗号来分割选项"></textarea>
  </div>
  <div class="xinput-cell">
    <span class="label">最多选几项</span>
    <input min="1" type="number" v-model="max">
  </div>
  <div class="pick-btn" @tap="onSave">保存</div>
</div>
</template>

<script>
// import utils from '@/utils'

export default {
  data () {
    return {
      name: '',
      max: 1,
      optionText: '',
      roll: {}
    }
  },
  mounted () {
    // this.rolls = (wx.getStorageSync('rolls') || [])
  },
  computed: {
    rolls () {
      return this.optionText.replace(/[\s,，；;]+/g, ' ').trim().split(' ')
    }
  },
  methods: {
    onMaxChange (e) {
      this.max = e.target.value
    },
    onSave () {
      // if (!this.rolls.length || !this.name.trim() || )
    }
  }
}
</script>

<style lang="scss">
.location {
  position: relative;

  .xinput-cell {
    width: 90%;
    max-width: 300px;
    margin: 10px auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 100;

    .label {
      padding-left: 8px;
      width: 120px;
      // flex: 1;
    }

    input, textarea {
      padding: 4px 8px;
      flex: auto;
    }

    select {
      text-align: center;
      width: 120px;
      color: #999;
    }

    textarea {
      height: 400px;
    }

  }



  .pick-btn {
    position: fixed;
    bottom: 30px;
    width: 50px;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #32c24d;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    padding: 4px 6px;
    font-weight: 100;
    line-height: 50px;
    font-size: 14px;
    opacity: .9;

    &:active {
      opacity: 1;
    }
  }
}
</style>
