<template>
  <Layout :project="project" />
</template>

<script>
import Layout from '@/kd/components/EditLayout'
export default {
  name: 'Home',
  components: {
    Layout
  },
  data() {
    return {}
  },
  computed: {
    project() {
      return this.$store.state.project.project
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
