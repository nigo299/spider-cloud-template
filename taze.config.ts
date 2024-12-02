import { defineConfig } from 'taze'

export default defineConfig({
  packageMode: {
    // 常用工具库补丁更新
    'axios': 'patch',
    'lodash-es': 'patch',
    'dayjs': 'patch',

    // 类型定义更新
    '@types/*': 'minor',

    // UI 框架允许小版本更新
    'ant-design-vue': 'minor',
    'vant': 'minor',

    // 其他依赖
    '*': 'patch',
  },

  // 需要锁定版本的依赖添加到 exclude
  exclude: [
    // 核心框架相关
    'vue',
    'vite',
    '@vitejs/plugin-vue2',
    'element-ui',

    // 工具链相关
    'eslint',
    'prettier',
    'husky',
    'lint-staged',
    'commitizen',
  ],

  install: false,

  ignorePaths: [
    '**/node_modules/**',
    '**/dist/**',
    'patches/**',
  ],
})
