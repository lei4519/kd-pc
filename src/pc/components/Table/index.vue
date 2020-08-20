<template>
  <div>
    <div class="title">{{ tableTitle }}</div>
    <el-table
      ref="elTable"
      class="table-wrap"
      size="small"
      :class="{ 'cursor-pointer': $attrs['highlight-current-row'] }"
      :data="tableData"
      fit
      border
      :stripe="false"
      v-bind="$attrs"
      v-on="{ ...$listeners }"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="showIndex"
        key="index"
        label="序号"
        type="index"
        :width="50"
        :index="index => (currentPage - 1) * pageSize + index + 1"
      />
      <el-table-column
        v-for="item in selfColumns"
        :key="item.prop"
        v-bind="{ ...item, 'show-overflow-tooltip': true }"
      />
      <template v-if="false">
        <el-table-column
          v-if="item.type === 'operate' || item.render"
          :key="item.prop"
          v-bind="item"
        >
          <template slot-scope="scope">
            <ul v-if="item.type === 'operate'" class="operate-column-list">
              <!-- <el-button
                  class="operate-column-item"
                  v-for="(operate, i) in (typeof item.operateList === 'function' ? item.operateList(scope) : item.operateList)"
                  :key="i"
                  :disabled="operate.disabled"
                  @click="(operate.handler && !operate.disabled) ? operate.handler(scope, item, operate) : noop"
                  type="text"
                >{{ operate.label }}</el-button> -->
              <li
                :class="
                  `operate-column-item ${
                    operate.disabled
                      ? 'gary-color'
                      : 'main-color hover-color pointer'
                  }`
                "
                v-for="(operate, i) in typeof item.operateList === 'function'
                  ? item.operateList(scope)
                  : item.operateList"
                :key="i"
                @click="
                  operate.handler && !operate.disabled
                    ? operate.handler(scope, item, operate)
                    : noop
                "
              >
                {{ operate.label }}
              </li>
            </ul>
            <Expand v-else :render="item.render" :props="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.renderHeader"
          :key="item.prop"
          v-bind="item"
        >
          <template #header="scope">
            <Expand :render="item.renderHeader" :props="scope" />
          </template>
        </el-table-column>
        <el-table-column v-else :key="item.prop" v-bind="item" />
      </template>
    </el-table>
    <el-pagination
      v-if="showPage"
      class="table-pagination"
      layout="prev, pager, next"
      v-bind="$attrs"
      v-on="$listeners"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      small
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <a v-if="download" v-show="false" ref="downLoadRef"></a>
  </div>
</template>

