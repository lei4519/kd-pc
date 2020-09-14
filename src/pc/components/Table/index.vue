<template>
  <div class="table-component-wrap clearfix">
    <div class="title-wrap">
      <div class="title">
        <div class="title-text" v-skeleton="{ width: '100px', height: '20px' }">
          {{ tableTitle }}
        </div>
        <div
          class="desc"
          v-if="showSearch"
          v-skeleton="{ width: '300px', height: '20px' }"
        >
          {{ dateDesc }}
        </div>
      </div>
      <div class="operate-wrap">
        <div
          class="operate-btn-wrap"
          v-if="operateList.length || download || showSearch"
        >
          <template v-for="(operate, i) in operateList">
            <Expand
              :key="i"
              v-if="operate.render"
              :render="operate.render"
              :props="operate"
            />
            <el-button
              v-else
              v-skeleton
              type="primary"
              size="mini"
              v-bind="operate"
              @click="operate.handler(operate, i)"
              :key="i"
              >{{ operate.label }}</el-button
            >
          </template>
          <el-date-picker
            class="mini"
            v-if="showSearch"
            v-model="searchDateModel"
            type="daterange"
            size="mini"
            :clearable="false"
            :pickerOptions="pickerOptions"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
          <el-button
            v-if="download"
            v-skeleton
            type="primary"
            size="mini"
            icon="el-icon-download"
            @click="handlerDownload"
          >
            下载
          </el-button>
        </div>
      </div>
    </div>
    <div v-skeleton class="table-wrap">
      <el-table
        :height="tableHeight"
        ref="elTable"
        size="mini"
        :class="{ 'cursor-pointer': $attrs['highlight-current-row'] }"
        :data="tableData"
        :stripe="false"
        v-bind="$attrs"
        v-on="{ ...$listeners }"
        @sort-change="onSortChange"
      >
        <el-table-column
          v-if="showIndex && tableData.length"
          key="index"
          label="序号"
          type="index"
          :width="50"
          :index="index => (currentPage - 1) * pageSize + index + 1"
        />
        <template v-for="item in selfColumns">
          <el-table-column
            v-if="item.type === 'operate'"
            :key="item.prop"
            v-bind="item"
          >
            <template slot-scope="scope">
              <ul class="operate-column-list">
                <el-button
                  class="operate-column-item"
                  v-for="(operate, i) in typeof item.operateList === 'function'
                    ? item.operateList(scope)
                    : item.operateList"
                  :key="i"
                  :disabled="operate.disabled"
                  size="mini"
                  @click="
                    operate.handler && !operate.disabled
                      ? operate.handler(scope, item, operate)
                      : noop
                  "
                  type="text"
                  >{{ operate.label }}</el-button
                >
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
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.type === 'render'"
            :key="item.prop"
            v-bind="item"
          >
            <template slot-scope="scope">
              <Expand :render="item.render" :props="scope" />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.type === 'renderHeader'"
            :key="item.prop"
            v-bind="item"
          >
            <template #header="scope">
              <Expand :render="item.renderHeader" :props="scope" />
            </template>
          </el-table-column>
          <el-table-column v-else :key="item.prop" v-bind="item" />
        </template>
        <span slot="empty">{{ noDataText }}</span>
      </el-table>
    </div>
    <el-pagination
      v-skeleton="{ width: '100px' }"
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
import { setTimeoutResolve, getRelativeTime, parseTime } from '@/kd/utils'
export default {
  name: 'Table',
  zhName: '表格组件',
  iconClass: 'biaoge',
  minSpan: 12,
  props: {
    url: {
      type: String,
      default: ''
    },
    tableTitle: {
      type: String,
      default: '列表'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    showPage: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    defaultSearchDate: {
      type: Number,
      default: -7
    },
    searchParam: {
      type: String,
      default: 'date'
    },
    pageSize: {
      type: Number,
      default: 20
    },
    download: {
      type: Boolean,
      default: false
    },
    mergeCol: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  dragConfig: {
    onDrop({ layouts, rowIndex }) {
      const dropRow = layouts[rowIndex]
      if (
        dropRow &&
        dropRow.some(({ name }) => !(name === 'Table' || name === 'Chart'))
      ) {
        this.$message.error({
          message: '表格组件只能与表格、图表组件放置一行内',
          duration: 5000
        })
        return false
      }
    }
  },
  commonSetting: {
    font: false
  },
  editorProps() {
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
                            desc:
                              '表头配置, label，prop必须返回。其他属性也可在页面中进行可视化编辑',
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
                                prop: 'sortable',
                                type: 'boolean - 布尔值',
                                desc:
                                  '指定当前字段为排序字段，发送请求时参数为 sort: "prop:ascending"'
                              },
                              {
                                prop: 'defaultSort',
                                type: '"ascending" | "descending"',
                                desc:
                                  '如果指定了此属性则会将当前字段作为列表默认排序字段，如果指定多个则只会生效遍历中遇到的第一个。'
                              },
                              {
                                prop: 'align',
                                type: '"left" | "right" ｜ "center"',
                                desc: '列文字对齐方式'
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
                    code={this.genMockData(true)}
                  />
                </div>
              )
            },
            prop: 'url',
            type: 'dataSource',
            formItemProps: {
              rules: [{ required: true, message: '数据源不能为空' }]
            }
          },
          {
            label: '标题',
            prop: 'tableTitle',
            type: 'input',
            formCompProps: {
              maxlength: 20
            }
          },
          {
            label: '表格提示',
            tips: '表格数据为空时展示',
            prop: 'emptyText',
            type: 'input'
          },
          {
            label: '下载',
            prop: 'download',
            tips: '下载请求会给当前的数据源 url 加上 download=1 的参数',
            type: 'switch'
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
            label: '搜索',
            prop: 'showSearch',
            type: 'switch'
          },
          ...(this.showSearch
            ? [
                {
                  label: '搜索请求字段',
                  prop: 'searchParam',
                  tips:
                    '日期参数格式统一为数组，第一位为开始时间，第二位为结束时间',
                  type: 'input',
                  formItemProps: {
                    rules: [{ required: true, message: '请求字段不能为空' }]
                  }
                },
                {
                  label: '默认搜索时间',
                  prop: 'defaultSearchDate',
                  type: 'select',
                  options: this.shortcutMap
                }
              ]
            : [])
        ]
      },
      ...(this.selfColumns.length
        ? [
            {
              title: '列数据设置',
              props: [
                {
                  type: 'customEditor',
                  prop: 'mergeCol',
                  componentPath: 'components/Table/columns-editor.vue'
                }
              ]
            }
          ]
        : [])
    ]
  },
  inject: {
    buildMode: {
      default: false
    }
  },
  data() {
    return {
      operateList: [],
      selfColumns: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      defaultSort: null,
      noDataText: '',
      searchDateModel: []
    }
  },
  computed: {
    dateDesc() {
      const [start, end] = this.searchDateModel

      return `${parseTime(start, '{y}-{m}-{d}')} ~ ${parseTime(
        end,
        '{y}-{m}-{d}'
      )}  |  ${(end - start) / 3600 / 1000 / 24}天`
    },
    tableHeight() {
      // 布局信息
      const { layouts, rowIndex } = this.$attrs.layouts
      // 所在行只有一个元素
      if (layouts[rowIndex].length <= 1) {
        return void 0
      }
      let height = 238
      const PAGE_HEIGHT = 26
      const SEARCH_HEIGHT = 12
      if (!this.showPage) {
        height += PAGE_HEIGHT
      }
      if (!this.showSearch) {
        height += SEARCH_HEIGHT
      }
      return height
    }
  },
  watch: {
    mergeCol() {
      this.processMergeCol()
    },
    searchDateModel() {
      this.fetchData()
    },
    defaultSearchDate: {
      handler(relative) {
        this.searchDateModel = getRelativeTime(relative)
      },
      immediate: true
    }
  },
  created() {
    this._params = {}
    this.shortcutMap = [
      {
        label: '当天',
        value: 0
      },
      {
        label: '最近一周',
        value: -7
      },
      {
        label: '最近一个月',
        value: -30
      },
      {
        label: '最近三个月',
        value: -90
      },
      {
        label: '最近一年',
        value: -365
      }
    ]
    this.pickerOptions = {
      shortcuts: this.shortcutMap.map(({ label, value }) => ({
        text: label,
        onClick(picker) {
          picker.$emit('pick', getRelativeTime(value))
        }
      }))
    }
    this.genMockData()
  },
  methods: {
    genMockData(syncRetrueData = false) {
      const res = {
        code: 0,
        pageSize: 5,
        page: 1,
        total: 5,
        data: {
          columns: [
            {
              label: '城市',
              prop: 'city',
              align: 'left'
            },
            {
              label: 'PV',
              prop: 'pv',
              sortable: 1,
              defaultSort: 'ascending',
              align: 'right'
            },
            {
              label: 'UV',
              prop: 'uv',
              sortable: 1,
              align: 'right'
            },
            {
              label: '线索量',
              prop: 'xs',
              sortable: 1,
              align: 'right'
            },
            {
              label: '发文量',
              prop: 'fw',
              sortable: 1,
              align: 'right'
            },
            {
              label: '曝光量',
              prop: 'bg',
              sortable: 1,
              align: 'right'
            }
          ],
          data: Array(15).fill({
            city:
              '北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京',
            pv: (Math.random() * 1000) | 0,
            uv: (Math.random() * 1000) | 0,
            xs: (Math.random() * 1000) | 0,
            fw: (Math.random() * 1000) | 0,
            bg: (Math.random() * 1000) | 0
          })
        }
      }
      return syncRetrueData ? res : setTimeoutResolve(res, 1000)
    },
    processMergeCol(columns) {
      columns = columns || this.selfColumns
      this.selfColumns = columns.map(item => {
        const col = {
          ...item,
          ...(this.mergeCol.common || {}),
          ...(this.mergeCol[item.prop] || {}),
          showOverflowTooltip: true,
          maxWidth: 200
        }
        if (col.defaultSort && !this.defaultSort) {
          this.defaultSort = { prop: item.prop, order: col.defaultSort }
          setTimeout(() => {
            setTimeout(() => {
              this.$refs.elTable &&
                this.$refs.elTable.store.commit('sort', this.defaultSort)
            })
          })
        }
        if (col.sortable) {
          col.sortable = 'custom'
        }
        return col
      })
      if (this.mergeCol.operate) {
        this.selfColumns.push(this.mergeCol.operate)
      }
    },
    onSortChange({ prop, order }) {
      // 可能是设置 defaultSort 时触发的
      const { prop: dProp, order: dOrder } = this.defaultSort
      if (dProp === prop && dOrder === order) return
      if (order) {
        this._params.sort = `${prop}:${order}`
      } else {
        Reflect.deleteProperty(this._params, 'sort')
      }
      this.fetchData()
    },
    handlerDownload() {
      this.fetchData({ download: 1 })
    },
    fetchData(params = {}) {
      params = {
        ...params,
        ...this._params,
        ...(this.showSearch
          ? { [this.searchParam]: this.searchDateModel }
          : {}),
        ...(this.showPage
          ? {
              pageSize: this.pageSize,
              page: this.currentPage
            }
          : {})
      }
      if (params.download) {
        if (this.showPage) {
          params.page = 1
        }
        return this.$ajax({
          url: this.url,
          method: 'post',
          params,
          responseType: 'blob'
        }).then(({ data: blob, headers } = {}) => {
          if (!blob) {
            return this.$message.error('接口错误，请返回下载数据')
          }
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
      // 搭建模式 + 没有url就模拟数据返回
      return (this.buildMode && !this.url
        ? this.genMockData()
        : this.$ajax({
            url: this.url,
            method: 'post',
            params
          })
      ).then(({ data, total } = {}) => {
        if (!data || !data.columns || !data.data) {
          return this.$message.error('接口错误，请检查接口返回的数据结构')
        }
        this.processMergeCol(data.columns)
        this.tableData = data.data
        this.noDataText = data.data.length ? '' : this.emptyText
        this.total = total
      })
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
.table-component-wrap {
  padding: 16px;
  background-color: #fff;
}
.title-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  .title {
    line-height: 28px;
    font-size: 14px;
    color: #5f6e82;
    max-width: 65%;
    .title-text {
      @include ellipsis;
    }
  }
  .desc {
    font-size: 12px;
    line-height: 1;
    color: #8492a6;
    @include ellipsis;
  }
}
.table-wrap {
  color: #475669;
  /deep/ .el-table {
    &::before {
      display: none;
    }
    &.el-table--mini td,
    &.el-table--mini th {
      padding: 7px 0;
    }
    &.cursor-pointer .el-table__body-wrapper {
      cursor: pointer;
    }
    .el-table__header-wrapper {
      th {
        background-color: #f5f8fc;
        color: #1f2d3d;
        font-weight: bold;
        &.is-leaf {
          border-bottom: none;
        }
      }
      .caret-wrapper {
        .sort-caret {
          border-width: 4px;
          &.ascending {
            top: 7px;
          }
          &.descending {
            bottom: 9px;
          }
        }
      }
    }
  }
}
.table-pagination {
  float: right;
  margin-top: 4px;
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.6);
}
.operate-btn-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  * + * {
    margin-left: 16px;
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
