<template>
  <div class="single-page-app" ref="rootEl">
    <AjaxLoading :getData="getPage" once>
      <div class="single-main-wrap" v-if="page">
        <div
          class="layout-row"
          v-for="row in page.rows"
          :key="row.id"
          :style="row.getStyle()"
        >
          <div
            class="layout-col transition"
            v-for="el in row.elements"
            :key="el.id"
            :style="el.getStyle()"
          >
            <AjaxLoading>
              <component :is="getComponent(el)" v-bind="el.props" />
            </AjaxLoading>
          </div>
        </div>
      </div>
    </AjaxLoading>
  </div>
</template>

<script>
import { Project } from '@/kd/modules/Project'
import Vue from 'vue'
const theme = Vue.observable({
  color: '409EFF'
})
export default {
  data() {
    return {
      project: null,
      page: null
    }
  },
  provide() {
    return {
      theme
    }
  },
  watch: {
    project: {
      handler(project) {
        theme.color = project.themeColor
      }
    }
  },
  methods: {
    getPage() {
      return new Promise(r => {
        setTimeout(() => {
          const projectConfig = JSON.parse(sessionStorage.getItem('project'))
          if (projectConfig) {
            projectConfig.themeEl = this.$refs.rootEl
            const project = new Project(projectConfig)
            const {
              menu: [
                {
                  children: [page]
                }
              ]
            } = project
            this.project = project
            this.page = page
          }
          r()
        }, 500)
      })
    },
    getComponent({ path }) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('@/pc/components/' + path).default
    }
  }
}
</script>

<style lang="scss" scoped>
.single-page-app {
  position: relative;
  min-height: 100%;
  background-color: $mainBgColor;
  padding: 24px;
}
</style>
