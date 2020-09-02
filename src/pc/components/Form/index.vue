<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-19 10:28:04
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-09-01 16:53:02
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/index.vue
-->
<template>
  <div class="search-wrapper">
      <el-form
        ref="form"
        v-if="searchArray.length > 0"
        size="mini"
      >
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, i) in searchArray" :key="i">
          <el-form-item>
            <el-row :gutter="20" type="flex">
              <el-col :span="6">
                <span>{{item.label}}</span>
              </el-col>
              <el-col :span="18">
                <el-input
                  v-if="item.type === 'input'"
                  v-bind="item.props || { placeholder: `请选择${item.label}` }"
                  v-model="searchModel[item.prop]"
                ></el-input>
                <Select
                  ref="Select"
                  :prop="item.prop"
                  :value="searchModel[item.prop]"
                  class="select-city"
                  v-bind="item.props || { placeholder: `请选择${item.label}` }"
                  :data="item.options"
                  v-else-if="item.type === 'select'"
                >
                </Select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Select from '@/kd/components/Form/Select'
export default {
  name: 'Form',
  components: {
    Select
  },
  zhName: '表单组件',
  iconClass: 'biaodanzujian-biaoge',
  minSpan: 8,
  props: {
    searchArray: {
      type: Array,
      default() {
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
      },
      // {
      //   title: '组件列表11',
      //   props: [
      //     {
      //       type: 'customEditor',
      //       prop: 'searchArray',
      //       componentPath: './form-editor.vue'
      //     }
      //   ]
      // }

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
// .el-form-item {
//   margin-bottom: 22px !important;
// }
</style>
<style lang="scss" scoped>
::v-deep .el-row {
  margin-bottom: 50px;
  &:last-child {
    margin-bottom: 0;
  }
}
.search-wrapper {
  padding: 24px;
  background-color: #fff;
  box-shadow: 0px 8px 16px -6px rgba(241, 241, 241, 1);
}

::v-deep .el-row {
  margin: 0 -45px;
  .el-col {
    padding: 0 45px;
  }
}
</style>
