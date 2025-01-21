import * as Icons from '@ant-design/icons-vue'
import Antd, { message } from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'uno.css'
import 'virtual:svg-icons-register'
import { getToken } from '@/api/login'
import permissionDirective from '@/directives/permission'

import App from './App.vue'
import { SvgIconPlugin } from './plugins/svg-icon'
import router from './router'

import 'uno.css'
import './assets/styles/main.css'
import 'vue-cropper/dist/index.css'
import './utils/permission'
import '@unocss/reset/tailwind-compat.css'

message.config({
  duration: 2,
  maxCount: 1,
})
const app = createApp(App)

async function init() {
  app.use(createPinia())
  app.use(Antd)
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

// Antd 注入全部图标
app.config.globalProperties.$icons = Icons
for (const key in Icons) app.component(key, Icons[key as keyof typeof Icons])
// 监听应用加载完成
const appLoading = document.getElementById('__app-loading__')

if (appLoading) {
  // 添加 hidden class 来隐藏 loading
  appLoading.classList.add('hidden')
}
