<template>
  <div class="columns-editor-wrapper">
    <el-table :data="vm.selfColumns" size="mini">
      <el-table-column prop="label" label="标题" width="100px">
        <template slot-scope="scope">
          {{ scope.row.label }}
        </template>
      </el-table-column>
      <el-table-column prop="sortable" label="排序">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.sortable"
            :active-value="'custom'"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="fixed" label="定位">
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.fixed"
            clearable
            @change="setProps(scope, ...arguments)"
            @clear="clearFixed(scope.row.prop)"
          >
            <el-option label="左" value="left"> </el-option>
            <el-option label="右" value="right"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="align" label="对齐">
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.align"
            @clear="clearFixed(scope.row.prop)"
          >
            <el-option label="左" value="left"> </el-option>
            <el-option label="中" value="center"> </el-option>
            <el-option label="右" value="right"> </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ColumnsEditor',
  props: {
    value: {
      type: Object,
      default() {
        return []
      }
    },
    vm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    setProps({ row: { prop }, column: { property } }, val) {
      if (!this.value[prop]) this.value[prop] = {}
      this.value[prop][property] = val
      this.$emit('change', this.value)
    },
    clearFixed(prop) {
      this.value[prop].fixed = void 0
      this.$emit('change', this.value)
    }
  }
}
</script>
