<template>
  <!-- <div class> -->
  <div class="overview-warp">
    <div
      :class="!groupcompent ? 'view_item' : 'view_item widt25'"
      v-for="(item, index) in list"
      :key="index"
      :style="groupcompent ? 'padding-right:16px; padding-bottom:16px' : ''"
    >
      <div class="view_inner">
        <div class="title">{{ item.title }}</div>
        <div class="range">{{ item.date }}</div>
        <div class="container">
          <div>{{ item.dateCn }}</div>
          <div>
            <span class="number">{{ item.num }}</span>
            <span>{{ item.unit }}</span>
          </div>
          <el-tooltip
            class="kpi-warp"
            effect="dark"
            content="Top Left 提示文字"
            placement="top-start"
            v-for="arritem in item.datarr"
          >
            <div class="kpi-contont">
              <span>{{ arritem.name }}</span>
              <span :class="arritem.ratio == 'up' ? 'kpi-drop' : 'kpi-rise'">
                <i
                  :class="
                    arritem.ratio == 'up'
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                <span>{{ arritem.num }}</span>
              </span>
            </div>
          </el-tooltip>
          <div>
            <i class="el-icon-question" style="float:right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { setTimeoutResolve } from '@/kd/utils'
export default {
  name: 'OverView',
  zhName: '概览组件',
  iconClass: 'gailan',
  minSpan: 6,
  maxSpan: 6,
  props: {
    url: {
      type: String,
      default: ''
    },
    groupcompent: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  editorProps() {
    return [
      {
        title: '概览配置',
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
                    title="概览数据接口文档"
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
                        prop: 'data',
                        type: 'object - 对象',
                        desc: '数据主体',
                        children: [
                          {
                            prop: 'title',
                            type: 'string-字符串',
                            desc: '概览标题'
                          },
                          {
                            prop: 'date',
                            type: 'string-字符串',
                            desc: '概览日期'
                          },
                          {
                            prop: 'dateCn',
                            type: 'string-字符串',
                            desc: '概览日期中文'
                          },
                          {
                            prop: 'num',
                            type: 'number-数字',
                            desc: '概览数值'
                          },
                          {
                            prop: 'unit',
                            type: 'string-字符串',
                            desc: '概览数值的单位'
                          },
                          {
                            prop: 'datarr',
                            type: 'array-数组',
                            desc: '概览环比同比数组',
                            children: [
                              {
                                prop: 'name',
                                type: 'string - 字符串',
                                desc: '数据name'
                              },
                              {
                                prop: 'ratio',
                                type: 'string-字符串',
                                desc: '比率：up上升 down下降'
                              },
                              {
                                prop: 'num',
                                type: 'string-字符串',
                                desc: '数值'
                              }
                            ]
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
            type: 'dataSource'
          }
        ]
      }
    ]
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.list = newVal
      }
    }
  },
  created() {
    this.genMockData()
    console.log(this)
  },
  methods: {
    genMockData(syncRetrueData = false) {
      const res = {
        code: 0,
        data: [
          {
            title: '今日 | 累计新增用户',
            date: '2020-08-27~2020-08-27 | 今日',
            dateCn: '今日',
            num: 100,
            unit: '人',
            datarr: [
              {
                name: '环比 ',
                ratio: 'up',
                num: '12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%'
              }
            ]
          }
        ]
      }
      return syncRetrueData ? res : setTimeoutResolve(res, 1000)
    },
    fetchData(params = {}) {
      params = {
        ...params
      }
      // 搭建模式 + 没有url就模拟数据返回
      return (!this.url
        ? this.genMockData()
        : this.$ajax({
            url: this.url,
            method: 'post',
            params
          })
      ).then(({ data }) => {
        this.list = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.overview-warp {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: 178px;
}
.view_item {
  width: 100%;
  box-sizing: border-box;
  .view_inner {
    background: #fff;
    padding: 20px 14px;
  }
  &.widt25 {
    width: 25%;
  }
}
.title {
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 400;
  color: #777c7c;
}
.range {
  font-size: 12px;
  color: #8492a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.container {
  font-weight: 400;
  color: #8492a6;
  font-size: 13px;
  padding-top: 8px;
  .number {
    font-size: 40px;
    color: #475669;
  }
}
.kpi-warp {
  display: inline;
  padding-right: 8px;
}
.kpi-contont {
  font-size: 12px;
  .kpi-drop {
    color: #fc6772;
  }
  .kpi-rise {
    color: #2dca93;
  }
}
</style>
