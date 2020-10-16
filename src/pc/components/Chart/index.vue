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
          // pv: {
          //   '2020-04-01': 2628850,
          //   '2020-04-02': 2546674,
          //   '2020-04-03': 2366679,
          //   '2020-04-04': 2059597,
          //   '2020-04-05': 1995238,
          //   '2020-04-06': 2368568,
          //   '2020-04-07': 2585857,
          //   '2020-04-08': 2600281,
          //   '2020-04-09': 2750196,
          //   '2020-04-10': 2596872,
          //   '2020-04-11': 2302591,
          //   '2020-04-12': 2447628,
          //   '2020-04-13': 2668584,
          //   '2020-04-14': 3030401,
          //   '2020-04-15': 3156807,
          //   '2020-04-16': 2955812,
          //   '2020-04-17': 2685086,
          //   '2020-04-18': 2300473,
          //   '2020-04-19': 2507328,
          //   '2020-04-20': 2767578,
          //   '2020-04-21': 2675149,
          //   '2020-04-22': 2704734,
          //   '2020-04-23': 2675720,
          //   '2020-04-24': 2346841,
          //   '2020-04-25': 2329682,
          //   '2020-04-26': 2615247,
          //   '2020-04-27': 2714682,
          //   '2020-04-28': 2767575,
          //   '2020-04-29': 2732957,
          //   '2020-04-30': 2327343,
          //   '2020-05-01': 1997022,
          //   '2020-05-02': 2055619,
          //   '2020-05-03': 2130521,
          //   '2020-05-04': 2078515,
          //   '2020-05-05': 2296769,
          //   '2020-05-06': 2568459,
          //   '2020-05-07': 2680788,
          //   '2020-05-08': 2646218,
          //   '2020-05-09': 2349599,
          //   '2020-05-10': 2431409,
          //   '2020-05-11': 2630332,
          //   '2020-05-12': 2589557,
          //   '2020-05-13': 2535341,
          //   '2020-05-14': 2519226,
          //   '2020-05-15': 2334210,
          //   '2020-05-16': 1998434,
          //   '2020-05-17': 2191514,
          //   '2020-05-18': 2531695,
          //   '2020-05-19': 2604654,
          //   '2020-05-20': 2747020,
          //   '2020-05-21': 2767849,
          //   '2020-05-22': 2577944,
          //   '2020-05-23': 2305847,
          //   '2020-05-24': 2352800,
          //   '2020-05-25': 2523787,
          //   '2020-05-26': 2431559,
          //   '2020-05-27': 2425339,
          //   '2020-05-28': 2853674,
          //   '2020-05-29': 2758133,
          //   '2020-05-30': 2203946,
          //   '2020-05-31': 2299956,
          //   '2020-06-01': 2654664,
          //   '2020-06-02': 2826646,
          //   '2020-06-03': 2879922,
          //   '2020-06-04': 2976338,
          //   '2020-06-05': 2811572,
          //   '2020-06-06': 2286220,
          //   '2020-06-07': 2291302,
          //   '2020-06-08': 2969932,
          //   '2020-06-09': 2916236,
          //   '2020-06-10': 2778874,
          //   '2020-06-11': 3002615,
          //   '2020-06-12': 3002458,
          //   '2020-06-13': 2468044,
          //   '2020-06-14': 2366994,
          //   '2020-06-15': 3099435,
          //   '2020-06-16': 2841161,
          //   '2020-06-17': 2457601,
          //   '2020-06-18': 2963380,
          //   '2020-06-19': 2858745,
          //   '2020-06-20': 2011831,
          //   '2020-06-21': 1958245,
          //   '2020-06-22': 2280238,
          //   '2020-06-23': 2281814,
          //   '2020-06-24': 2053420,
          //   '2020-06-25': 1805130,
          //   '2020-06-26': 2145361,
          //   '2020-06-27': 2419905,
          //   '2020-06-28': 2240188,
          //   '2020-06-29': 2145889,
          //   '2020-06-30': 2033555,
          //   '2020-07-01': 1937639,
          //   '2020-07-02': 1891731,
          //   '2020-07-03': 1671517,
          //   '2020-07-04': 1479866,
          //   '2020-07-05': 1637262,
          //   '2020-07-06': 1884431,
          //   '2020-07-07': 1939536,
          //   '2020-07-08': 962316,
          //   '2020-07-09': 995017,
          //   '2020-07-10': 958392,
          //   '2020-07-11': 753907,
          //   '2020-07-12': 760693,
          //   '2020-07-13': 889297,
          //   '2020-07-14': 1085840,
          //   '2020-07-15': 991743,
          //   '2020-07-16': 976415,
          //   '2020-07-17': 946812,
          //   '2020-07-18': 814091,
          //   '2020-07-19': 769347,
          //   '2020-07-20': 970911,
          //   '2020-07-21': 969013,
          //   '2020-07-22': 978912,
          //   '2020-07-23': 1027656,
          //   '2020-07-24': 1078514,
          //   '2020-07-25': 853944,
          //   '2020-07-26': 736791,
          //   '2020-07-27': 1096703,
          //   '2020-07-28': 992990,
          //   '2020-07-29': 981892,
          //   '2020-07-30': 995494,
          //   '2020-07-31': 1089324,
          //   '2020-08-01': 802496,
          //   '2020-08-02': 856561,
          //   '2020-08-03': 971399,
          //   '2020-08-04': 927562,
          //   '2020-08-05': 1051727,
          //   '2020-08-06': 974153,
          //   '2020-08-07': 1002868,
          //   '2020-08-08': 851954,
          //   '2020-08-09': 898102,
          //   '2020-08-10': 969522,
          //   '2020-08-11': 993483,
          //   '2020-08-12': 1172059,
          //   '2020-08-13': 1013253,
          //   '2020-08-14': 1056541,
          //   '2020-08-15': 861454,
          //   '2020-08-16': 806635,
          //   '2020-08-17': 1113612,
          //   '2020-08-18': 996977,
          //   '2020-08-19': 1001048,
          //   '2020-08-20': 1013564,
          //   '2020-08-21': 985746,
          //   '2020-08-22': 754319,
          //   '2020-08-23': 715065,
          //   '2020-08-24': 925418,
          //   '2020-08-25': 984645,
          //   '2020-08-26': 1126907,
          //   '2020-08-27': 990852,
          //   '2020-08-28': 1040228,
          //   '2020-08-29': 781179,
          //   '2020-08-30': 767303,
          //   '2020-08-31': 1098278,
          //   '2020-09-01': 1061004,
          //   '2020-09-02': 1054425,
          //   '2020-09-03': 1007059,
          //   '2020-09-04': 1006257,
          //   '2020-09-05': 851884,
          //   '2020-09-06': 855406,
          //   '2020-09-07': 1106887
          // },
          // uv: {
          //   '2020-04-01': 1428371,
          //   '2020-04-02': 1428517,
          //   '2020-04-03': 1327187,
          //   '2020-04-04': 1171810,
          //   '2020-04-05': 1142836,
          //   '2020-04-06': 1348546,
          //   '2020-04-07': 1460210,
          //   '2020-04-08': 1483060,
          //   '2020-04-09': 1607160,
          //   '2020-04-10': 1498842,
          //   '2020-04-11': 1317698,
          //   '2020-04-12': 1408059,
          //   '2020-04-13': 1529248,
          //   '2020-04-14': 1765219,
          //   '2020-04-15': 1819230,
          //   '2020-04-16': 1685111,
          //   '2020-04-17': 1540526,
          //   '2020-04-18': 1313247,
          //   '2020-04-19': 1392973,
          //   '2020-04-20': 1550069,
          //   '2020-04-21': 1531065,
          //   '2020-04-22': 1583368,
          //   '2020-04-23': 1590781,
          //   '2020-04-24': 1371163,
          //   '2020-04-25': 1333135,
          //   '2020-04-26': 1507917,
          //   '2020-04-27': 1584822,
          //   '2020-04-28': 1595870,
          //   '2020-04-29': 1574740,
          //   '2020-04-30': 1326176,
          //   '2020-05-01': 1123646,
          //   '2020-05-02': 1170559,
          //   '2020-05-03': 1211856,
          //   '2020-05-04': 1165365,
          //   '2020-05-05': 1280499,
          //   '2020-05-06': 1454879,
          //   '2020-05-07': 1512890,
          //   '2020-05-08': 1487085,
          //   '2020-05-09': 1358332,
          //   '2020-05-10': 1410567,
          //   '2020-05-11': 1526872,
          //   '2020-05-12': 1509836,
          //   '2020-05-13': 1447341,
          //   '2020-05-14': 1440273,
          //   '2020-05-15': 1389755,
          //   '2020-05-16': 1200172,
          //   '2020-05-17': 1265156,
          //   '2020-05-18': 1440554,
          //   '2020-05-19': 1514669,
          //   '2020-05-20': 1648575,
          //   '2020-05-21': 1660363,
          //   '2020-05-22': 1591623,
          //   '2020-05-23': 1457546,
          //   '2020-05-24': 1365882,
          //   '2020-05-25': 1428090,
          //   '2020-05-26': 1408519,
          //   '2020-05-27': 1397016,
          //   '2020-05-28': 1745792,
          //   '2020-05-29': 1742525,
          //   '2020-05-30': 1362785,
          //   '2020-05-31': 1373698,
          //   '2020-06-01': 1606558,
          //   '2020-06-02': 1719141,
          //   '2020-06-03': 1748889,
          //   '2020-06-04': 1876453,
          //   '2020-06-05': 1842560,
          //   '2020-06-06': 1464614,
          //   '2020-06-07': 1385630,
          //   '2020-06-08': 1941149,
          //   '2020-06-09': 1889791,
          //   '2020-06-10': 1780141,
          //   '2020-06-11': 2015767,
          //   '2020-06-12': 2097009,
          //   '2020-06-13': 1682838,
          //   '2020-06-14': 1465741,
          //   '2020-06-15': 1977344,
          //   '2020-06-16': 1740047,
          //   '2020-06-17': 1447146,
          //   '2020-06-18': 1950711,
          //   '2020-06-19': 1930159,
          //   '2020-06-20': 1247100,
          //   '2020-06-21': 1109709,
          //   '2020-06-22': 1253999,
          //   '2020-06-23': 1249346,
          //   '2020-06-24': 1189837,
          //   '2020-06-25': 1075847,
          //   '2020-06-26': 1255106,
          //   '2020-06-27': 1392094,
          //   '2020-06-28': 1248696,
          //   '2020-06-29': 1178048,
          //   '2020-06-30': 1100223,
          //   '2020-07-01': 1044224,
          //   '2020-07-02': 1013286,
          //   '2020-07-03': 894041,
          //   '2020-07-04': 791274,
          //   '2020-07-05': 872214,
          //   '2020-07-06': 1033679,
          //   '2020-07-07': 1084715,
          //   '2020-07-08': 533395,
          //   '2020-07-09': 543878,
          //   '2020-07-10': 526192,
          //   '2020-07-11': 418143,
          //   '2020-07-12': 421973,
          //   '2020-07-13': 484221,
          //   '2020-07-14': 519695,
          //   '2020-07-15': 533172,
          //   '2020-07-16': 506059,
          //   '2020-07-17': 495973,
          //   '2020-07-18': 430608,
          //   '2020-07-19': 433471,
          //   '2020-07-20': 521414,
          //   '2020-07-21': 509530,
          //   '2020-07-22': 501001,
          //   '2020-07-23': 563211,
          //   '2020-07-24': 624521,
          //   '2020-07-25': 491292,
          //   '2020-07-26': 414549,
          //   '2020-07-27': 583295,
          //   '2020-07-28': 509816,
          //   '2020-07-29': 500447,
          //   '2020-07-30': 493403,
          //   '2020-07-31': 582545,
          //   '2020-08-01': 454312,
          //   '2020-08-02': 436655,
          //   '2020-08-03': 506017,
          //   '2020-08-04': 469919,
          //   '2020-08-05': 518903,
          //   '2020-08-06': 498247,
          //   '2020-08-07': 526344,
          //   '2020-08-08': 498212,
          //   '2020-08-09': 517764,
          //   '2020-08-10': 511410,
          //   '2020-08-11': 527326,
          //   '2020-08-12': 659774,
          //   '2020-08-13': 552842,
          //   '2020-08-14': 573535,
          //   '2020-08-15': 452400,
          //   '2020-08-16': 434662,
          //   '2020-08-17': 557118,
          //   '2020-08-18': 534412,
          //   '2020-08-19': 542730,
          //   '2020-08-20': 541999,
          //   '2020-08-21': 514665,
          //   '2020-08-22': 396598,
          //   '2020-08-23': 371586,
          //   '2020-08-24': 475633,
          //   '2020-08-25': 476260,
          //   '2020-08-26': 536360,
          //   '2020-08-27': 506472,
          //   '2020-08-28': 528444,
          //   '2020-08-29': 407481,
          //   '2020-08-30': 396580,
          //   '2020-08-31': 541393,
          //   '2020-09-01': 533348,
          //   '2020-09-02': 529767,
          //   '2020-09-03': 505334,
          //   '2020-09-04': 507696,
          //   '2020-09-05': 461786,
          //   '2020-09-06': 443718,
          //   '2020-09-07': 563179
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
              bottom: 50
              // left: 60,
              // right: 10
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            legend: {
              data: Object.keys(res.option),
              bottom: 8,
              type: 'scroll'
            },
            xAxis: {
              type: 'category',
              data: Object.keys(res.option[Object.keys(res.option)]).map(
                item => {
                  return item
                    .split('-' || '/')
                    .slice(1)
                    .join('-')
                }
              ),
              // data: Object.keys(res.option['广告点击率']).map(item =>
              //   item
              //     .split('-' || '/')
              //     .slice(1)
              //     .join('-')
              // ), //
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
                // name:
                //   Math.min.apply(
                //     Array.prototype,
                //     Object.values(res.option[Object.keys(res.option)[0]])
                //   ) > 10000
                //     ? '万'
                //     : '',
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
                  // if (item > 10000) {
                  //   return item / 10000
                  // } else {
                  //   return item
                  // }
                  return item
                }),
                type: 'line'
              }
            })
            // series: [
            //   {
            //     name: 'pv',
            //     data: Object.values(res.option.pv).map(item => {
            //       if (item > 10000) {
            //         return item / 10000
            //       } else {
            //         return item
            //       }
            //     }),
            //     type: 'line'
            //   },
            //   {
            //     name: 'uv',
            //     data: Object.values(res.option.uv).map(item => {
            //       if (item > 10000) {
            //         return item / 10000
            //       } else {
            //         return item
            //       }
            //     }),
            //     type: 'line'
            //   }
            // ]
          },
          bar: {
            grid: {
              top: 10,
              bottom: 50,
              left: 40,
              right: 10
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            series: [
              {
                top: 0,
                bottom: 0,
                type: 'bar',
                barWidth: '60%',
                label: {
                  show: true,
                  position: 'inside'
                },
                data: [
                  {
                    name: 'Mon',
                    value: 10
                  },
                  {
                    name: 'Tue',
                    value: 52
                  },
                  {
                    name: 'Wed',
                    value: 200
                  },
                  {
                    name: 'Thu',
                    value: 334
                  },
                  {
                    name: 'Fri',
                    value: 390
                  },
                  {
                    name: 'Sat',
                    value: 330
                  },
                  {
                    name: 'Sun',
                    value: 220
                  }
                ]
              }
            ]
          },
          pie: {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
              {
                top: 0,
                bottom: 0,
                type: 'pie',
                radius: ['50%', '70%'],
                data: [
                  { value: 1548, name: '幽州' },
                  { value: 535, name: '荆州' },
                  { value: 510, name: '兖州' },
                  { value: 634, name: '益州' },
                  { value: 735, name: '西凉' }
                ]
              }
            ]
          },
          funnel: {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
              {
                top: 10,
                bottom: 10,
                type: 'funnel',
                label: {
                  show: true,
                  position: 'inside'
                },
                data: [
                  { value: 60, name: '访问' },
                  { value: 40, name: '咨询' },
                  { value: 20, name: '订单' },
                  { value: 80, name: '点击' },
                  { value: 100, name: '展现' }
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
