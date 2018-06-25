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
        <input type="number" v-model="form[formItem.key]" :placeholder="formItem.placeholder || ''">
      </div>
      <div class="xinput-cell" v-if="!formItem.type || formItem.type === 'text'">
        <input type="text" v-model="form[formItem.key]" :placeholder="formItem.placeholder || ''">
      </div>
      <div class="xinput-tip" v-if="formItem.tip">{{formItem.tip}}</div>
    </block>
    <block v-if="!scheme.singleton">
      <div class="xinput-title">选几项</div>
      <div class="xinput-cell">
        <input min="1" type="number" v-model="form.choosedCount">
      </div>
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
      <view class="btn-center icon icon-shake"></view>
    </div>
    <div class="toolbar-item">
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
  mixins: [pmixin],
  data () {
    return {
      title: '',
      typeIdx: 0,
      form: {}
    }
  },
  mounted () {
    this.resetForm()
    const query = this.$root.$mp.query
    this.switch2(query.id)
    console.log('edit page mounted')
    this.$nextTick(() => {
      console.log('edit page blueprint', this.blueprint)
      wx.setNavigationBarTitle({title: this.blueprint ? '修改方案' : '新增方案'})
      if (this.blueprint) {
        console.log('edit page onmounted', this.blueprint)
        this.title = this.blueprint.title
        this.typeIdx = allTypes.findIndex(t => t.value === this.blueprint.type)

        const form = Object.assign({}, this.blueprint.form)
        if (this.scheme.form) {
          this.scheme.form.forEach(f => {
            if (f.type !== 'select') return
            form[f.key] = f.options.indexOf(form[f.key])
          })
        }
        form.allowDuplicated = String(Number(Boolean(form.allowDuplicated)))
        this.form = form
      } else {
        this.onTypeChange()
      }
    })
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
    ...mapMutations(['addBlueprints', 'switch2', 'removeBlueprint']),
    onScanCode (key) {
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          console.log('扫码内容', res)
          if (key in this.form) this.form[key] = res.result
        },
        fail (e) {
          console.log('扫码失败', e)
        }
      })
    },
    async onSave () {
      let form = Object.assign({}, this.form)
      console.warn('form', form)
      form.allowDuplicated = form.allowDuplicated === '1'
      // 将下拉选框的 index 转换为对应的值
      if (this.scheme.form) {
        this.scheme.form.forEach(f => {
          if (f.type !== 'select') return
          form[f.key] = f.options[form[f.key]]
        })
      }

      if (this.scheme.purgeForm) form = await this.scheme.purgeForm(form)
      try {
        this.validateCommon()
        if (this.scheme.validateForm) await this.scheme.validateForm(form)
        const blueprint = {
          form,
          title: this.title,
          type: this.schemeType
        }
        if (this.blueprint) blueprint.id = this.blueprint.id
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
          title: '保存选项失败',
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
    onTypeChange (e) {
      if (e) this.typeIdx = e.target.value
      console.log('this.schemeType', e, this.schemeType, this.typeIdx)
      const form = schemes.getDefaultSchemeForm(this.schemeType)
      if (this.blueprint && this.blueprint.type === this.schemeType) {
        Object.assign(form, this.blueprint.form)
      }
      form.allowDuplicated = '0'
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
    resetForm () {
      this.title = ''
      this.typeIdx = 0
    }
  }
}
</script>

<style lang="scss">
.edit-page {
  height: 100%;
  background-color: #efefef;
  .xinput-title {
    margin-top: .77em;
    margin-bottom: .3em;
    padding-left: 15px;
    padding-right: 15px;
    color: #808080;
    font-size: 14px;
  }

  .xinput-tip {
    margin-top: .3em;
    color: #a0a0a0;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
    font-weight: 100;
  }

  .xinput-cell {
    padding: 10px 15px;
    position: relative;
    background-color: white;

    &:before, &:after {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 2;
    }
    &:after {
      top: unset;
      bottom: 0;
      border-top: none;
      border-bottom: 1px solid #e5e5e5;
      transform-origin: 0 100%;
    }
    textarea {
      height: 200px;
    }
    input, textarea, picker { color: #333;}

    .scan-btn {
      position: absolute;
      right: 6px;
      bottom: 6px;
      border: 1px solid #efefef;
      padding: 4px 6px;
      border-radius: 6px;
      color: #aaa;
      font-size: 14px;

      &:active {
        background-color: #efefef;
      }
    }

    &:last-child {
      margin-bottom: 30px;
    }
  }
  .toolbar {
    .btn-center {
      background-color: #aef4a4;
    }
  }
}
</style>
