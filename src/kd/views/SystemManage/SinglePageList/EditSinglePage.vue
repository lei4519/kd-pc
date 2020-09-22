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
        const {
          data: { code, msg }
        } = await this.$ajax({
          url: '/api/quickbuild/edit',
          method: 'POST',
          urlSearchParams: {
            id: this.$route.query.id,
            data: JSON.stringify(data)
          }
        })
        if (code === 1) {
          this.$message.success('保存成功')
        } else if (msg) {
          this.$message(msg)
        }
      } catch {
        this.$message.error('保存失败，请重试')
        return Promise.reject('保存失败，请重试')
      }
    },
    async getProject() {
      try {
        const {
          data: { entry, code, msg }
        } = await this.$ajax({
          url: '/api/quickbuild/detail',
          method: 'POST',
          params: {
            id: this.$route.query.id
          }
        })
        if (code !== 1) {
          return this.$message.error(msg)
        }
        const { form_data } = entry
        const project = JSON.parse(form_data)
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
