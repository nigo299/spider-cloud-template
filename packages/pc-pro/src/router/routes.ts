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
          title: 'CRUD 表格',
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
      // {
      //   name: 'RoleManage',
      //   path: 'role',
      //   component: () => import('@/views/pms/role/index.vue'),
      //   meta: {
      //     title: '角色管理',
      //     icon: 'i-fe:user-check',
      //     keepAlive: false,
      //   },
      // },
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
      {
        name: 'OrganizationManage',
        path: 'organization',
        component: () => import('@/views/systemSettings/organizationManagement/index.vue'),
        meta: {
          title: '组织管理',
          icon: 'i-fe:database',
          keepAlive: false,
        },
      },
      {
        name: 'RoleManage',
        path: 'role',
        component: () => import('@/views/systemSettings/roleManagement/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'i-fe:database',
          keepAlive: false,
        },
      },
      {
        name: 'DictionaryManage',
        path: 'dictionary',
        component: () => import('@/views/systemSettings/dictionaryManage/index.vue'),
        meta: {
          title: '字典管理',
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
  {
    name: 'MultiLevel',
    path: '/multi-level',
    meta: {
      title: '多级菜单',
      icon: 'i-fe:list',
    },
    children: [
      {
        name: 'Level1A',
        path: 'level-1a',
        component: () => import('@/views/multi-level/level-1a/index.vue'),
        meta: {
          title: '菜单 1-A',
          icon: 'i-fe:folder',
          keepAlive: false,
        },
        children: [
          {
            name: 'Level1A1',
            path: 'level-1a-1',
            component: () => import('@/views/multi-level/level-1a/level-1a-1/index.vue'),
            meta: {
              title: '菜单 1-A-1',
              icon: 'i-fe:file',
              keepAlive: false,
            },
          },
          {
            name: 'Level1A2',
            path: 'level-1a-2',
            component: () => import('@/views/multi-level/level-1a/level-1a-2/index.vue'),
            meta: {
              title: '菜单 1-A-2',
              icon: 'i-fe:file',
              keepAlive: false,
            },
          },
        ],
      },
      {
        name: 'Level1B',
        path: 'level-1b',
        component: () => import('@/views/multi-level/level-1b/index.vue'),
        meta: {
          title: '菜单 1-B',
          icon: 'i-fe:folder',
          keepAlive: false,
        },
        children: [
          {
            name: 'Level1B1',
            path: 'level-1b-1',
            component: () => import('@/views/multi-level/level-1b/level-1b-1/index.vue'),
            meta: {
              title: '菜单 1-B-1（单个子菜单）',
              icon: 'i-fe:file',
              keepAlive: false,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Iframe',
    path: '/iframe',
    component: () => import('@/views/iframe/index.vue'),
    meta: {
      title: 'iframe',
      hidden: true,
    },
  },

  // 404 必须放在最后
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
