import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/kd/style/index.scss'
import Plugins from '@/kd/plugins'
import SinglePageApp from './SinglePageApp.vue'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Plugins)

new Vue({
  render: h => h(SinglePageApp)
}).$mount('#app')
