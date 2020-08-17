<template>
  <div class="DocumentTable-wrapper">
    <div class="title mb-12" v-if="title">{{ title }}</div>
    <el-table
      :data="tableData"
      row-key="id"
      fit
      border
      :span-method="spanMethod"
      size="mini"
      v-bind="$attrs"
      v-on="{ ...$listeners }"
    >
      <el-table-column v-for="item in columns" :key="item.prop" v-bind="item" />
    </el-table>
    <div class="title mt-16 mb-12" v-if="code">
      代码示例
      <el-tooltip
        class="csp ml-4"
        @click.native.stop="copyCode"
        effect="dark"
        content="复制代码"
        placement="right"
      >
        <i class="el-icon-copy-document"></i>
      </el-tooltip>
    </div>
    <div class="show-code">
      <code>
        <pre v-html="formatHTML"></pre>
      </code>
    </div>
    <input
      ref="copyInput"
      :value="jsonCode"
      type="text"
      :style="{
        position: 'absolute',
        opacity: 0,
        height: 0,
        padding: 0,
        margin: 0,
        border: 'none'
      }"
    />
  </div>
</template>

<script>
/**
 * @description 生成接口文档说明
 * @param title 表格标题
 * @param code 接口代码示例
 * @param data 表格数据
 * @param columns 表头配置（具体配置查询element官网）
 */
export default {
  name: 'DocumentTable',
  props: {
    title: {
      type: String,
      default: ''
    },
    code: {
      type: Object,
      default: null
    },
    data: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  computed: {
    tableData() {
      let id = 0
      const data = JSON.parse(JSON.stringify(this.data))
      const queue = [...data]
      while (queue.length) {
        const item = queue.shift()
        item.id = id++
        if (item.children) {
          queue.unshift(...item.children)
        }
      }
      return data
    },
    jsonCode() {
      return JSON.stringify(this.code, null, 2)
    },
    formatHTML() {
      const valFormat = JSON.stringify(
        this.code,
        (k, v) => {
          const type = typeof v
          return type === 'object'
            ? v
            : `<span class='token ${type}'>${v}</span>`
        },
        4
      )
      const propReg = /(?:\s(".*?"):\s)|(?:"<span class='token (?:boolean|number)'>.*?<\/span>")/gim
      return valFormat.replace(propReg, (match, $1) => {
        // 替换多余引号
        if (!$1) return match.replace(/"/g, '')
        // 替换属性
        return match.replace(
          $1 + ':',
          `<span class="token property">${$1}</span><span class="token operator">:</span>`
        )
      })
    }
  },
  created() {
    // 计算合并行
    this.curSpan = null
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const prop = column.property
      if (row.$$span) {
        if (!this.curSpan) {
          this.curSpan = JSON.parse(JSON.stringify(row.$$span))
        }
        const span = row.$$span[prop]
        if (span) {
          // 记录行列占比
          this.curSpan.startRowIndex = rowIndex
          this.curSpan.startColumnIndex = columnIndex
          this.curSpan[prop][0] = rowIndex + span[0] - 1
          this.curSpan[prop][1] = columnIndex + span[1] - 1
          return row.$$span[column.property]
        } else {
          // 校验列合并
          const res = [1, 1]
          if (this.curSpan.startColumnIndex < columnIndex) {
            Object.values(this.curSpan).some(val => {
              if (val[1] < columnIndex) {
                val[1] = -1
              } else if (val[1] > columnIndex) {
                res[1] = 0
                return true
              } else if (val[1] === columnIndex) {
                res[1] = 0
                val[1] = -1
                return true
              }
            })
          }
          return res
        }
      }
      const res = [1, 1]
      if (this.curSpan) {
        // 校验行合并
        if (this.curSpan.startRowIndex < rowIndex) {
          Object.values(this.curSpan).some(val => {
            if (val[0] < rowIndex) {
              val[0] = -1
            } else if (val[0] > rowIndex) {
              res[0] = 0
              return true
            } else if (val[0] === rowIndex) {
              res[0] = 0
              val[0] = -1
              return true
            }
          })
        }
      }
      return res
    },
    copyCode() {
      this.$refs.copyInput.select()
      document.execCommand('Copy')
      this.$message.success('复制成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 500;
}
.show-code {
  padding: 16px;
  background-color: #282d34;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #fff;
  /deep/ .token {
    color: #ccc;
    &.property {
      color: #f8c555;
    }
    &.number {
      color: #f08d49;
    }
    &.string {
      color: #7ec699;
    }
    &.boolean {
      color: #f8c555;
    }
    &.operator {
      color: #67cdcc;
    }
  }
}
</style>
