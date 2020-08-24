<script>
/* eslint-disable @typescript-eslint/camelcase */
import Loading from './Loading.vue'

/**
 * @description 发起请求时为组件加入loading效果
 *
 * @wraning 如果不传入getData 并且也没有使用AjaxLoadingGroup组件传入getData 则会从渲染元素上获取 fetchData方法作为 getData值
 * @wraning getData、fetchData 函数必须返回Promise。loading状态根据promise状态改变
 * @wraning getData、fetchData 会被Loading组件装饰，装饰后直接调用 即可触发loading效果
 *
 * @property {} tag 渲染标签名称 也可传入组件对象进行渲染
 * @property {} getData 请求方法
 * @property {} once getData 只控制loading状态一次，请求成功后解除其与loading态的关联性
 * @property {} lazy 默认在 mounted 时机进行初始化请求，如果需要改为手动控制请求时机，可以通过此属性控制
 * @property {} mode loading状态： 骨架屏 或者 loading图。['skeleton', 'loading']
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
    },
    mode: {
      validator(value) {
        return ['skeleton', 'loading'].includes(value)
      },
      default: 'skeleton'
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
          '没有传入getData函数，ajax-loading子元素不能异步渲染'
        )
      }
      const vm = this.$slots.default.find(
        slot => slot.componentInstance?.fetchData
      )?.componentInstance
      if (!vm) {
        return
      }
      // 原始fetchData
      const rawFetchData = (this.$_getData = vm.fetchData)
      // 装饰：调用时自动执行 this.$loadManage.exec
      vm.fetchData = function() {
        return this.$loadManage.exec(rawFetchData)
      }
    } else {
      const rawFetchData = (this.$_getData =
        this.getData || this.ajaxLoadingGroup.getData)
      // 找到父组件装饰方法
      let p = this.$parent,
        methodName = ''
      while (p) {
        if (
          Object.keys(p.$options.methods).some(method => {
            if (p[method] === rawFetchData) {
              methodName = method
              return true
            }
          })
        ) {
          break
        }
        p = p.$parent
      }
      if (methodName) {
        p[methodName] = function() {
          return this.$loadManage.exec(rawFetchData)
        }
      }
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
      if (this.mode === 'skeleton') {
        if (status === 'open') {
          this.$el.querySelectorAll('.ajax-loading-skeleton').forEach(el => {
            el.classList.add('animated')
          })
        } else if (status === 'close') {
          this.$el.querySelectorAll('.ajax-loading-skeleton').forEach(el => {
            el.classList.remove('animated')
          })
        }
      }
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
              'enter-active-class':
                'animate__animated animate__fadeIn animate__faster',
              'leave-active-class':
                'animate__animated animate__fadeOut animate__faster'
            }
          },
          [
            this.loadingStatus === 'open' && this.mode === 'loading'
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
    color: $theme-color;
    cursor: pointer;
    transition: all $duration;
    &:hover {
      transform: scale(1.1) rotate(180deg);
    }
    &:active {
      transform: scale(0.9) rotate(180deg);
    }
  }
}
</style>

<style lang="scss">
.ajax-loading-skeleton {
  position: relative;
  &.animated {
    width: var(--skeleton-width);
    height: var(--skeleton-height);
    animation: skeleton-blink 1.5s ease-in-out infinite;
    &::after {
      display: block;
    }
  }
  &::after {
    content: '';
    display: none;
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
    z-index: 1;
    background-color: #f2f3f5;
  }
}
@keyframes skeleton-blink {
  50% {
    opacity: 0.6;
  }
}
</style>
