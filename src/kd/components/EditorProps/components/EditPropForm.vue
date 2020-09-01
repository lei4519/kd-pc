<template>
  <el-form ref="form" :model="form" class="edit-props-form-wrapper" size="mini">
    <el-form-item
      v-for="(item, i) in encodePropList"
      :key="i"
      :prop="item.prop"
      :class="{ hasLabel: item.label }"
      v-bind="item.formItemProps"
    >
      <span slot="label" v-if="item.label || item.tips">
        {{ item.label }}
        <template v-if="item.tips">
          <template v-if="typeof item.tips === 'string'">
            <el-tooltip effect="dark" :content="item.tips" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template v-else>
            <i
              class="el-icon-info hover csp"
              @click="showDialog(item.prop)"
            ></i>
            <el-dialog
              :title="item.label"
              :visible.sync="dialogVisibles[item.prop]"
              custom-class="editprop-help-dialog"
              append-to-body
            >
              <template v-if="typeof item.tips === 'string'">
                {{ item.tips }}
              </template>
              <template v-else>
                <Expand :render="item.tips" :props="item" />
              </template>
            </el-dialog>
          </template>
        </template>
      </span>
      <el-input
        v-if="item.type === 'input'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @input="debounceSet(i, item.prop, ...arguments)"
      >
      </el-input>
      <div class="dataSource" v-else-if="item.type === 'dataSource'">
        <el-select v-model="form.dataSourceType">
          <el-option label="自定义" :value="1"> </el-option>
          <el-option label="数据源" :value="2" disabled> </el-option>
        </el-select>
        <el-input
          v-model="form[item.prop]"
          @change="setElementProps(i, item.prop, ...arguments)"
        ></el-input>
        <el-tooltip
          class="csp ml-4 hover-color click-effect"
          effect="dark"
          content="发送请求"
          placement="top"
        >
          <IconFont type="zhihang" size="24" @click.native="fetchData" />
        </el-tooltip>
      </div>
      <el-input-number
        v-else-if="item.type === 'inputNumber'"
        controls-position="right"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @input="setElementProps(i, item.prop, ...arguments)"
      >
      </el-input-number>
      <el-input
        v-else-if="item.type === 'selectInput'"
        v-model="form[item.inputProp]"
        v-bind="item.formCompProps ? item.formCompProps.inputProps || {} : {}"
        @input="debounceSet(i, item.inputProp, ...arguments)"
      >
        <el-select
          slot="prepend"
          style="width: 80px"
          v-model="form[item.selectProp]"
          v-bind="
            item.formCompProps ? item.formCompProps.selectProps || {} : {}
          "
          @change="setElementProps(i, item.selectProp, ...arguments)"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            v-bind="opt.props"
            v-model="opt.value"
          >
          </el-option>
        </el-select>
      </el-input>
      <el-radio-group
        v-else-if="item.type === 'radio'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
        <el-radio
          v-for="opt in item.options"
          :key="opt.value"
          :label="opt.value"
          v-bind="opt.props"
          >{{ opt.label }}</el-radio
        >
      </el-radio-group>
      <el-checkbox-group
        v-else-if="item.type === 'checkBox'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
        <el-checkbox
          v-for="opt in item.options"
          :key="opt.value"
          :label="opt.value"
          v-bind="opt.props"
          >{{ opt.label }}</el-checkbox
        >
      </el-checkbox-group>
      <el-select
        v-else-if="item.type === 'select'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
        <el-option
          v-for="opt in item.options"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
          v-bind="opt.props"
        >
        </el-option>
      </el-select>
      <el-switch
        v-else-if="item.type === 'switch'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
      </el-switch>
      <el-slider
        v-else-if="item.type === 'slider'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
      </el-slider>
      <UploadImg
        v-else-if="item.type === 'uploadImg'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      />
      <el-color-picker
        v-else-if="item.type === 'colorPicker'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      ></el-color-picker>
      <component
        v-else-if="item.type === 'customEditor'"
        :is="getEditorComponent(item)"
        :vm="element.renderComponent"
        :setProps="setProps"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      ></component>
    </el-form-item>
  </el-form>
</template>

