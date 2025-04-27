import type { AppRouteRecordRaw } from './types'

/**
 * 静态路由
 */
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页',
      layout: 'empty',
      hidden: true,
    },
  },
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '页面飞走了',
      layout: 'empty',
      hidden: true,
    },
  },
  {
    name: '403',
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      title: '没有权限',
      layout: 'empty',
      hidden: true,
    },
  },
]

/**
 * 异步路由 - 需要根据权限动态加载
 */
export const asyncRoutes: AppRouteRecordRaw[] = [
  {
    name: 'Base',
    path: '/base',
    meta: {
      title: '基础功能',
      icon: 'i-fe:grid',
    },
    children: [
      {
        name: 'BaseComponents',
        path: 'base-components',
        component: () => import('@/views/base/index.vue'),
        meta: {
          title: '基础组件',
          icon: 'i-me:awesome',
          keepAlive: false,
        },
      },
      {
        name: 'Unocss',
        path: 'unocss',
        component: () => import('@/views/base/unocss.vue'),
        meta: {
          title: 'Unocss',
          icon: 'i-me:awesome',
          keepAlive: false,
        },
      },
      {
        name: 'KeepAlive',
        path: 'keep-alive',
        component: () => import('@/views/base/keep-alive.vue'),
        meta: {
          title: 'KeepAlive',
          icon: 'i-me:awesome',
          keepAlive: true,
        },
      },
      {
        name: 'Icon',
        path: 'icon',
        component: () => import('@/views/base/unocss-icon.vue'),
        meta: {
          title: '图标 Icon',
          icon: 'i-me:awesome',
          keepAlive: false,
        },
      },
      {
        name: 'Memodal',
        path: 'test-modal',
        component: () => import('@/views/base/test-modal.vue'),
        meta: {
          title: 'Memodal',
          icon: 'i-me:awesome',
          keepAlive: false,
        },
      },
    ],
  },
  {
    name: 'Demo',
    path: '/demo',
    meta: {
      title: '示例页面',
      icon: 'i-fe:settings',
    },
    children: [
      {
        name: 'Upload',
        path: 'upload',
        component: () => import('@/views/demo/upload/index.vue'),
        meta: {
          title: '上传演示',
          icon: 'i-fe:upload',
          keepAlive: false,
        },
      },
      {
        name: 'CrudDemo',
        path: 'crud',
        component: () => import('@/views/demo/crud/index.vue'),
        meta: {
          title: 'CRUD 示例',
          icon: 'i-fe:database',
          keepAlive: false,
        },
      },
    ],
  },
  {
    name: 'PMS',
    path: '/pms',
    meta: {
      title: '系统管理',
      icon: 'i-fe:settings',
    },
    children: [
      {
        name: 'UserManage',
        path: 'user',
        component: () => import('@/views/pms/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'i-fe:users',
          keepAlive: false,
        },
      },
      {
        name: 'RoleManage',
        path: 'role',
        component: () => import('@/views/pms/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'i-fe:user-check',
          keepAlive: false,
        },
      },
      {
        name: 'ResourceManage',
        path: 'resource',
        component: () => import('@/views/pms/resource/index.vue'),
        meta: {
          title: '资源管理',
          icon: 'i-fe:database',
          keepAlive: false,
        },
      },
    ],
  },
  {
    name: 'ExternalLink',
    path: '/external-link',
    meta: {
      title: '外链',
      icon: 'i-fe:link',
    },
    children: [
      {
        name: 'Naive UI',
        path: 'https://www.naiveui.com/zh-CN/os-theme',
        meta: {
          title: '文档 - Naive UI',
          icon: 'i-me:naiveui',
        },
      },
    ],
  },
  // 404 必须放在最后
  {
    name: 'Iframe',
    path: '/iframe',
    component: () => import('@/views/iframe/index.vue'),
    meta: {
      title: 'iframe',
      hidden: true,
    },
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '页面不存在',
      layout: 'empty',
      hidden: true,
    },
  },
]
