<template>
  <div style="height: 100%">
    <EditPage
      v-if="project"
      :visible.sync="visiblePage"
      :project="project"
      :saveProject="saveProject"
    />
  </div>
</template>

<script>
import EditPage from '@/kd/components/EditPage/index.vue'
import { Project } from '@/kd/modules/Project'
import { isEmpty } from '@/kd/utils'
import { getProject, saveProject } from '@/pc/api/project'

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
  mounted() {
    this.getProject()
  },
  methods: {
    async saveProject(data) {
      try {
        await saveProject(data)
        this.$message.success('保存成功')
      } catch {
        this.$message.error('保存失败，请重试')
        return Promise.reject('保存失败，请重试')
      }
    },
    async getProject() {
      try {
        const project = await getProject()
        const projectConfig = isEmpty(project)
          ? {
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
          : project
        this.$store.commit('editor/SET_PROJECT', new Project(projectConfig))
        this.undoRedoHistory.clear()
        setTimeout(() => {
          this.project.updateTheme(document.getElementById('_EditPageWrapper'))
        })
      } catch {
        this.$message.error('获取页面信息失败，请稍后重试')
      }
    }
  }
}
</script>
