<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-19 10:28:04
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-09-02 14:25:17
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/index.vue
-->
<template>
  <div class="search-wrapper">
    <el-form
      ref="form"
      v-if="searchArray.length > 0"
      label-position="left"
    >
        <el-form-item :label="item.label" v-for="(item, i) in searchArray" :key="i">
          <el-input
            v-if="item.type === 'input'"
            v-bind="item.props || { placeholder: `请选择${item.label}` }"
            v-model="searchModel[item.props.dataField]"
          ></el-input>
          <Select
            ref="Select"
            :value="searchModel[item.props.dataField]"
            class="select-city"
            v-bind="item.props || { placeholder: `请选择${item.label}` }"
            :data="item.options"
            v-else-if="item.type === 'select'"
          >
          </Select>
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
  },
  methods: {
    onSearch() {
      // if (this.$refs.Select && this.$refs.Select[0]) {
      //   const component = this.$refs.Select[0]
      //   if (!component.city || !component.city.length) {
      //     return this.$message.error('请选择城市后重试')
      //   }
      //   this.$set(this.searchModel, component.$attrs.prop, component.city)
      // }
      console.log(this.searchModel)
      this.$emit('on-search', this.searchModel)
    },
    resetField() {
      this.$refs.form.resetFields()
      // this.searchModel = cloneDeep(this.initSearch)
      // this.$emit('on-reset', cloneDeep(this.initSearch))
    }
  },
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  padding: 24px;
  background-color: #fff;
  box-sizing: border-box;
  // box-shadow: 0px 8px 16px -6px rgba(241, 241, 241, 1);
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
    // width: 33.33%;
    flex: 0 0 calc(33.33% - 16px);
  }
  .el-form-item:last-child {
    justify-content: right;
  }
}
</style>
