<template>
<div class="edit-page" :class="isIphoneX ? 'is-iphonex' : ''">
  <div class="page-main">
    <div class="xinput-title">自定义方案主题</div>
    <div class="xinput-cell">
      <input
        class="input"
        v-model="title"
        type="text">
    </div>
    <div class="xinput-title">方案类型</div>
    <div class="xinput-cell">
      <picker
        class="input"
        :value="typeIdx"
        :range="typeLabels"
        @change="onTypeChange">
        <div> {{typeLabels[typeIdx]}}</div>
      </picker>
    </div>
    <block :key="formItem.key" v-for="formItem in scheme.form">
      <div class="xinput-title">{{formItem.label}}</div>
      <div class="xinput-cell" v-if="formItem.type === 'textarea'">
        <textarea
          @change="onFormItemChange($event, formItem)"
          v-model="form[formItem.key]"
          :placeholder="formItem.placeholder || ''"
          ></textarea>
        <div class="scan-btn" @tap="onScanCode(formItem.key)">扫码录入</div>
      </div>
      <div class="xinput-cell" v-if="formItem.type === 'select'">
        <picker
          @change="onPickerChnage($event, formItem.key)"
          :value="form[formItem.key]"
          :range="formItem.options"
          >
          <div>{{formItem.options[form[formItem.key]]}}</div>
        </picker>
      </div>
      <div class="xinput-cell" v-if="formItem.type === 'number'">
        <input
          type="number"
          v-model="form[formItem.key]"
          @change="onFormItemChange($event, formItem)"
          :placeholder="formItem.placeholder || ''">
      </div>
      <div class="xinput-cell" v-if="!formItem.type || formItem.type === 'text'">
        <input
          type="text"
          v-model="form[formItem.key]"
          @change="onFormItemChange($event, formItem)"
          :placeholder="formItem.placeholder || ''">
      </div>
      <div class="xinput-tip" v-if="formItem.tip">{{formItem.tip}}</div>
      <div class="xinput-tip" v-if="formItem.onChangeTip">{{formTip[formItem.key]}}</div>
    </block>
    <block v-if="!scheme.singleton">
      <div class="xinput-title">选几项</div>
      <div class="xinput-cell">
        <input min="1" type="number" v-model="form.choosedCount">
      </div>
      <div class="xinput-tip">若选项总数量与选出的个数相等, 且不允许重复结果, 那么小程序会对所有选项进行随机排序</div>
      <div class="xinput-title">是否允许出现重复结果</div>
      <radio-group class="xinput-cell" @change="onRadioChnage($event, 'allowDuplicated')">
        <label>
          <radio type="radio" value="0" :checked="form.allowDuplicated==='0'" />
          不允许
        </label>
        <label>
          <radio type="radio" value="1" :checked="form.allowDuplicated==='1'" />
          允许
        </label>
      </radio-group>
    </block>
  </div>
  <div class="toolbar">
    <div class="toolbar-item-2">
      <div class="toolbar-item"></div>
      <div v-if="blueprint" class="toolbar-item" @tap="onTrash">
        <div class="icon icon-trash"></div>
        删除
      </div>
    </div>
    <div class="toolbar-item" @tap="onSave">
      <view class="btn-center icon icon-save"></view>
    </div>
    <div class="toolbar-item" @tap="onFeedBack">
      <div class="icon icon-feedback"></div>
      反馈
    </div>
    <div class="toolbar-item"></div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import schemes from '@/schemes'
import utils from '@/utils'
import pmixin from '../pmixin'
const allTypes = schemes.getSchemeTypes()

