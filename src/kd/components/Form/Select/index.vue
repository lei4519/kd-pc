<template>
  <el-select
    ref="selectCity"
    v-model="city"
    :filterable="filterable"
    collapse-tags
    clearable
    :multiple="multipleStatue"
    :placeholder="placeholder"
    style="width:100%;height:100%"
  >
    <el-option
      v-for="item in list || optionData"
      :key="item[optionKey]"
      :label="item[optionLabel]"
      :value="item[optionKey]"
    ></el-option>
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
    optionData: {
      type: Array,
      default() {
        return []
      }
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionKey: {
      type: String,
      default: 'key'
    }
  },
  data() {
    return {
      list: null,
      city: [],
      multipleStatue: false
    }
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
          this.multipleStatue = false
          this.city = this.cityall
          this.$refs.selectCity.blur()
        } else if (!newVal.includes(this.cityall) && !this.multipleStatue) {
          // 多选情况下，没有全部选项，开启多选功能
          this.multipleStatue = true
          this.city = newVal
        }
      } else {
        // 单选
        if (newVal === this.cityall) {
          // 选择的是全部 关闭多选功能
          if (this.multipleStatue) {
            this.multipleStatue = false
          }
        } else {
          // 否则开启全部功能，将val置为数组
          if (this.multiple) {
            if (!this.multipleStatue) {
              this.multipleStatue = true
            }
            this.city = [newVal]
          }
        }
      }
      this.$emit('input', this.city)
    }
  },
  created() {
    this.multipleStatue = this.multiple
    this.city = this.multipleStatue ? [] : ''
  },
  methods: {}
}
</script>
