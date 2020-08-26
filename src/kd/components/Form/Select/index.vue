<template>
  <el-select
    ref="selectCity"
    v-model="city"
    :filterable="filterable"
    collapse-tags
    clearable
    :multiple="multiple"
    :placeholder="placeholder"
  >
    <el-option v-for="(label, value) in  (list || data)" :key="value" :label="label" :value="value"></el-option>
  </el-select>
</template>
<script>
import { isString, isArray } from 'lodash'
export default {
  name: 'Select',
  props: {
    cityall: {
      type: String,
      default: 'all'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    choosevalue: {
      type: String,
      default: ''
    },
    dataField: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return null
      }
    }
  },
  editorProps: () => {
    return [
      {
        title: '城市配置',
        props: [
          {
            label: '数据源',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tips: '一期只支持自定义数据接口',
            prop: 'url',
            type: 'dataSource'
          },
          {
            label: '标题',
            tips: 'tips 值：String类型',
            prop: 'label',
            type: 'input'
          },
          {
            label: '数据字段名',
            tips: 'tips 值：String类型',
            prop: 'dataField',
            type: 'input'
          },
          {
            label: '占位符',
            tips: 'tips 值：String类型',
            prop: 'placeholder',
            type: 'input'
          },
          {
            label: '是否多选',
            prop: 'multiple',
            type: 'switch'
          },
          {
            label: '是否筛选',
            prop: 'filterable',
            type: 'switch'
          },
        ]
      }
    ]
  },
  data() {
    return {
      list: null,
      city: '',
      isMultiple: ''
    }
  },
  mounted() {
    this.isMultiple = this.multiple
    this.city = this.isMultiple ? this.choosevalue.split(',') : this.choosevalue
  },
  watch: {
    city(newVal, oldVal) {
      if (isString(newVal) && isArray(oldVal) && newVal === oldVal.join()) {
        return
      }
      if (isString(oldVal) && isArray(newVal) && oldVal === newVal.join()) {
        return
      }
      if (Array.isArray(newVal)) {
        // 多选情况下 选择了全部，只保留全部选项，关闭多选功能
        if (newVal.includes(this.cityall) && this.multiple) {
          this.multiple = false
          this.city = this.cityall
          this.$refs.selectCity.blur()
        } else if (!newVal.includes(this.cityall) && !this.multiple) {
          // 多选情况下，没有全部选项，开启多选功能
          this.multiple = true
          this.city = newVal
        }
      } else {
        // 单选
        if (newVal === this.cityall) {
          // 选择的是全部 关闭多选功能
          if (this.multiple) {
            this.multiple = false
          }
        } else {
          // 否则开启全部功能，将val置为数组
          if (this.isMultiple) {
            if (!this.multiple) {
              this.multiple = true
            }
            this.city = [newVal]
          }
        }
      }
      this.callback(this.city)
    }
  },
  methods: {
    cityChange() {
      this.callback(this.city)
    }
  }
}
</script>

