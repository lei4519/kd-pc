// @ts-nocheck

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/kd/style/index.scss'
import Plugins from './plugins'
import Loading from '@/kd/components/Loading/index.vue'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Plugins)

export const PreviewSP = {
  components: {
    Loading
  },
  data() {
    return {
      page: null
    }
  },
  render: h => h('div', [
    this.page ? h('div') : h('Loading')
  ]),
  methods: {}
}

new Vue({
  render: h => h(PreviewSP)
}).$mount('#app')
