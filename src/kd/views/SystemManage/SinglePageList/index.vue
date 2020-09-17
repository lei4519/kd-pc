<template>
  <div class="list-wrapper">
    <AjaxLoading>
      <Table
        url="/api/quickbuild/lis"
        :operateList="operateList"
        :columns="columns"
        :showSearch="false"
        :showTitle="false"
        :remoteColumns="false"
      />
    </AjaxLoading>
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
import Table from '@/pc/components/Table'
export default {
  name: 'List',
  components: {
    Table
  },
  data() {
    return {
      tableData: [
        {
          name: '测试'
        }
      ],
      dialogVisible: false,
      form: {
        name: '',
        data: {}
      }
    }
  },
  created() {
    this.operateList = [
      {
        label: '新建页面',
        handler: () => (this.dialogVisible = true)
      }
    ]
    this.columns = [
      {
        label: '页面名称',
        prop: 'form_name'
      },
      {
        label: '操作',
        type: 'operate',
        width: '80',
        operateList: [
          {
            label: '编辑',
            handler: ({ row }) => {
              this.$router.push({
                name: 'EditSinglePage',
                query: { id: row.id }
              })
            }
          }
        ]
      }
    ]
  },
  methods: {
    async addSystem() {
      this.$refs.elForm.validate().then(() => {
        try {
          const {
            data: { code, msg }
          } = this.$ajax({
            url: '/api/quickbuild/add',
            method: 'POST',
            urlSearchParams: this.form
          })
          if (code === 1) {
            this.form = {}
            this.dialogVisible = false
            this.$loadManage.exec()
          } else {
            this.$message.error(msg)
          }
        } catch {
          this.$message.error('新增失败，请稍后重试')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
