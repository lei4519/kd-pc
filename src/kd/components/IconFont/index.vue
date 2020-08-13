<template>
  <span :class="`iconfont icon-${type}`" :style="`font-size: ${size}px`"></span>
</template>

<script>
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
