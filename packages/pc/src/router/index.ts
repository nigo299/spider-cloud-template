import { type RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

export const routerList: RouteRecordRaw[] = [
  // 仪表盘
  {
    path: '/home',
    name: '仪表盘',
    meta: {
      icon: 'BankOutlined',
      permission: '',
    },
    children: [
      {
        path: 'index',
        name: '工作台',
        component: () => import('@/views/home/index.vue'),
        meta: {
          permission: '',
          isNative: true,
        },
      },
    ],
  },
  {
    path: '/system-settings',
    name: '系统设置',
    meta: {
      icon: 'SettingOutlined',
      permission: 'page_contact',
    },
    children: [
      {
        path: 'organization-management',
        name: '组织管理',
        component: () => import('@/views/systemSettings/organizationManagement/index.vue'),
        meta: {
          isNative: true,
          permission: 'menu_contact_department',
        },
      },
      {
        path: 'role-management',
        name: '角色管理',
        component: () => import('@/views/systemSettings/roleManagement/index.vue'),
        meta: {
          isNative: true,
          permission: 'menu_contact_role',
        },
      },
      {
        path: 'dictionary-management',
        name: '字典管理',
        component: () => import('@/views/systemSettings/dictionaryManage/index.vue'),
        meta: {
          isNative: true,
          permission: '',
        },
      },
      {
        path: 'dictionary-data',
        name: '字典数据',
        component: () => import('@/views/systemSettings/dictionaryManage/detail.vue'),
        meta: {
          isHide: true,
        },
      },
      {
        path: 'system-log',
        name: '系统日志',
        component: () => import('@/views/systemSettings/systemLog/index.vue'),
        meta: {
          isNative: true,
          permission: 'menu_contact_log',
        },
      },
      {
        path: 'menu-management',
        name: '菜单管理',
        component: () => import('@/views/systemSettings/menuManage/index.vue'),
        meta: {
          isNative: true,
          permission: '',
        },
      },
    ],
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home/index',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/layout',
      component: () => import('@/layout/index.vue'),
      name: 'Spider Design',
      meta: {
        isNative: true,
      },
      children: routerList,
    },
    {
      path: '/401',
      name: '401',
      component: () => import('@/views/commonError/401.vue'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/commonError/403.vue'),
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/commonError/404.vue'),
    },
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/commonError/500.vue'),
    },
    {
      path: '/502',
      name: '502',
      component: () => import('@/views/commonError/502.vue'),
    },
    {
      path: '/600',
      name: '600',
      component: () => import('@/views/commonError/600.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/commonError/404.vue'),
    },
  ],
})

export default router
