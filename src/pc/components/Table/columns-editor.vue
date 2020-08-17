<template>
  <div class="columns-editor-wrapper">
    <el-table :data="value" size="mini">
      <el-table-column prop="label" label="标题">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.label"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="字段">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.prop"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fixed" label="定位">
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.fixed"
            clearable
            @clear="clearFixed(scope)"
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
            @clear="clearFixed(scope)"
          >
            <el-option label="左" value="left"> </el-option>
            <el-option label="中" value="center"> </el-option>
            <el-option label="右" value="right"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="align" label="宽度">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.width"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="push" class="mt-8">PUSH</el-button>
    <el-button @click="pop" class="mt-8">POP</el-button>
  </div>
</template>

<script>
let id = 0
export default {
  name: 'ColumnsEditor',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    push() {
      id++
      this.value.push({ label: '标题' + id, prop: 'prop' + id })
      this.$emit('change', this.value)
    },
    pop() {
      this.value.pop()
      this.$emit('change', this.value)
    },
    clearFixed({ $index: i }) {
      delete this.value[i].fixed
      this.$emit('change', this.value)
    }
  }
}
</script>
