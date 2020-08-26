<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-19 10:28:04
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-08-25 18:11:26
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/index.vue
-->
<template>
  <div class="search-wrapper">
    <el-row>
      <el-form ref="form" label-width="auto" label-position="left" v-if="searchArray.length > 0">
        <el-col :span="8" v-for="(item, i) in searchArray" :key="i">
          <el-form-item :label="item.label">
            <el-input
              v-if="item.type === 'input'"
              v-bind="item.props || {placeholder: `请选择${item.label}`}"
              v-model="searchModel[item.prop]"
            ></el-input>
            <Select
              ref="Select"
              :prop="item.prop"
              :value="searchModel[item.prop]"
              class="select-city"
              v-bind="item.props || {placeholder: `请选择${item.label}`}"
              :data="item.options"
              v-else-if="item.type === 'select'">
            </Select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import Select from '@/kd/components/Form/Select'
export default {
  components: {
    Select
  },
  name: 'Form',
  zhName: '表单组件',
  iconClass: 'biaodanzujian-biaoge',
  minSpan: 8,
  props: {
    searchArray: {
      type: Array,
      default() {
        return [
        ]
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
            componentPath: './form-editor.vue'
          }
        ]
      }
    ]
  },
  data() {
    return {
      searchModel: {}
    }
  },
  watch: {
    formComonent(list) {
      this.formComonent = list
      console.log(list)
    }
  }
}
</script>
<style lang="scss">
  .el-form-item {
    margin-bottom: 22px !important;
  }
</style>
<style lang="scss" scoped>
.el-row {
  width: 100%;
}
.search-wrapper {
  background-color: #fff;
  // padding-top: 20px;
  // padding-left: 20px;
  // padding-right: 20px;
  box-shadow: 0px 8px 16px -6px rgba(241, 241, 241, 1);
}

::v-deep .el-row {
  margin: 0 -45px;
  .el-col {
    padding: 0 45px;
  }
}
</style>