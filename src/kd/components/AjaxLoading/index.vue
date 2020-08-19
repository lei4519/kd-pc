<script>
/* eslint-disable @typescript-eslint/camelcase */
import Loading from './Loading.vue'

/**
 * @description 发起请求时为组件加入loading效果
 *
 * @wraning 如果不传入getData 并且也没有使用AjaxLoadingGroup组件传入getData 则会从渲染元素上获取 fetchData方法作为 getData值
 * @wraning getData、fetchData 函数必须返回Promise。loading状态根据promise状态改变
 * @wraning 组件定义的 fetchData 会被Loading组件装饰，装饰后直接调用 fetchData 即可自动触发loading效果
 *
 * @param tag 渲染标签名称 也可传入组件对象进行渲染
 * @param getData 请求方法
 * @param once getData 只控制loading状态一次，请求成功后解除其与loading态的关联性
 * @param lazy 默认在 mounted 时机进行初始化请求，如果需要改为手动控制请求时机，可以通过此属性控制
 */
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
      loadingStatus: 'close'
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
        slot => slot.componentInstance?.fetchData
      )?.componentInstance
      if (!vm) {
        return
        // return console.error(
        //   'ajax-loading组件必须传入getData函数，或者为其子组件设置 fetchData 方法'
        // )
      }
      // 原始fetchData
      const rawFetchData = (this.$_getData = vm.fetchData)
      // 装饰：调用时自动执行 this.$loadManage.exec
      vm.fetchData = function() {
        return this.$loadManage.exec(rawFetchData)
      }
    } else {
      this.$_getData = this.getData || this.ajaxLoadingGroup.getData
    }
    this.$loadManage.addEffect(this.$_getData, this.$_execEffect, this.once)
    if (!this.lazy) {
      this.$loadManage.exec(this.$_getData)
    }
  },
  beforeDestroy() {
    this.$loadManage.delEffect(this.$_getData, this.$_execEffect)
  },
  methods: {
    refresh(e) {
      e.stopPropagation()
      this.$loadManage.exec(this.$_getData)
    },
    $_execEffect(status) {
      this.loadingStatus = status
    }
  },
  render(c) {
    return c(
      this.tag,
      {
        props: {
          ...this.$attrs
        },
        class: 'ajax-loading',
        scopedSlots: {
          ...this.$scopedSlots
        }
      },
      [
        ...(this.$slots.default || []),
        c(
          'transition',
          {
            props: {
              'enter-active-class': 'animate__animated animate__fadeIn',
              'leave-active-class': 'animate__animated animate__fadeOut'
            }
          },
          [
            this.loadingStatus === 'open'
              ? c('Loading')
              : this.loadingStatus === 'error'
              ? c('div', { class: 'ajax-loading__error' }, [
                  c('span', {
                    class: 'el-icon-refresh',
                    on: {
                      click: this.refresh
                    }
                  })
                ])
              : c(null)
          ]
        )
      ]
    )
  }
}
</script>
<style lang="scss" scoped>
.ajax-loading,
.transition {
  position: relative;
  height: 100%;
}
.ajax-loading__error {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  background-color: hsla(0, 0%, 100%, 0.9);
  .el-icon-refresh {
    font-size: 50px;
    color: #409eff;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.1) rotate(180deg);
    }
    &:active {
      transform: scale(0.9) rotate(180deg);
    }
  }
}
</style>
