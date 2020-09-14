<template>
  <div class="list-wrapper">
    <el-button
      class="mb-16"
      size="small"
      type="primary"
      @click="dialogVisible = true"
      >新建页面</el-button
    >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="页面名称"></el-table-column>
      <el-table-column label="操作" width="100px">
        <el-button size="mini" @click="$router.push({ name: 'EditSinglePage' })"
          >编辑页面</el-button
        >
      </el-table-column>
    </el-table>
    <el-dialog title="新建页面" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" ref="elForm">
        <el-form-item label="页面名称" prop="name" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addSystem" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      tableData: [
        {
          name: '测试'
        }
      ],
      dialogVisible: false,
      form: {}
    }
  },
  methods: {
    addSystem() {
      this.$refs.elForm.validate().then(() => {
        this.tableData.push(this.form)
        this.form = {}
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
