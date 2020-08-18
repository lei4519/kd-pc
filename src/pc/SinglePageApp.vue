<template>
  <div class="single-page-app">
    <Loading v-if="!page" />
    <div class="single-main-wrap" v-else>
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
          <component :is="getComponent(el)" v-bind="el.props" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/kd/components/Loading/index.vue'
import { Page } from '@/kd/modules/Page'
export default {
  components: {
    Loading
  },
  data() {
    return {
      page: null
    }
  },
  created() {
    this.getPage()
  },
  methods: {
    async getPage() {
      return new Promise(r => {
        setTimeout(() => {
          const pageConfig = JSON.parse(localStorage.getItem('page'))
          this.page = pageConfig ? new Page(pageConfig) : null
          r()
        }, 1000)
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
