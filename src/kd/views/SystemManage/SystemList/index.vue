<template>
  <div class="list-wrapper">
    <el-button class="mb-16" type="primary" @click="dialogVisible = true"
      >新建系统</el-button
    >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="系统名称"></el-table-column>
      <el-table-column prop="time" label="到期时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
            scope.row.time.toLocaleDateString()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <el-button size="mini" @click="$router.push({ name: 'EditSinglePage' })"
          >编辑</el-button
        >
      </el-table-column>
    </el-table>
    <el-dialog title="新建系统" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" ref="elForm">
        <el-form-item label="系统名称" prop="name" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" prop="time" required>
          <el-date-picker
            style="width: 100%"
            v-model="form.time"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSystem">确 定</el-button>
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
          name: '测试',
          time: new Date()
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
