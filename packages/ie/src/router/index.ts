import Vue from 'vue'
import Router from 'vue-router'

// 注册 Vue Router 插件
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
  ],
})
export default router
