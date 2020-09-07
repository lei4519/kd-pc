<template>
  <div class="chart-mod">
    <div class="inner" :class="[h ? 'h-' + h: '']">
      <div class="options">
        <el-date-picker
          class="search-date-input"
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
          class="download"
        >
          下载
        </el-button>
        <a v-if="download" ref="downLoadRef"></a>
      </div>
      <div class="title">{{chartObj.title}}</div>
      <div class="time">{{chartObj.startTime}}-{{chartObj.endTime}}</div>
      <div class="horizontal" v-if="compose === 'horizontal'">
        <div class="subtime">{{chartObj.currentEndTime}}</div>
        <div class="horizontal-compare-sum">
          <div class="current-box">
            <div class="current"><span class="val">{{chartObj.endNum}}</span>{{chartObj.endUnit}}</div>
            <div class="compare">
              <div class="huanbi">环比<span class="val_red">{{chartObj.huanBi}}</span></div>
              <div class="tongbi">同比<span class="val_green">{{chartObj.tongBi}}</span></div>
            </div>
          </div>
          <div class="sum-average">
            <div class="sum">合计<span class="val">{{chartObj.sum}}</span>{{chartObj.sumUnit}}</div>
            <div class="average">均值<span class="val">{{chartObj.average}}</span>{{chartObj.averageUnit}}</div>
          </div>
        </div>
        <div class="vertical-r">
          <EchartComponent :option="chartObj.option" ref="echart-component"/>
        </div>
      </div>
      <div class="vertical" v-if="compose === 'vertical'">
        <div class="vertical-l">
          <div class="subtime">{{chartObj.currentEndTime}}</div>
          <div class="current"><span class="val">{{chartObj.endNum}}</span>{{chartObj.endUnit}}</div>
          <div class="compare">
            <div class="huanbi">环比<span class="val_red">{{chartObj.huanBi}}</span></div>
            <div class="tongbi">同比<span class="val_green">{{chartObj.tongBi}}</span></div>
          </div>
          <div class="sum-average">
            <div class="sum">合计<span class="val">{{chartObj.sum}}</span>{{chartObj.sumUnit}}</div>
            <div class="average">均值<span class="val">{{chartObj.average}}</span>{{chartObj.averageUnit}}</div>
          </div>
        </div>
        <div class="vertical-r">
          <EchartComponent :option="chartObj.option" ref="echart-component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EchartComponent from '@/pc/_components/echart'
import { setTimeoutResolve, getRelativeTime, parseTime } from '@/kd/utils'

const throttle = (fn, context) => {
    let t = null
    return () => {
      if (t) {
        clearTimeout(t)
        t = null
      } 
      t = setTimeout(() => {
        fn.call(context)
      }, 1000)
    }
}

