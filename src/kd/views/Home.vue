<template>
  <Layout :project="project" />
</template>

<script>
import Layout from '@/kd/components/EditLayout'
import Vue from 'vue'
const theme = Vue.observable({
  color: ''
})
export default {
  name: 'Home',
  components: {
    Layout
  },
  provide() {
    return {
      theme
    }
  },
  computed: {
    project() {
      return this.$store.state.project.project
    }
  },
  watch: {
    'project.themeColor': {
      handler(color) {
        theme.color = color
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-switch {
  position: absolute;
  top: 20px;
  right: 60px;
}
</style>
