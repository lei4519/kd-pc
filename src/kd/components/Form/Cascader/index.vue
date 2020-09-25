<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-09-04 11:21:10
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-09-04 16:01:32
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/kd/components/Form/Cascader/index.vue
-->
<template>
  <el-cascader
    v-model="cascaderValue"
    ref="cascader"
    filterable
    :options="list"
    style="width: 100%"
    :show-all-levels="false"
    collapse-tags
    @clearCheckedNodes="clearCheckedNodes"
    :props="cascaderProps"
    clearable
  ></el-cascader>
</template>

<script>
export default {
  props: {
    cascaderProps: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      cascaderValue: []
    }
  },
  watch: {
    cascaderValue(val, oldval) {
      if (val.length === 0) {
        this.cascaderValue = ['all']
        return false
      }
      const newIndex = val.indexOf('all')
      const oldIndex = oldval.indexOf('all') // 获取val和oldval里all的索引,如果没有则返回-1
      if (newIndex !== -1 && oldIndex === -1 && val.length > 1) {
        // 如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
        this.cascaderValue = ['all']
      } else if (newIndex !== -1 && oldIndex !== -1 && val.length > 1) {
        // 如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
        this.$refs.cascader.checkedNodes[0].checked = false
        this.cascaderValue.splice(val.indexOf('all'), 1)
      }
      this.$emit(
        'input',
        this.cascaderValue.includes('all') ? 'all' : this.cascaderValue
      )
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.getVal()
    },
    reset() {
      this.getVal(true)
    },
    getVal(reset) {
      if (reset) {
        this.cascaderValue = ['all']
        return false
      } else if (this.list.includes('all')) {
        this.cascaderValue = ['all']
      }
      this.$nextTick(() => {
        this.$emit(
          'input',
          this.cascaderValue.includes('all') ? 'all' : this.cascaderValue
        )
      })
    },
    clearCheckedNodes() {
      this.cascaderValue = ['all']
      this.$emit('input', 'all')
    }
  }
}
</script>
