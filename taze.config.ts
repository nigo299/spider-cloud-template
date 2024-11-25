import { defineConfig } from 'taze'

export default defineConfig({
  // 按包名配置不同更新策略
  packageMode: {
    // IE 项目相关依赖保守更新
    '@web/ie': {
      // 锁定核心依赖版本
      'vue': 'none',
      'vite': 'none',
      '@vitejs/plugin-legacy': 'none',
      '@vitejs/plugin-vue2': 'none',
      'element-ui': 'none',
      'echarts': 'none',

      // 运行时依赖仅允许补丁更新
      'axios': 'patch',
      'lodash-es': 'patch',
      'dayjs': 'patch',
      'pinia': 'patch',

      // 开发依赖允许小版本更新
      '@types/*': 'minor',
      'less': 'minor',
      'typescript': 'minor',
    },

    // PC 项目允许更激进的更新
    '@web/pc': {
      'ant-design-vue': 'minor',
      'vue': 'minor',
      'vite': 'minor',
      '*': 'latest',
    },

    // H5 项目
    '@web/h5': {
      'vant': 'minor',
      '*': 'latest',
    },

    // 移动端项目
    '@web/mobile': {
      'uni-*': 'minor',
      '*': 'latest',
    },
  },

  // 全局排除的依赖
  exclude: [
    // 工具链相关
    'eslint',
    'prettier',
    'husky',
    'lint-staged',
    'commitizen',
    'cz-customizable',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ],

  // 不自动安装更新
  install: false,

  // 忽略的路径
  ignorePaths: [
    '**/node_modules/**',
    '**/dist/**',
    'patches/**',
  ],
})
