<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-if="showSelect" type="selection" width="55">
    </el-table-column>
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Table',
  zhName: '表格组件',
  iconClass: 'biaodanzujian-biaoge',
  props: {
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  minSpan: 12,
  editorProps: () => [
    {
      title: '属性配置',
      props: [
        {
          prop: 'showSelect',
          label: '多选',
          type: 'switch'
        }
      ]
    }
  ],
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
