<script>
/* eslint-disable @typescript-eslint/camelcase */
/**
 * @description 发起请求时为组件加入loading效果
 * @wraning 如果不传入getData 则会从渲染元素上获取 fetchData方法作为 getData值
 * @wraning getData、fetchData 函数必须返回Promise。loading状态根据promise状态改变
 * @wraning 组件定义的 fetchData 会被Loading组件装饰，装饰后直接调用 fetchData 即可自动触发loading效果
 */
import Loading from './Loading.vue'

export default {
  components: {
    Loading
  },
  props: {
    tag: {
      type: [String, Object, Function],
      default: 'div'
    },
    getData: {
      type: [Function, Object],
      default: null
    },
    once: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openLoading: false,
      $lazy: false
    }
  },
  inject: {
    ajaxLoadingGroup: {
      default: {}
    }
  },
  mounted() {
    if (!this.getData && !this.ajaxLoadingGroup.getData) {
      if (!this.$slots.default) {
        return console.error(
          'ajax-loading组件必须传入getData函数，或者为其子组件设置 fetchData 方法'
        )
      }
      const vm = this.$slots.default.find(
        slot => slot.componentInstance?.fetchData && slot.componentInstance
      )
      if (!vm) {
        return console.error(
          'ajax-loading组件必须传入getData函数，或者为其子组件设置 fetchData 方法'
        )
      }
      // 原始fetchData
      const RawFetchData = (this.$_getData = vm.fetchData)
      // 装饰：调用时自动执行 this.$loadManage.exec
      vm.fetchData = function() {
        return this.$loadManage.exec(RawFetchData)
      }
      this.$lazy = true
    } else {
      this.$_getData = this.getData || this.ajaxLoadingGroup.getData
    }
    this.$loadManage.add(this.$_getData, this.$_ajaxLoading, this.once)
    if (!this.lazy && !this.$lazy) {
      this.$loadManage.exec(this.$_getData)
    }
  },
  beforeDestroy() {
    this.$loadManage.del(this.$_getData, this.$_ajaxLoading)
  },
  methods: {
    refresh(e) {
      if (
        e?.path
          ?.slice(0, 3)
          ?.find(el => el.classList.contains('el-loading-mask'))
      ) {
        this.$loadManage.exec(this.$_getData)
      }
    },
    $_ajaxLoading(status) {
      ;({
        open: () => {
          if (this.loadingInstance) {
            this.loadingInstance.close()
            this.loadingInstance = null
          }
          this.openLoading = true
        },
        close: () => {
          if (this.loadingInstance) {
            this.loadingInstance.close()
            this.loadingInstance = null
          }
          this.openLoading = false
        },
        error: () => {
          this.openLoading = false
          this.loadingInstance = this.$loading({
            target: this.$el,
            text: '加载失败，请刷新重试',
            spinner: 'el-icon-refresh-right'
          })
        }
      }[status]())
    }
  },
  render(c) {
    return c(
      this.tag,
      {
        props: {
          ...this.$attrs
        },
        [typeof this.tag === 'string' ? 'on' : 'nativeOn']: {
          click: this.refresh
        },
        class: 'ajax-loading-wrap',
        scopedSlots: {
          ...this.$scopedSlots
        }
      },
      [
        ...(this.$slots.default || []),
        this.openLoading ? c('Loading') : c(null)
      ]
    )
  }
}
</script>
<style lang="scss" scoped>
.ajax-loading-wrap {
  position: relative;
  height: 100%;
}
::v-deep .el-loading-spinner {
  cursor: pointer;
  font-size: 30px;
  .el-icon-loading {
    margin-bottom: 8px;
  }
}
</style>
