<template>
  <!-- <div class> -->
  <div :class="!groupcompent ? 'overview-warp' : 'overview-warp negativeright'">
    <div
      :class="!groupcompent ? 'view_item' : 'view_item widt25'"
      v-for="(item, index) in list"
      :key="index"
    >
      <div
        :class="groupcompent ? 'view_inner component-decoration' : 'view_inner'"
      >
        <div class="title nowrap-ellipsis" :title="item.title">
          {{ item.title }}
        </div>
        <div class="range nowrap-ellipsis" :title="item.date">
          {{ item.date }}
        </div>
        <div class="container">
          <div>{{ item.dateCn }}</div>
          <div>
            <span class="number">{{ item.num }}</span>
            <span>{{ item.unit }}</span>
          </div>
          <div style="height: 16px">
            <template v-for="(arritem, i) in item.datarr">
              <el-tooltip
                :key="i"
                class="kpi-warp"
                effect="dark"
                :content="arritem.desc"
                placement="top-start"
              >
                <div class="kpi-contont">
                  <span>{{ arritem.name }}</span>
                  <span
                    :class="
                      arritem.ratio == 'up'
                        ? 'kpi-drop'
                        : arritem.ratio == 'down'
                        ? 'kpi-rise'
                        : ''
                    "
                  >
                    <i
                      :class="
                        arritem.ratio == 'up'
                          ? 'el-icon-caret-top'
                          : arritem.ratio == 'down'
                          ? 'el-icon-caret-bottom'
                          : ''
                      "
                    ></i>
                    <span>{{ arritem.num }}</span>
                  </span>
                </div>
              </el-tooltip>
            </template>
          </div>
          <div class="tips-warp" v-if="item.desc && item.desc.length">
            <el-popover trigger="hover">
              <div class="tip">
                <div v-for="(i, k) in item.desc" :key="k">
                  <div
                    class="title nowrap-ellipsis"
                    v-if="item.title"
                    :title="i.title"
                  >
                    {{ i.title }}
                  </div>
                  <div
                    :class="[
                      { 'tip-desc-one': i.title || i.content },
                      'tip-desc'
                    ]"
                    v-if="i.content"
                    v-html="i.content"
                  ></div>
                </div>
              </div>
              <div
                slot="reference"
                class="el-icon-question"
                style="float:right"
              ></div>
            </el-popover>
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
  zhName: '概览',
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
  dragConfig: {
    onDrop({ layouts, rowIndex }) {
      const dropRow = layouts[rowIndex]
      if (
        dropRow &&
        dropRow.some(
          ({ name }) => !(name === 'OverView' || name === 'OverViewGroup')
        )
      ) {
        this.$message.error({
          message: '概览组件只能与概览组件放置一行内',
          duration: 5000
        })
        return false
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
                        type: 'Array - 数组',
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
                              },
                              {
                                prop: 'desc',
                                type: 'string-字符串',
                                desc: 'tips描述'
                              }
                            ]
                          },
                          {
                            prop: 'desc',
                            type: 'array-数组',
                            desc: '描述',
                            children: [
                              {
                                prop: 'title',
                                type: 'string - 字符串',
                                desc: '标题'
                              },
                              {
                                prop: 'content',
                                type: 'string-字符串',
                                desc: '内容'
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
                num: '12%',
                desc: '环比上涨12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%',
                desc: '同比上涨12%'
              }
            ],
            desc: [
              {
                title: '今日 | 累计新增用户',
                content:
                  '今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户,今日 | 累计新增用户今日 | 累计新增用户今日'
              },
              {
                title: '今日 | 累计新增用户',
                content:
                  '今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户,今日 | 累计新增用户今日 | 累计新增用户今日'
              }
            ]
          }
        ]
      }
      return syncRetrueData
        ? { data: res }
        : setTimeoutResolve({ data: res }, 1000)
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
      ).then(({ data: { data } }) => {
        this.list = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.nowrap-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.overview-warp {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // min-height: 178px;
  &.negativeright {
    margin-right: -$component-padding;
  }
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
    padding-right: $component-padding;
    margin-bottom: $component-padding;
    &:nth-child(n + 5) {
      margin-bottom: 0;
    }
  }
}
.title {
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 400;
  color: #777c7c;
  &:hover {
    color: #559ff0;
  }
}
.range {
  font-size: 12px;
  color: #8492a6;
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
.tip {
  width: 290px;
  max-height: 300px;
  overflow: auto;
  padding: 16px 16px;
  color: #777c7c;
  .title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .tip-desc {
    font-size: 12px;
    color: #8492a6;
    &.tip-desc-one {
      margin-bottom: 24px;
    }
  }
}
.el-icon-question {
  cursor: pointer;
  color: #ccc;
  &:hover {
    color: #559ff0;
  }
}
.tips-warp {
  width: 16px;
  height: 16px;
  float: right;
  margin-top: 10px;
}
</style>
