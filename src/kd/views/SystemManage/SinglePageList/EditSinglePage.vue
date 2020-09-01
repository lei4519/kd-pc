<template>
  <div style="height: 100%">
    <EditPage
      v-if="project"
      :visible.sync="visiblePage"
      :undoRedoHistory="undoRedoHistory"
      :project="project"
    />
  </div>
</template>

<script>
import EditPage from '@/kd/components/EditPage/index.vue'
import UndoRedoHistory from '@/kd/modules/History'
import { debounce } from 'lodash'
import { Project } from '@/kd/modules/Project'
export default {
  name: 'EditSinglePage',
  components: {
    EditPage
  },
  data() {
    return {
      project: null,
      visiblePage: true,
      undoRedoHistory: new UndoRedoHistory()
    }
  },
  watch: {
    project: {
      handler: debounce(function(project) {
        if (this.replaceFlag) {
          this.$nextTick(() => {
            this.replaceFlag = false
          })
          return
        }
        this.undoRedoHistory.addState(project)
      }),
      immediate: true,
      deep: true
    }
  },
  created() {
    const projectConfig = JSON.parse(sessionStorage.getItem('project')) || {
      menu: [
        {
          type: 'menu',
          children: [
            {
              type: 'page'
            }
          ]
        }
      ]
    }
    this.project = new Project(projectConfig)
    this.undoRedoHistory.on(this.replaceState)
  },
  mounted() {
    setTimeout(() => {
      this.project.updateTheme(document.getElementById('_EditPageWrapper'))
    })
  },
  methods: {
    replaceState(project) {
      this.replaceFlag = true
      this.project = project
    }
  }
}
</script>
