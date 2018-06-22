<template>
<div class="location">
  <div class="xinput-cell">
    <input
      v-model="title"
      type="text"
      placeholder="选项的主题, 如: 去哪儿吃">
  </div>
  <div class="xinput-cell">
    <span class="label">自定义选项类型</span>
    <picker
      :value="typeIdx"
      :range="typeLabels"
      @change="onTypeChange">
      <div>{{typeLabels[typeIdx]}}</div>
    </picker>
  </div>
  <template v-for="formItem in scheme.form">
    <div class="xinput-cell" v-if="formItem.type === 'textarea'">
      <span class="label">{{formItem.label}}</span>
      <textarea
        v-model="form[formItem.key]"
        :placeholder="formItem.placeholder || ''"
        ></textarea>
      <button @tap="onScanCode(formItem.key)">扫码获取选项内容</button>
    </div>
    <div class="xinput-cell" v-if="formItem.type === 'select'">
      <span class="label">{{formItem.label}}</span>
      <picker
        @change="onPickerChnage($event, formItem.key)"
        :value="form[formItem.key]"
        :range="formItem.options"
        >
        <div>{{formItem.options[form[formItem.key]]}}</div>
      </picker>
    </div>
    <div class="xinput-cell" v-if="!formItem.type || formItem.type === 'text'">
      <span class="label">{{formItem.label}}</span>
      <input type="text" v-model="form[formItem.key]" :placeholder="formItem.placeholder || ''">
    </div>
  </template>
  <div class="xinput-cell" v-if="!scheme.singleton">
    <span class="label">选几项</span>
    <input min="1" type="number" v-model="form.choosedCount">
  </div>
  <div class="xinput-cell" v-if="!scheme.singleton">
    <span class="label">允许重复选项</span>
    <input type="checkbox" v-model="form.allowDuplicated">
  </div>
  <div class="pick-btn" @tap="onSave">保存</div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import schemes from '@/schemes'
const allTypes = schemes.getSchemeTypes()

export default {
  data () {
    return {
      title: '',
      chooosedCount: 1,
      typeIdx: 0,
      form: {}
    }
  },
  mounted () {
    if (this.blueprint) {
      this.form = Object.assign({}, this.blueprint.form)
      console.log('onmounted', this.blueprint)
      this.typeIdx = allTypes.findIdx(t => t.value === this.blueprint.type)
    } else {
      this.onTypeChange()
    }
  },
  computed: {
    ...mapState(['blueprint']),
    typeLabels () {
      return allTypes.map(t => t.label)
    },
    schemeType () {
      console.log('this.typeIdx', this.typeIdx)
      const t = allTypes[this.typeIdx]
      return t && t.value
    },
    scheme () {
      console.log('scheme this.schemeType', this.schemeType)
      return schemes.getScheme(this.schemeType)
    }
  },
  methods: {
    ...mapMutations(['addBlueprints']),
    onScanCode (key) {
      wx.scanCode({
        onlyFromCamera: false,
        success (res) {
          console.log('扫码内容', res)
          if (key in this.form) this.form[key] = res.result
        },
        fail (e) {
          console.log('扫码失败', e)
        }
      })
    },
    onSave () {
      let form = Object.assign({}, this.form)
      // 将下拉选框的 index 转换为对应的值
      this.scheme.form.forEach(f => {
        if (f.type !== 'select') return
        form[f.key] = f.options[form[f.key]]
      })

      if (this.scheme.purgeForm) form = this.scheme.purgeForm(form)
      try {
        if (this.scheme.validateForm) this.scheme.validateForm(form)
        const blueprint = {
          form,
          title: this.title,
          type: this.schemeType
        }
        if (this.blueprint) blueprint.id = this.blueprint.id
        this.addBlueprints(blueprint)
      } catch (e) {
        console.log(e)
        wx.showModal({
          title: '保存选项失败',
          content: e.message,
          showCancel: false
        })
      }
    },
    onPickerChnage (e, k) {
      console.log('onPickerChnage', e, k)
      // const config = this.scheme.form.find( c => c.key === k)
      // if (config.option)
      this.form[k] = e.target.value
    },
    onTypeChange (e) {
      if (e) this.typeIdx = e.target.value
      console.log('this.schemeType', e, this.schemeType, this.typeIdx)
      const form = schemes.getDefaultSchemeForm(this.schemeType)
      if (this.blueprint && this.blueprint.type === this.schemeType) {
        Object.assign(form, this.blueprint.form)
      }
      this.form = form
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
