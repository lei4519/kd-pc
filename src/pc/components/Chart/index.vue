<template>
  <div class="chart-mod">
    <div class="inner" :class="[h ? 'h-' + h : '']">
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
      <div class="title ellipsis" :title="chartObj.title">
        {{ chartObj.title }}
      </div>
      <div class="time" v-if="chartObj.startTime && chartObj.endTime">
        {{ chartObj.startTime }}-{{ chartObj.endTime }}
      </div>
      <div class="horizontal" v-if="compose === 'horizontal'">
        <div class="subtime" v-if="chartObj.currentEndTime">
          {{ chartObj.currentEndTime }}
        </div>
        <div class="horizontal-compare-sum">
          <div class="current-box">
            <div class="current">
              <span class="val" v-if="chartObj.endNum">{{
                chartObj.endNum
              }}</span
              >{{ chartObj.endUnit }}
            </div>
            <div class="compare" v-if="chartObj.huanBi || chartObj.tongBi">
              <div class="huanbi" v-if="chartObj.huanBi">
                环比<span class="val_red">{{ chartObj.huanBi }}</span>
              </div>
              <div class="tongbi" v-if="chartObj.tongBi">
                同比<span class="val_green">{{ chartObj.tongBi }}</span>
              </div>
            </div>
          </div>
          <div class="sum-average">
            <div class="sum" v-if="chartObj.sum">
              合计<span class="val">{{ chartObj.sum }}</span
              >{{ chartObj.sumUnit }}
            </div>
            <div class="average" v-if="chartObj.average">
              均值<span class="val">{{ chartObj.average }}</span
              >{{ chartObj.averageUnit }}
            </div>
          </div>
        </div>
        <div class="vertical-r">
          <EchartComponent :option="chartObj.option" ref="echart-component" />
        </div>
      </div>
      <div class="vertical" v-if="compose === 'vertical'">
        <div class="vertical-l">
          <div class="subtime">{{ chartObj.currentEndTime }}</div>
          <div class="current">
            <span class="val">{{ chartObj.endNum }}</span
            >{{ chartObj.endUnit }}
          </div>
          <div class="compare">
            <div class="huanbi">
              环比<span class="val_red">{{ chartObj.huanBi }}</span>
            </div>
            <div class="tongbi">
              同比<span class="val_green">{{ chartObj.tongBi }}</span>
            </div>
          </div>
          <div class="sum-average">
            <div class="sum">
              合计<span class="val">{{ chartObj.sum }}</span
              >{{ chartObj.sumUnit }}
            </div>
            <div class="average">
              均值<span class="val">{{ chartObj.average }}</span
              >{{ chartObj.averageUnit }}
            </div>
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
import { duration } from '@/kd/style/global-variable.scss'

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
  iconClass: 'tubiao-zhexiantu',
  minSpan: 12,
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
                        des: '绘制图表的数据对象'
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
                      }
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
                value: 'funnel'
              }
            ]
          },
          ...(this.chartType === 'line' || this.chartType === 'bar'
            ? [
                {
                  label: 'x轴倾斜度',
                  prop: 'rotate',
                  type: 'slider',
                  formCompProps: {
                    min: -90,
                    max: 90
                  }
                }
              ]
            : []),
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
            type: 'switch'
          },
          {
            label: '下载',
            prop: 'download',
            type: 'switch'
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
    },
    // x轴刻度倾斜
    rotate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options: {},
      chartObj: {}, // 请求返回数据
      searchDateModel: [], // 开启日期搜索时的选中日期
      h: 344 // .inner高
    }
  },
  computed: {
    dateDesc() {
      const [start, end] = this.searchDateModel

      return `${parseTime(start, '{y}-{m}-{d}')} ~ ${parseTime(
        end,
        '{y}-{m}-{d}'
      )}  |  ${(end - start) / 3600 / 1000 / 24}天`
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
      } else {
        this.h = 370
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.redraw()
        }, parseFloat(duration) * 1000 + 100)
      })
    },
    searchDateModel() {
      this.fetchData()
    },
    //  x轴倾斜度变化
    rotate(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.chartType === 'line' || this.chartType === 'bar') {
          this.chartObj.option.xAxis.axisLabel.rotate = newVal
          this.redraw()
        }
      }
    }
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
        option: {
          广告点击率: {
            '2020-10-21': 1.75,
            '2020-10-22': 1.74,
            '2020-10-23': 2.42,
            '2020-10-24': 1.05,
            '2020-10-25': 1.87,
            '2020-10-26': 1.12,
            '2020-10-27': 0.98,
            '2020-10-28': 1.76,
            '2020-10-29': 1.74,
            '2020-10-30': 1.23,
            '2020-10-31': 2.11,
            '2020-11-01': 2.78,
            '2020-11-02': 1.98,
            '2020-11-03': 2.13,
            '2020-11-04': 0.66,
            '2020-11-05': 0.89,
            '2020-11-06': 1.11,
            '2020-11-07': 1.25,
            '2020-11-08': 2.1,
            '2020-11-09': 1.77,
            '2020-11-10': 1.45,
            '2020-11-11': 1.88
          }
          // 广告点击率x: {
          //   '2020-10-21': 1.75,
          //   '2020-10-22': 1.74,
          //   '2020-10-23': 2.42,
          //   '2020-10-24': 1.05,
          //   '2020-10-25': 1.87,
          //   '2020-10-26': 1.12,
          //   '2020-10-27': 0.98,
          //   '2020-10-28': 1.76,
          //   '2020-10-29': 1.74,
          //   '2020-10-30': 1.23,
          //   '2020-10-31': 2.11,
          //   '2020-11-01': 2.78,
          //   '2020-11-02': 1.98,
          //   '2020-11-03': 2.13,
          //   '2020-11-04': 0.66,
          //   '2020-11-05': 0.89,
          //   '2020-11-06': 1.11,
          //   '2020-11-07': 1.25,
          //   '2020-11-08': 2.1,
          //   '2020-11-09': 1.77,
          //   '2020-11-10': 1.45,
          //   '2020-11-11': 1.88
          // }
        }
      }
      return syncRetrueData
        ? { data: res }
        : setTimeoutResolve({ data: res }, 1000)
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
      ).then(({ data: res }) => {
        this.options = {
          line: {
            grid: {
              // top:
              //   Math.min.apply(
              //     Array.prototype,
              //     Object.values(res.option[Object.keys(res.option)[0]])
              //   ) > 10000
              //     ? 40
              //     : 10,
              top: 10,
              bottom: 50,
              left: '3%',
              right: '5%',
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}'
            },
            legend: {
              data: Object.keys(res.option),
              bottom: 8,
              type: 'scroll'
            },
            xAxis: {
              type: 'category',
              data: Object.keys(res.option[Object.keys(res.option)[0]]).map(
                item => {
                  return item
                }
              ),
              axisLabel: {
                rotate: 0,
                color: '#8492A6',
                fontSize: '10px',
                fontFamily: '"PingFang SC", 微软雅黑'
              },
              axisTick: {
                alignWithLabel: true
              }
            },
            yAxis: [
              {
                type: 'value',
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  color: '#8492A6',
                  fontSize: '10px',
                  fontFamily: '"PingFang SC", 微软雅黑'
                },
                // min: Math.min.apply(Array.prototype, Object.values(res.option.pv).concat(Object.values(res.option.uv))),
                // max: Math.max.apply(Array.prototype, Object.values(res.option.pv).concat(Object.values(res.option.uv))),
                splitLine: {
                  lineStyle: {
                    type: 'dotted'
                  }
                }
              }
            ],
            series: Object.keys(res.option).map(key => {
              return {
                name: key,
                data: Object.values(res.option[key]).map(item => {
                  return item
                }),
                type: 'line'
              }
            })
          },
          bar: {
            grid: {
              top: 10,
              bottom: 50,
              left: '3%',
              right: '5%',
              containLabel: true
            },
            legend: {
              data: Object.keys(res.option),
              bottom: 8,
              type: 'scroll'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            xAxis: {
              type: 'category',
              data: Object.keys(res.option[Object.keys(res.option)[0]]).map(
                item => {
                  return item
                }
              ),
              axisLabel: {
                rotate: 0,
                color: '#8492A6',
                fontSize: '10px',
                fontFamily: '"PingFang SC", 微软雅黑'
              }
            },
            yAxis: {
              axisLabel: {
                color: '#8492A6',
                fontSize: '10px',
                fontFamily: '"PingFang SC", 微软雅黑'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dotted'
                }
              }
            },
            series: Object.keys(res.option).map(key => {
              return {
                name: key,
                type: 'bar',
                data: Object.values(res.option[key]).map(item => {
                  return item
                })
              }
            })
          },
          pie: {
            grid: {
              top: 10,
              bottom: 50,
              left: '3%',
              right: '5%',
              containLabel: true
            },
            legend: {
              data: Object.keys(res.option),
              bottom: 8,
              type: 'scroll'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            series: Object.keys(res.option).map(key => {
              return {
                name: key,
                type: 'pie',
                radius: ['50%', '70%'],
                data: Object.entries(res.option[key]).map(([name, value]) => {
                  return {
                    name,
                    value
                  }
                })
              }
            })
          },
          funnel: {
            grid: {
              top: 10,
              bottom: 50,
              left: '3%',
              right: '5%',
              containLabel: true
            },
            legend: {
              data: Object.keys(res.option),
              bottom: 0,
              type: 'scroll',
              icon: 'none'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}'
            },
            series: Object.keys(res.option).map(key => {
              return {
                top: 10,
                bottom: 10,
                left: '18%',
                right: '18%',
                type: 'funnel',
                label: {
                  show: true,
                  position: 'inside'
                },
                name: key,
                data: Object.entries(res.option[key]).map(([name, value]) => {
                  return {
                    name,
                    value
                  }
                })
              }
            })
          }
        }
        res.option = this.options[this.chartType]
        this.chartObj = res
      })
    },
    // 下载
    handlerDownload() {
      this.fetchData({ download: 1 })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
}
.chart-mod {
  font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  .inner {
    padding: $component-padding $component-padding 0;
    background-color: #ffffff;
    border-radius: 3px;
    position: relative;
    &:hover {
      border-radius: 3px;
    }
    &.h-370 {
      height: 370px;
      .horizontal {
        .vertical-r {
          height: 240px;
        }
      }
      .vertical {
        .vertical-r {
          height: 350px;
        }
      }
    }
    &.h-344 {
      // height: 344px;
      .horizontal {
        .vertical-r {
          height: 214px;
        }
      }
      .vertical {
        .vertical-r {
          height: 314px;
        }
      }
    }
    .options {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
      .download {
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
      color: #8492a6;
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
    .huanbi,
    .tongbi,
    .sum,
    .average {
      color: #8492a6;
    }
  }
  .sum-average {
    padding-left: 12px;
    border-left: 1px solid #e9f0f7;
    .val {
      color: #475669;
      font-size: 18px;
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
