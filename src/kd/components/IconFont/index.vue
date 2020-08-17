<template>
  <span :class="`iconfont ${type}`" :style="`font-size: ${size}px`"></span>
</template>

<script>
/**
 * @desc 全局组件 - 字体图标
 * @param type iconfont 类名
 * @param size 字体大小
 */
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
@import './font/iconfont.css';
</style>