export default {
  name: 'Chart',
  zhName: '图表组件',
  minSpan: 2,
  editorProps() {
    return [
      {
        title: '图表配置',
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
                        title="表图数据接口文档"
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
                              prop: 'title',
                              type: 'string - 字符串',
                              desc: '标题'
                          },
                          {
                              prop: 'startTime',
                              type: 'string - 字符串',
                              desc: '开始日期'
                          },
                          {
                              prop: 'endTime',
                              type: 'string - 字符串',
                              desc: '结束日期'
                          },
                          {
                              prop: 'endNum',
                              type: 'number - 数字',
                              desc: '结束日期当天的数据'
                          },
                          {
                              prop: 'endUnit',
                              type: 'string - 字符串',
                              desc: '结束日期当天数据的单位'
                          },
                          {
                              prop: 'huanBi',
                              type: 'string - 字符串',
                              desc: '环比'
                          },
                          {
                              prop: 'tongBi',
                              type: 'string - 字符串',
                              desc: '同比'
                          },
                          {
                              prop: 'sum',
                              type: 'number - 数字',
                              desc: '合计'
                          },
                          {
                              prop: 'sumUnit',
                              type: 'string - 字符串',
                              desc: '合计单位'
                          },
                          {
                              prop: 'average',
                              type: 'number - 数字',
                              desc: '均值'
                          },
                          {
                              prop: 'averageUnit',
                              type: 'string - 字符串',
                              desc: '均值单位'
                          },
                          {
                            prop: 'option',
                            type: 'object - 对象',
                            des: '绘制图表的数据对象',
                            // children: [
                            //   {
                            //     prop: 'xAxis',
                            //     type: '',
                            //     desc: '',
                            //   },
                            //   {
                            //     prop: 'yAxis',
                            //     type: '',
                            //     desc: '',
                            //   },
                            //   {
                            //     prop: 'series',
                            //     type: '',
                            //     desc: ''
                            //   },
                            // ]
                          },
                        ]}
                        code={this.genMockData(true)}
                    />
                    </div>
                )
            },
            prop: 'url',
            type: 'dataSource'
          },
          {
            label: '图表类型',
            prop: 'chartType',
            type: 'select',
            options: [
              {
                label: '折线图',
                value: 'line'
              },
              {
                label: '柱状图',
                value: 'bar'
              },
              {
                label: '饼图',
                value: 'pie'
              },
              {
                  label: '漏斗图',
                  value: 'funnel',
              },
            ]
          },
          {
            label: '排版',
            prop: 'compose',
            type: 'radio',
            options: [
              {
                label: '横排',
                value: 'horizontal'
              },
              {
                label: '竖排',
                value: 'vertical'
              }
            ]
          },
          {
            label: '搜索',
            prop: 'showSearch',
            type: 'switch',
          },
          {
            label: '下载',
            prop: 'download',
            type: 'switch',
          }
        ]
      }
    ]
  },
  components: {
    EchartComponent
  },
  inject: ['asideLayout', 'buildMode'],
  props: {
    url: {
      type: String,
      default: ''
    },
    // 图表类型
    chartType: {
      type: String,
      default: 'line'
    },
    // 排版
    compose: {
      type: String,
      default: 'horizontal'
    },
    // 是否开启日期搜索
    showSearch: {
      type: Boolean,
      default: false
    },
    // 是否开启下载功能
    download: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: {},
      chartObj: {}, // 请求返回数据
      searchDateModel: [], // 开启日期搜索时的选中日期
      h: 344, // .inner高
    }
  },
  watch: {
    // 组件选择或组件设置宽变化要重绘图表
    'asideLayout.width': function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.redraw()
      }
    },
    // 图表类型变化重绘图表
    chartType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.chartObj.option = this.options[newVal] ? this.options[newVal] : {}
        this.redraw()
      }
    },
    // 横排、竖排变化重绘图表
    compose(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.redraw()
      }
    },
    // 布局一行中增加一列重绘图表
    '$attrs.layouts': function(newVal) {
      if (newVal.layouts[newVal.rowIndex].length > 1) {
        this.h = 344
        this.redraw()
      } else {
        this.h = 370
      }
      
    },
    searchDateModel() {
      this.fetchData()
    },
  },
  computed: {
    dateDesc() {
      const [start, end] = this.searchDateModel

      return `${parseTime(start, '{y}-{m}-{d}')} ~ ${parseTime(
        end,
        '{y}-{m}-{d}'
      )}  |  ${(end - start) / 3600 / 1000 / 24}天`
    },
  },
  created() {
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
  },
  mounted() {
    // 监听winodw.onresize事件
    this.throttle = throttle(this.resizeHandle, this)
    window.addEventListener('resize', this.throttle)
  },
  destroyed() {
    // 销毁winodw.onresize事件
    window.removeEventListener('resize', this.throttle)
  },
  methods: {
    // 重绘图表方法
    redraw() {
      this.$refs['echart-component'].setOption()
    },
    // 监听window.onresize事件的处理方法
    resizeHandle() {
      this.redraw()
    },
    genMockData(syncRetrueData = false) {
      const res = {
        title: '30日 | 平均单次使用时长（秒）',
        startTime: '2020-07-26',
        endTime: '2020-08-24',
        currentEndTime: '08-24',
        endNum: '666',
        endUnit: '次',
        huanBi: '50%',
        tongBi: '50%',
        sum: '1000',
        sumUnit: '次',
        average: '100',
        averageUnit: '次',
        option:  {}
      }
      
      return syncRetrueData ? res : setTimeoutResolve(res, 1000)
    },
    fetchData(params = {}) {
      params = {
        ...params
      }
      if (params.download) {
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
      return (this.buildMode && !this.url
        ? this.genMockData()
        : this.$ajax({
            url: this.url,
            method: 'post',
            params
          })
      ).then((res) => {
        this.options = {
          line: {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
          },
          pie: {
            series: [
                {
                    type: 'pie',
                    data: [
                        {value: 1548, name: '幽州'},
                        {value: 535, name: '荆州'},
                        {value: 510, name: '兖州'},
                        {value: 634, name: '益州'},
                        {value: 735, name: '西凉'}
                    ],
                }
            ]
          },
          bar: {
            xAxis: [
                {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                }
            ]
          },
          funnel: {
             tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
              },
              series: [
                  {
                    top: 0,
                    bottom: 0,
                    type:'funnel',
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    data: [
                        {value: 60, name: '访问'},
                        {value: 40, name: '咨询'},
                        {value: 20, name: '订单'},
                        {value: 80, name: '点击'},
                        {value: 100, name: '展现'}
                    ]
                  }
              ]
          }
        }
        res.option = this.options[this.chartType]
        this.chartObj = res
      })
    },
    // 下载
    handlerDownload() {
      this.fetchData({ download: 1 })
    },
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.chart-mod {
  .inner {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 3px;
    position: relative;
    &:hover {
      border-radius: 3px;
    }
    &.h-370{
      height: 370px;
      .horizontal{
        .vertical-r{
          height: 200px;
        }
      }
      .vertical{
        .vertical-r{
          height: 300px;
        }
      }
    }
    &.h-344{
      height: 344px;
      .horizontal{
        .vertical-r{
          height: 174px;
        }
      }
      .vertical{
        .vertical-r{
          height: 274px;
        }
      }
    }
    .options{
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
      .download{
        margin-left: 16px;
      }
    }
    .title {
      color: #5f6e82;
      font-weight: 400;
      font-size: 14px;
      &:hover {
        color: #559ff0;
      }
    }
    .time {
      font-size: 12px;
      color: #8492a6;
    }
    .subtime {
      font-size: 13px;
      color: #8492a6;
      margin-top: 8px;
    }
    .current {
      .val {
        font-size: 40px;
        color: #475669;
      }
    }
    .compare {
      margin-top: 7px;
      margin-left: 10px;
      .val_red {
        color: #fc6772;
        &::before {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-top: 5px solid #fc6772;
          border-right: 5px solid transparent;
        }
      }
      .val_green {
        color: #2dca93;
        &::before {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-top: 5px solid #2dca93;
          border-right: 5px solid transparent;
        }
      }
    }
  }
  .sum-average {
    padding: 12px 0 12px 11px;
    border-left: 1px solid #e9f0f7;
    .val {
      font-size: 18px;
      color: #475669;
    }
  }
  .horizontal-compare-sum {
    display: flex;
    align-items: center;
    .current-box {
      display: flex;
      align-items: center;
      width: 67%;
    }
  }
  .vertical {
    display: flex;
    .vertical-l {
      width: 20%;
    }
    .vertical-r {
      flex: 1;
    }
    .sum-average {
      border-left: none;
      border-top: 1px solid #e9f0f7;
      padding: 28px 0 0;
      margin-top: 28px;
    }
  }
}
.chart-list-1 {
  .chart-chartObj-1 {
    
  }
}
.chart-list-more {
  display: flex;
  flex-wrap: wrap;
  .chart-chartObj-more {
    width: 50%;
  }
}
/deep/ .search-date-input {
  width: auto;
  padding: 4px;
  .el-icon-date {
    flex: 0 0 25px;
    margin: 0;
  }
  .el-range-input {
    flex: 1;
  }
  .el-range-separator {
    flex: 0 0 20px;
  }
  .el-range__close-icon {
    display: none;
  }
  .el-range-input,
  .el-range-separator,
  .el-range__close-icon {
    display: none;
  }
}
</style>
