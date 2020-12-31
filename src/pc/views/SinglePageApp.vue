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
            <AjaxLoading
              lazy
              :class="{ 'component-decoration': el.needParentStyle }"
            >
              <component
                ref="componentVm"
                v-on="{
                  ...(rowIndex === 0 && el.name === 'Form'
                    ? {
                        'on-search': onSearch
                      }
                    : {})
                }"
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
import { isEmpty } from '@/kd/utils'
const theme = Vue.observable({
  color: '409EFF'
})
import { getProject } from '@/pc/api/project'
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
  mounted() {
    this.getPage()
    setTimeout(() => {
      const componentVm = this.$refs.componentVm
      if (componentVm?.[0]?.vm?.$options?.name === 'Form') {
        this.onSearch(componentVm[0].searchModel || {}, true)
      } else {
        this.onSearch({}, true)
      }
    }, 400)
  },
  methods: {
    onSearch(searchModel, init) {
      this.$refs.componentVm.forEach(vm => {
        if (vm.fetchData) {
          if (init) {
            vm.fetchData(searchModel)
          } else {
            if (vm.$attrs.inheritPageSearch === false) return
            vm.fetchData(searchModel)
          }
        }
      })
    },
    async getPage() {
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
      } catch {
        this.$message.error('获取页面信息失败，请稍后重试')
      }
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
