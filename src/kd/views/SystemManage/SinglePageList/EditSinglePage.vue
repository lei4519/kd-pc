<template>
  <div style="height: 100%">
    <EditPage
      v-if="page"
      :visible.sync="visiblePage"
      :undoRedoHistory="undoRedoHistory"
      :page="page"
    />
  </div>
</template>

<script>
import EditPage from '@/kd/components/EditPage/index.vue'
import { Page } from '@/kd/modules/Page'
import UndoRedoHistory from '@/kd/modules/History'
import { debounce } from 'lodash'
export default {
  name: 'EditSinglePage',
  components: {
    EditPage
  },
  data() {
    return {
      page: new Page(
        JSON.parse(localStorage.getItem('page')) || {
          name: '测试',
          show: true
        }
      ),
      visiblePage: true,
      undoRedoHistory: new UndoRedoHistory()
    }
  },
  watch: {
    page: {
      handler: debounce(function(page) {
        if (this.replaceFlag) {
          this.$nextTick(() => {
            this.replaceFlag = false
          })
          return
        }
        this.undoRedoHistory.addState(page)
      }),
      immediate: true,
      deep: true
    }
  },
  created() {
    this.undoRedoHistory.on(this.replaceState)
  },
  methods: {
    replaceState(page) {
      this.replaceFlag = true
      this.page = page
    }
  }
}
</script>
