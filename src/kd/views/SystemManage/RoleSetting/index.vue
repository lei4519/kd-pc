<template>
  <div class="edit-wrapper">
    <SinglePageApp />
  </div>
</template>

<script>
import SinglePageApp from '@/pc/SinglePageApp.vue'
export default {
  name: 'RoleEdit',
  components: {
    SinglePageApp
  }
}
</script>

<style lang="scss" scoped>
.edit-wrapper {
  height: 100%
}
</style>
