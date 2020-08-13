<template>
  <div style="height: 100%">
    <EditPage :page="page" />
  </div>
</template>

<script>
import EditPage from '@/kd/components/EditLayout/EditPage.vue'
import { Page } from '../../modules/Page'
export default {
  name: 'EditSinglePage',
  components: {
    EditPage
  },
  data() {
    return {
      page: new Page({ name: '测试', show: true })
    }
  }
}
</script>
