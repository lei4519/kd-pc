import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/kd/style/index.scss'
import Plugins from '@/kd/plugins'
import SinglePageApp from './SinglePageApp.vue'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Plugins)

new Vue({
  store,
  render: h => h(SinglePageApp)
}).$mount('#app')
