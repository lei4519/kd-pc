<template>
  <div>
    <overView :groupcompent="true" :data="list"></overView>
  </div>
</template>

<script>
import { setTimeoutResolve } from '@/kd/utils'
import overView from '../overView/index.vue'

export default {
  ...overView,
  name: 'OverViewGroup',
  zhName: '概览组',
  iconClass: 'gailan',
  minSpan: 24,
  maxSpan: 24,
  components: {
    overView
  },
  methods: {
    genMockData(syncRetrueData = false) {
      const res = {
        code: 0,
        data: [
          {
            title: '今日222 | 累计新增用户今日222 | 累计新增用户今日222 | 累计新增用户',
            date: '2020-08-27~2020-08-27 | 今日',
            dateCn: '今日',
            num: 100,
            unit: '人',
            datarr: [
              {
                name: '环比 ',
                ratio: 'up',
                num: '12%',
                desc:'环比上涨12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%',
                desc:'环比上涨12%'
              }
            ],
            desc:[
              {
                title:'今日222 | 累计新增用户今日222 | 累计新增用户今日222 | 累计新增用户今日222 | 累计新增用户今日222 | 累计新增用户',
                content:'今日 | 累计新增用户'
              },
              {
                title:'今日 | 累计新增用户',
                content:'今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户,今日 | 累计新增用户今日 | 累计新增用户今日'
              },
              {
                title:'今日 | 累计新增用户',
                content:'今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户今日 | 累计新增用户,今日 | 累计新增用户今日 | 累计新增用户今日'
              }
            ]
          },
          {
            title: '今日222 | 累计新增用户',
            date: '2020-08-27~2020-08-27 | 今日',
            dateCn: '今日',
            num: 100,
            unit: '人',
            datarr: [
              {
                name: '环比 ',
                ratio: 'up',
                num: '12%',
                desc:'环比上涨12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%',
                desc:'环比上涨12%'
              }
            ],
            desc:[
              {
                title:'今日',
                content:'今日 | 累计新增用户'
              }
            ]
          },
          {
            title: '今日222 | 累计新增用户',
            date: '2020-08-27~2020-08-27 | 今日',
            dateCn: '今日',
            num: 100,
            unit: '人',
            datarr: [
              {
                name: '环比 ',
                ratio: 'up',
                num: '12%',
                desc:'环比上涨12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%',
                desc:'环比上涨12%'
              }
            ],
            desc:[
              {
                title:'今日',
                content:'今日 | 累计新增用户'
              }
            ]
          },
          {
            title: '今日222 | 累计新增用户',
            date: '2020-08-27~2020-08-27 | 今日',
            dateCn: '今日',
            num: 100,
            unit: '人',
            datarr: [
              {
                name: '环比 ',
                ratio: 'up',
                num: '12%',
                desc:'环比上涨12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%',
                desc:'环比上涨12%'
              }
            ],
            desc:[
              {
                title:'今日',
                content:'今日 | 累计新增用户'
              }
            ]
          },
          {
            title: '今日222 | 累计新增用户',
            date: '2020-08-27~2020-08-27 | 今日',
            dateCn: '今日',
            num: 100,
            unit: '人',
            datarr: [
              {
                name: '环比 ',
                ratio: 'up',
                num: '12%',
                desc:'环比上涨12%'
              },
              {
                name: '同比 ',
                ratio: 'down',
                num: '23.5%',
                desc:'环比上涨12%'
              }
            ],
            desc:[
              {
                title:'今日',
                content:'今日 | 累计新增用户'
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
  width: 25%;
  box-sizing: border-box;
  .view_inner {
    background: #fff;
    padding: 20px 14px;
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
