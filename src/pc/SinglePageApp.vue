<template>
  <div class="single-page-app" ref="rootEl">
    <AjaxLoading :getData="getPage" once>
      <div class="single-main-wrap" v-if="page">
        <div
          class="layout-row"
          v-for="(row, rowIndex) in page.rows"
          :key="row.id"
          :style="row.getStyle()"
        >
          <div
            class="layout-col transition"
            v-for="(el, colIndex) in row.elements"
            :key="el.id"
            :style="el.getStyle()"
          >
            <AjaxLoading :class="{ decoration: el.needParentStyle }">
              <component
                :is="getComponent(el)"
                v-bind="el.props"
                :layouts="page.getLayout(rowIndex, colIndex)"
              />
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
  .decoration {
    border: 2px solid transparent;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    transition: all $duration;
    &:hover {
      border-color: $theme-color;
    }
  }
}
</style>
