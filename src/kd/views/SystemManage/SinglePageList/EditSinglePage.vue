<template>
  <div style="height: 100%">
    <EditPage v-if="project" :visible.sync="visiblePage" :project="project" />
  </div>
</template>

<script>
import EditPage from '@/kd/components/EditPage/index.vue'
import { Project } from '@/kd/modules/Project'

export default {
  name: 'EditSinglePage',
  components: {
    EditPage
  },
  data() {
    return {
      visiblePage: true
    }
  },
  computed: {
    undoRedoHistory() {
      return this.$store.state.editor.undoRedoHistory
    },
    project() {
      return this.$store.state.editor.project
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
    this.$store.commit('editor/SET_PROJECT', new Project(projectConfig))
  },
  mounted() {
    setTimeout(() => {
      this.project.updateTheme(document.getElementById('_EditPageWrapper'))
    })
    this.undoRedoHistory.clear()
  }
}
</script>
