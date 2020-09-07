<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-19 10:28:04
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-09-07 14:42:06
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/index.vue
-->
<template>
  <div class="search-wrapper">
    <el-form ref="form" v-if="searchArray.length > 0" label-position="left">
      <el-form-item :label="item.label" v-for="(item, i) in searchArray" :key="i">
        <el-input
          v-if="item.type === 'input'"
          v-bind="item.props || { placeholder: `请选择${item.label}` }"
          v-model="searchModel[item.props.dataField]"
        ></el-input>
        <Select
          ref="Select"
          v-model="searchModel[item.props.dataField]"
          class="select-city"
          v-bind="item.props || { placeholder: `请选择${item.label}` }"
          :option-data="item.props.optionRadio === '1' ? item.options : item.list"
          v-else-if="item.type === 'select'"
        ></Select>
        <el-date-picker
          style="width: 100%"
          v-else-if="item.type === 'datePicker'"
          v-model="searchModel[item.props.dataField]"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="pickerOptions"
          v-bind="item.props"
          v-on="item.on || {}"
        ></el-date-picker>
        <Cascader
          v-else-if="item.type === 'cascader'"
          ref="cascader"
          v-bind="item.props || {placeholder: `请选择${item.label}`}"
          v-model="searchModel[item.props.dataField]"
          :list="item.list"
        ></Cascader>
      </el-form-item>
      <el-form-item class="search-btn">
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="resetField">重置</el-button>
      </el-form-item>
    </el-form>
    <div v-else>请添加表单组件</div>
  </div>
</template>

<script>
import Select from '@/kd/components/Form/Select'
import Cascader from '@/kd/components/Form/Cascader'

export default {
  name: 'Form',
  needParentStyle: false,
  components: {
    Select,
    Cascader
  },
  zhName: '表单组件',
  iconClass: 'biaodanzujian-biaoge',
  minSpan: 8,
  props: {
    searchArray: {
      type: Array,
      default () {
        return []
      }
    }
  },
  editorProps: () => {
    return [
      {
        title: '组件列表',
        props: [
          {
            type: 'customEditor',
            prop: 'searchArray',
            componentPath: 'components/Form/form-editor.vue'
          }
        ]
      }
    ]
  },
  data () {
    return {
      searchModel: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  watch: {},
  methods: {
    onSearch () {
      console.log(this.searchModel)
      this.$emit('on-search', this.searchModel)
    },
    resetField () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  padding: 24px;
  background-color: #fff;
  box-sizing: border-box;
}
::v-deep .el-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &:not(.el-form--label-top) {
    .el-form-item {
      margin-top: 0px;
      margin-bottom: 16px;
    }
  }
  .el-form-item:not(:last-child) {
    margin-right: 16px;
    flex: 0 0 calc(33.33% - 16px);
  }
  .el-form-item:last-child {
    justify-content: right;
  }
}
</style>
