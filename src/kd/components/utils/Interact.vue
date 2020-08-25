<script>
import interact from 'interactjs'
/**
 * @desc 封装 interactjs 拖拽库 （只封装了resize功能）
 * @info 官网 https://interactjs.io/
 */
export default {
  name: 'Interact',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    resize: {
      type: Boolean,
      default: true
    },
    edges: {
      type: Array,
      default() {
        return [
          /* 'top', 'bottom', 'right', 'left' */
        ]
      }
    },
    w: {
      type: [Number, String],
      default: 'auto'
    },
    h: {
      type: [Number, String],
      default: 'auto'
    },
    minWidth: {
      type: Number,
      default: 0
    },
    maxWidth: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 0
    }
  },
  computed: {
    width() {
      const w = parseFloat(this.w)
      return w ? w + 'px' : 'auto'
    },
    height() {
      const h = parseFloat(this.h)
      return h ? h + 'px' : 'auto'
    }
  },
  watch: {
    resize() {
      this.init()
    },
    edges() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.interact.unset()
  },
  methods: {
    init() {
      if (this.interact) {
        this.interact.unset()
      }
      // 组件 or HTML元素
      const el = this.$refs.vdr.$el ? this.$refs.vdr.$el : this.$refs.vdr
      this.interact = interact(el)
      if (this.resize) {
        let min = null
        let max = null
        if (this.maxWidth || this.maxHeight) {
          max = {}
          this.maxWidth && (max.width = this.maxWidth)
          this.maxHeight && (max.height = this.maxHeight)
        }
        if (this.minWidth || this.minHeight) {
          min = {}
          this.minWidth && (min.width = this.minWidth)
          this.minHeight && (min.height = this.minHeight)
        }
        this.interact
          .resizable({
            edges: this.edges.reduce((edges, item) => {
              edges[item] = `.handle-${item}`
              return edges
            }, {}),
            modifiers: [
              interact.modifiers.restrictSize({
                min,
                max
              })
            ]
          })
          .on('resizemove', event => {
            let { x, y } = event.target.dataset
            x = parseFloat(x) || 0
            y = parseFloat(y) || 0
            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${event.deltaRect.left}px, ${event.deltaRect.top}px)`
            })
            Object.assign(event.target.dataset, { x, y })
          })
          .on('resizeend', event => {
            this.$emit('resizeEnd', event.rect)
          })
      }
    }
  },
  render(c) {
    return c(
      this.tag,
      {
        class: 'vdr',
        ref: 'vdr',
        style: {
          width: this.width,
          height: this.height
        }
      },
      [
        ...this.edges.map(e =>
          c('div', {
            class: `handle handle-${e}`
          })
        ),
        this.$slots.default
      ]
    )
  }
}
</script>

<style lang="scss" scoped>
.vdr {
  position: relative;
  transition: outline $duration;
  outline: 2px solid transparent;
  overflow: hidden;
  cursor: auto !important;
  touch-action: none;
  user-select: none;
  &:hover {
    outline-color: $theme-color;
    .handle {
      opacity: 1;
    }
  }
  &.draggable {
    cursor: move;
  }
  .handle {
    position: absolute;
    z-index: 9999;
    border: 1px solid #70a0d1;
    opacity: 0;
  }
  .handle-top,
  .handle-bottom {
    width: 40px !important;
    height: 8px !important;
    left: calc(50% - #{20px}) !important;
    background-color: #457eff;
    cursor: ns-resize;
    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 12px;
      height: 2px;
      border-top: 1px solid #fff;
      border-bottom: 1px solid #fff;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .handle-top {
    top: 0 !important;
    border-radius: 0 0 2px 2px;
    &::after {
      bottom: 2px;
    }
  }
  .handle-bottom {
    bottom: 0 !important;
    border-radius: 2px 2px 0 0;
    &::after {
      top: 2px;
    }
  }
  .handle-left,
  .handle-right {
    height: 40px !important;
    width: 8px !important;
    top: calc(50% - #{20px}) !important;
    background-color: #457eff;
    cursor: ew-resize;
    &::after {
      content: '';
      position: absolute;
      height: 12px;
      width: 2px;
      border-left: 1px solid #fff;
      border-right: 1px solid #fff;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .handle-left {
    left: 0 !important;
    border-radius: 0 2px 2px 0;
    &::after {
      right: 2px;
    }
  }
  .handle-right {
    right: 0 !important;
    border-radius: 2px 0 0 2px;
    &::after {
      left: 2px;
    }
  }
  $border-width: 5px;
  $x: 8px;
  $y: -3px;
  .handle-tl,
  .handle-tr,
  .handle-bl,
  .handle-br {
    border-radius: 5px;
    box-shadow: none;
    width: 18px !important;
    height: 18px !important;
    border: none;
    border-bottom: $border-width solid #457eff;
    border-right: $border-width solid #457eff;
    background-color: transparent;
    &::after {
      content: '';
      position: absolute;
      width: 1px;
      height: 8px;
      background-color: #fff;
      top: $x;
      right: $y;
    }
    &::before {
      content: '';
      position: absolute;
      height: 1px;
      width: 8px;
      background-color: #fff;
      left: $x;
      bottom: $y;
    }
  }
  .handle-tl {
    top: 0 !important;
    left: 0 !important;
    transform: rotate(180deg);
  }
  .handle-tr {
    top: 0 !important;
    right: 0 !important;
    transform: rotate(270deg);
  }
  .handle-bl {
    bottom: 0 !important;
    left: 0 !important;
    transform: rotate(90deg);
  }
  .handle-br {
    bottom: 0 !important;
    right: 0 !important;
  }
}
</style>
