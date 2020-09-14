import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/kd/style/index.scss'
import 'animate.css'
import Plugins from './plugins'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(Plugins)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
