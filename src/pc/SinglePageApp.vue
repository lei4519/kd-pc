<template>
  <div class="single-page-app">
    <AjaxLoading :getData="getPage" once>
      <div class="single-main-wrap" v-if="page">
        <div
          class="layout-row"
          v-for="row in page.rows"
          :key="row.id"
          :style="row.getStyle()"
        >
          <div
            class="layout-col"
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
import { Page } from '@/kd/modules/Page'
export default {
  data() {
    return {
      page: null
    }
  },
  methods: {
    getPage() {
      return new Promise(r => {
        setTimeout(() => {
          const pageConfig = JSON.parse(localStorage.getItem('page'))
          this.page = pageConfig ? new Page(pageConfig) : null
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
  height: 100%;
}
</style>