<script>
import Expand from './Expand'
import UploadImg from '@/kd/components/UploadImg'
import { getEditorComponent } from '@/kd/utils/getComponents'
import { debounce, cloneDeep } from 'lodash'

export default {
  name: 'EditPropForm',
  components: {
    Expand,
    UploadImg
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    element: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      encodePropList: [],
      form: {},
      dialogVisibles: {}
    }
  },
  watch: {
    list() {
      this.initForm()
    },
    'element.immediateValidate'(v) {
      if (v) {
        this.$refs.form.validate()
      }
    }
  },
  created() {
    this.getEditorComponent = getEditorComponent
    this.initForm()
  },
  methods: {
    initForm() {
      // 受控表单 需要以下处理
      const [form, list] = this.list.reduce(
        ([form, list], item) => {
          const {
            type,
            prop,
            inputProp,
            selectProp,
            defaultValue,
            inputDefaultValue,
            selectDefaultValue
          } = item
          if (type === 'selectInput') {
            const encodeInputProp = this.encodeProp(inputProp)
            const encodeSelectProp = this.encodeProp(selectProp)
            form[encodeInputProp] =
              this.element.props[inputProp] || inputDefaultValue
            this.$set(this.dialogVisibles, encodeInputProp, false)
            form[encodeSelectProp] =
              this.element.props[selectProp] || selectDefaultValue
            this.$set(this.dialogVisibles, encodeSelectProp, false)
            item.inputProp = encodeInputProp
            item.selectProp = encodeSelectProp
          } else {
            const encodeProp = this.encodeProp(prop)
            form[encodeProp] = this.element.props[prop] || defaultValue
            // 控制dialog显示
            this.$set(this.dialogVisibles, encodeProp, false)
            if (type === 'dataSource') {
              // 记录一下，发送请求事件中方便校验
              this.dataSourceProp = encodeProp
            }
            item.prop = encodeProp
          }
          list.push(item)
          return [form, list]
        },
        [{ dataSourceType: 1 }, []]
      )
      this.form = form
      this.encodePropList = list
    },
    showDialog(prop) {
      this.dialogVisibles[prop] = true
    },
    debounceSet: debounce(function(...args) {
      this.setElementProps(...args)
    }, 300),
    setProps(prop, value) {
      this.element.setProps({
        [this.decodeProp(prop)]: cloneDeep(value)
      })
    },
    setElementProps(index, prop, value) {
      const item = this.list[index]
      if (item.onChange) {
        let changeSelf = false
        const setProps = (p, v) => {
          if (p === prop) {
            changeSelf = true
          }
          // 配置区同步修改的值
          this.form[p] = v
          this.setProps(p, v)
        }
        item.onChange.call(this.element.renderComponent, setProps, value, prop)
        // 如果组件调用setProps改了自身的值，那下方就不需要再重复调用
        if (changeSelf) return
      }
      this.setProps(prop, value)
    },
    fetchData() {
      if (!this.form[this.dataSourceProp])
        return this.$message.error('请求 URL 不能为空')
      this.setProps('quickBuildSystemInjectFetchDataFlag', Math.random())
    },
    encodeProp(prop) {
      // element 会处理 prop 路径，所以 form 的 prop 中不能带有 .
      // 将 . 处理成 |
      return prop.replace(/\./g, '___')
    },
    decodeProp(prop) {
      return prop.replace(/___/g, '.')
    }
  }
}
</script>

<style lang="scss">
.edit-props-form-wrapper {
  .el-form-item {
    margin: 0;
    + .el-form-item {
      margin-top: 8px;
    }
    &.hasLabel {
      .el-form-item__label {
        min-width: 90px;
      }
    }
    .el-form-item__content {
      .el-select {
        width: 100%;
      }
      .el-slider {
        margin: 0 10px 0 8px;
      }
    }
    .dataSource {
      display: flex;
      .el-select {
        flex: 0 0 86px;
        margin-right: 4px;
      }
    }
    .el-icon-info {
      &.hover:hover {
        color: $theme-color;
      }
    }
  }
}
.editprop-help-dialog {
  .el-dialog__header {
    padding: 16px;
    border-bottom: 1px solid #ddd;
  }
  .el-dialog__body {
    padding: 16px;
  }
}
</style>