export default {
  name: 'edit',
  mixins: [pmixin],
  data () {
    return {
      title: '',
      typeIdx: 0,
      form: {},
      formTip: {}
    }
  },
  mounted () {
    this.resetForm()
    const query = this.$root.$mp.query
    this.switch2(query.id)
    this.$nextTick(() => {
      wx.setNavigationBarTitle({title: this.blueprint ? '修改方案' : '新增方案'})
      if (this.blueprint) {
        console.log('edit page mounted', this.blueprint)
        this.title = this.blueprint.title
        this.typeIdx = allTypes.findIndex(t => t.value === this.blueprint.type)
      }
      this.onTypeChange()
    })
  },
  computed: {
    ...mapState(['blueprint']),
    typeLabels () {
      return allTypes.map(t => t.label)
    },
    schemeType () {
      const t = allTypes[this.typeIdx]
      return t && t.value
    },
    scheme () {
      return schemes.getScheme(this.schemeType)
    },
    usageTip () {
      // return '在录入自定义选项时, 可以从剪贴板粘贴, 也可以扫码录入哦'
    }
  },
  methods: {
    ...mapMutations(['addBlueprints', 'switch2', 'removeBlueprint']),
    onScanCode (key) {
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          console.log('scanned content', res)
          if (key in this.form) this.form[key] = res.result
        },
        fail (e) {
          console.log('扫码失败', e)
        }
      })
    },
    async onSave () {
      let form = Object.assign({}, this.form)
      form.allowDuplicated = form.allowDuplicated === '1'
      // 将下拉选框的 index 转换为对应的值
      if (this.scheme.form) {
        this.scheme.form.forEach(f => {
          if (f.type !== 'select') return
          form[f.key] = f.options[form[f.key]]
        })
      }

      if (this.scheme.purgeForm) form = this.scheme.purgeForm(form)
      try {
        this.validateCommon()
        if (this.scheme.validateForm) await this.scheme.validateForm(form)
        const blueprint = {
          form,
          title: this.title,
          type: this.schemeType
        }
        if (this.blueprint) blueprint.id = this.blueprint.id
        // 判断scheme 是否变化
        this.hasSchemeChanged(blueprint)
        this.addBlueprints(blueprint)
        const title = this.blueprint ? '方案修改成功' : '方案添加成功'
        wx.showToast({
          title,
          mask: true,
          icon: 'success'
        })
        // 重定向到首页
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
          // wx.reLaunch({
          //   url: `../alpha/alpha`
          // })
        }, 1600)
      } catch (e) {
        // ignore error from confirm dialog
        if (e.isConfirm) return
        console.log(e)
        wx.showModal({
          title: '方案保存失败',
          content: e.message,
          showCancel: false
        })
      }
    },
    async onTrash () {
      if (!this.blueprint) return
      try {
        const res = await utils.confirm({
          title: '提示',
          content: `确定删除 ${this.blueprint.title} 吗?`,
          confirmColor: '#ee0000'
        })
        if (!res.confirm) return
        this.removeBlueprint(this.blueprint.id)
        wx.showToast({
          title: '删除成功',
          mask: true,
          icon: 'success'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: `../alpha/alpha`
          })
        }, 1600)
      } catch (e) {
        console.log('use canceled', e)
      }
    },
    onPickerChnage (e, k) {
      console.log('onPickerChnage', e, k)
      this.form[k] = e.target.value
    },
    onRadioChnage (e, k) {
      this.form[k] = e.target.value
    },
    onFormItemChange (e, formItem) {
      if (!formItem.onChangeTip) return
      const k = formItem.key
      const handleName = 'on' + k.charAt(0).toUpperCase() + k.slice(1) + 'Change'
      if (!this.scheme || !this.scheme[handleName]) return
      console.warn(e, formItem, handleName, this.formTip)
      const tipKey = formItem.altTipKey || k
      this.formTip[tipKey] = this.scheme[handleName](e.target.value, this.form)
    },
    onTypeChange (e) {
      if (e) this.typeIdx = e.target.value
      console.log('this.schemeType', e, this.schemeType, this.typeIdx)
      const form = schemes.getDefaultSchemeForm(this.schemeType)
      if (this.blueprint && this.blueprint.type === this.schemeType) {
        Object.assign(form, this.blueprint.form)
        if (this.scheme.form) {
          this.scheme.form.forEach(f => {
            if (f.type !== 'select') return
            form[f.key] = f.options.indexOf(form[f.key])
          })
        }
        form.allowDuplicated = String(Number(Boolean(form.allowDuplicated)))
        this.form = form
      } else {
        form.allowDuplicated = '0'
      }
      this.formTip = Object.keys(form).reduce((acc, cur) => {
        acc[cur] = ''
        return acc
      }, {})
      if (this.scheme.form) {
        this.$nextTick(() => {
          this.scheme.form.forEach(f => {
            if (!f.onChangeTip) return
            this.onFormItemChange({
              target: {value: form[f.key]}
            }, f)
          })
        })
      }
      console.log('this.formTip', this.formTip)
      console.log('on type change', form)
      this.form = form
    },
    validateCommon () {
      if (!this.title.trim()) throw new Error('请填写方案主题')
      const form = this.form
      Object.keys(form).forEach((k) => {
        if (typeof form[k] === 'string' && form[k] === '') {
          let title = '所有表单项'
          if (k === 'choosedCount') {
            title = '选几项'
          } else if (this.scheme.form) {
            const config = this.scheme.form.find(f => f.key === k)
            if (config) title = config.label
          }
          throw new Error(`请填写 ${title}`)
        }
      })
    },
    hasSchemeChanged (newBlueprint) {
      if (!this.blueprint) return
      const oldBlueprint = this.blueprint
      console.log('hasSchemeChanged', oldBlueprint, newBlueprint)
      if (utils.deepEqual(oldBlueprint, newBlueprint)) {
        throw new Error('方案配置未变化')
      }
    },
    resetForm () {
      this.title = ''
      this.typeIdx = 0
    }
  }
}
</script>

<style lang="scss">
@import '~@/style/base.scss';

.edit-page {
  height: 100%;
  .xinput-title {
    margin-top: .77em;
    margin-bottom: .3em;
    padding-left: 10px;
    padding-right: 10px;
    color: darken($font-color, 10%);
    font-size: 14px;
  }

  .xinput-tip {
    margin-top: .3em;
    color: darken($font-color, 10%);
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    font-weight: 100;
  }

  .xinput-cell {
    padding: 10px 10px;
    position: relative;
    background-color: darken($theme-color, 10%);
    @include line-vertical;

    textarea {
      height: 200px;
    }
    input, textarea, picker {
      caret-color: darken($font-color, 5%);
      color: $font-color;
      background-color: darken($theme-color, 10%);
    }

    .scan-btn {
      position: absolute;
      right: 6px;
      bottom: 6px;
      border: 1px solid #efefef;
      padding: 4px 6px;
      border-radius: 6px;
      color: darken($font-color, 5%);
      font-size: 14px;

      &:active {
        background-color: #ccc;
      }
    }

    &:last-child {
      margin-bottom: 30px;
    }
  }
}
</style>
