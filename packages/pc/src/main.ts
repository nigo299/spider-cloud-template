import { message } from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import './app.css'

import App from './App.vue'
import { SvgIconPlugin } from './plugins/svg-icon'
import router from './router'

import './assets/styles/main.css'
import 'vue-cropper/dist/index.css'
import './utils/permission'
import permissionDirective from '@/directives/permission'
import { getToken } from '@/api/login'

const app = createApp(App)

message.config({
  duration: 2,
  maxCount: 1,
})

async function init() {
  app.use(createPinia())
  app.use(router)
  app.use(SvgIconPlugin)
  app.mount('#app')
  permissionDirective(app)
}

if (import.meta.env.MODE === 'build') {
  getToken()
    .then(async (res) => {
      sessionStorage.setItem(import.meta.env.VITE_TOKEN, res.token)
      init()
    })
    .catch(() => {
      init()
    })
} else {
  init()
}

// 监听应用加载完成
const appLoading = document.getElementById('__app-loading__')
if (appLoading) {
  appLoading.classList.add('hidden')
}