<script>
export default {
  name: 'Table',
  zhName: '表格组件',
  iconClass: 'biaodanzujian-biaoge',
  minSpan: 8,
  props: {
    columns: {
      type: Array,
      default() {
        return [
          {
            label: '字段1',
            prop: 'asdf'
          },
          {
            label: '字段2',
            prop: 'dfh'
          },
          {
            label: '字段3',
            prop: 'ghk'
          }
        ]
      }
    },
    tableTitle: {
      type: String,
      default: '列表'
    },
    showPage: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    download: {
      type: Boolean,
      default: false
    }
  },
  dragConfig: {
    max: 4,
    onDrop({ layouts, dropRowIndx }) {
      const dropRow = layouts[dropRowIndx]
      if (
        dropRow &&
        dropRow.reduce((i, name) => (name === 'Table' ? i + 1 : i), 0) >= 2
      ) {
        this.$message.error('每行内只能放置两个 Table 组件')
        return false
      }
    }
  },
  editorProps: () => {
    return [
      {
        title: '表格配置',
        props: [
          {
            label: '数据源',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tips: h => {
              return (
                <div>
                  <el-alert
                    class="mb-16"
                    title="一期只支持自定义数据接口"
                    type="info"
                    show-icon
                    closable={false}
                  />
                  <InterfaceDoc
                    title="表格数据接口文档"
                    columns={[
                      {
                        label: '字段',
                        prop: 'prop'
                      },
                      {
                        label: '数据类型',
                        prop: 'type'
                      },
                      {
                        label: '说明',
                        prop: 'desc'
                      }
                    ]}
                    data={[
                      {
                        prop: 'code',
                        type: 'number - 数字',
                        desc: '接口状态值'
                      },
                      {
                        prop: 'pageSize',
                        type: 'number - 数字',
                        desc: '每次请求返回数据条目'
                      },
                      {
                        prop: 'page',
                        type: 'number - 数字',
                        desc: '当前页码'
                      },
                      {
                        prop: 'total',
                        type: 'number - 数字',
                        desc: '数据总量'
                      },
                      {
                        prop: 'data',
                        type: 'object - 对象',
                        desc: '数据主体',
                        children: [
                          {
                            prop: 'columns',
                            type: 'array - 数组',
                            desc: '表头配置',
                            children: [
                              {
                                prop: 'label',
                                type: 'string - 字符串',
                                desc: '每列表头标题'
                              },
                              {
                                prop: 'prop',
                                type: 'string - 字符串',
                                desc: '列内容的字段名'
                              },
                              {
                                prop: 'fixed',
                                type: '"left" | "right"',
                                desc: '列是否固定在左侧或者右侧'
                              }
                            ]
                          },
                          {
                            prop: 'data',
                            type: 'array - 数组',
                            desc: '表格主体数据'
                          }
                        ]
                      }
                    ]}
                    code={{
                      code: 0,
                      pageSize: 20,
                      page: 1,
                      total: 100,
                      data: {
                        columns: [
                          {
                            label: '姓名',
                            prop: 'name'
                          },
                          {
                            label: '年龄',
                            prop: 'age'
                          }
                        ],
                        data: [
                          {
                            name: '张三',
                            age: 20
                          },
                          {
                            name: '李四',
                            age: 22
                          },
                          {
                            name: '王五',
                            age: 24
                          }
                        ]
                      }
                    }}
                  />
                </div>
              )
            },
            prop: 'url',
            type: 'dataSource'
          },
          {
            label: '标题',
            tips: 'tips 值：String类型 使用el-tooltip渲染',
            prop: 'tableTitle',
            type: 'input'
          },
          {
            label: '分页',
            prop: 'showPage',
            type: 'switch'
          },
          {
            label: '序号',
            prop: 'showIndex',
            type: 'switch'
          },
          {
            label: '下载',
            prop: 'download',
            type: 'switch'
          }
        ]
      },
      {
        title: '列设置 (自定义渲染示例)',
        props: [
          {
            custom: true,
            prop: 'columns',
            componentPath: './columns-editor.vue'
          }
        ]
      }
    ]
  },
  inject: ['buildMode'],
  data() {
    return {
      selfColumns: this.columns,
      tableData: [],
      total: 0,
      pageSize: 20,
      currentPage: 1
    }
  },
  watch: {
    columns(list) {
      this.selfColumns = list
      this.fillMockData()
    }
  },
  created() {
    this._params = {}
    // this.processOptions()
  },
  methods: {
    fillMockData() {
      const data = this.selfColumns.reduce((obj, item) => {
        obj[item.prop] = 'Mock数据'
        return obj
      }, {})
      this.tableData = Array(5).fill(data)
    },
    processOptions() {
      // this.selfColumns.forEach(item => {
      //   if (item.sortable && !item['sort-orders']) {
      //     item['sort-orders'] = ['ascending', 'descending']
      //   }
      // })
      // if (this.download) {
      //   this.operateList.push({
      //     label: '下载',
      //     icon: 'el-icon-download',
      //     handler: () => {
      //       this.fetchData({ down: 1 })
      //     }
      //   })
      // }
    },
    sortChange({ prop, order }) {
      if (order) {
        const map = {
          descending: 'desc',
          ascending: 'asc'
        }
        this._params.sort = `${prop}:${map[order]}`
      } else {
        delete this._params.sort
      }
      this.fetchData()
    },
    fetchData(params = {}) {
      if (this.buildMode && !this.url) {
        return new Promise(resolve => {
          setTimeout(() => {
            this.fillMockData()
            resolve()
          }, 1500)
        })
      } else if (this.url) {
        params = {
          ...this._params,
          ...this.params,
          ...params,
          ...(this.showPage
            ? {
                pageSize: this.pageSize,
                page: this.currentPage
              }
            : {})
        }
        this.$emit('before-fetch', params)
        if (params.down) {
          params.page = 1
          return this.$http({
            url: this.url,
            method: 'post',
            params,
            responseType: 'blob'
          }).then(({ data: blob, headers }) => {
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: blob.type })
            )
            const a = this.$refs.downLoadRef
            a.href = url
            const filename =
              /filename="(.*?)"/g.exec(headers['content-disposition'])?.[1] ||
              this.tableTitle + '.xlsx'
            a.download = decodeURIComponent(filename)
            a.click()
          })
        }
        return this.$ajax({
          url: this.url,
          method: 'post',
          params
        })
          .then(({ data }) => {
            if (this.interceptor) {
              if (typeof this.interceptor.then === 'function') {
                return this.interceptor(data)
              } else if (typeof this.interceptor === 'function') {
                return Promise.resolve(this.interceptor(data))
              }
            }
            return Promise.resolve(data)
          })
          .then(data => {
            if (this.remoteColumns) {
              this.tableData = data.data
              this.total = data.count
              this.selfColumns = Object.entries(data.fields).map(
                ([prop, label]) => {
                  const col = {
                    prop,
                    label,
                    ...(this.mergeCol.common || {}),
                    ...(this.mergeCol[prop] || {})
                  }
                  this.processContentType(col)
                  return col
                }
              )
              if (this.showIndex) {
                this.selfColumns.unshift({
                  label: '序号',
                  type: 'index',
                  width: 50,
                  index: index => {
                    return (this.currentPage - 1) * this.pageSize + index + 1
                  }
                })
              }
              if (this.mergeCol.operate) {
                this.selfColumns.push(this.mergeCol.operate)
              }
            } else {
              this.tableData = Array.isArray(data.list)
                ? data.list
                : [data.list]
              this.total = data.total
            }
            this.$emit('on-data', data.list, data, params)
          })
      } else if (this.data) {
        if (this.showPage) {
          this.total = this.data.length
          const start = (this.currentPage - 1) * this.pageSize
          const end = this.currentPage * this.pageSize
          this.tableData = this.data.slice(start, end)
        } else {
          this.tableData = this.data
        }
        return Promise.resolve()
      } else {
        return Promise.resolve()
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.$emit('current-change', currentPage)
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: bold;
}
.table-wrap {
  &.cursor-pointer /deep/ .el-table__body-wrapper {
    cursor: pointer;
  }
}
.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.6);
}
.operate-btn-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  * + * {
    margin-left: 20px;
  }
}
.operate-column-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .operate-column-item + .operate-column-item {
    position: relative;
    margin-left: 16px;
    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 1em;
      margin: auto;
      background-color: #dcdfe6;
    }
  }
}
</style>
