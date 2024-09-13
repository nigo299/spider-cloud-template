import Vue from 'vue'

// import routes from 'virtual:generated-pages'
// import VueRouter from 'vue-router'
import { PiniaVuePlugin, createPinia } from 'pinia'

import ElementUI from 'element-ui'
import '@/assets/styles/element/index.css'
import App from './App.vue'
import 'virtual:svg-icons-register'
import '@unocss/reset/tailwind-compat.css'
import '@/assets/styles/main.css'
import 'uno.css'

import router from './router'
import { SvgIconPlugin } from './components/SvgIcon'
// export const router = new VueRouter({
//   mode: 'history',
//   base: import.meta.env.BASE_URL,
//   routes,
// })

Vue.config.productionTip = false
Vue.use(PiniaVuePlugin)
Vue.use(SvgIconPlugin)
Vue.use(ElementUI)

const pinia = createPinia()

new Vue({
  router,
  pinia,
  render: h => h(App),
}).$mount('#app')
