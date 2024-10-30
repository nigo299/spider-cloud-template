import path, { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// import { visualizer } from 'rollup-plugin-visualizer'
// import babel from '@rollup/plugin-babel'

// import Pages from 'vite-plugin-pages'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import transformerDirective from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssColorFunction from 'postcss-color-function'
import autoprefixer from 'autoprefixer'
import { ElementUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5555,
    proxy: {
      '/board': {
        target: 'http://192.168.0.10',
        changeOrigin: true,
      },
    },
  },
  base: './',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
      { // 解决element-ui table不显示的问题
        find: 'vue',
        replacement: 'vue/dist/vue.esm.js',
      },
    ],
  },
  plugins: [
    {
      presets: [['es2016', { modules: false }]],
    },
    vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    // Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
      dts: true,
      dirs: ['./src/composables'],
      vueTemplate: true,
      resolvers: [ElementUiResolver()],
    }),
    createSvgIconsPlugin({
      // 指定目录
      // eslint-disable-next-line node/prefer-global/process
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 使用svg图标的格式
      symbolId: 'icon-[dir]-[name]',
    }),
    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      resolvers: [
        ElementUiResolver({
          importStyle: false,
        }),
      ],
    }),

    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      transformers: [transformerVariantGroup(), transformerDirective()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#00706b',
          'success-color': '#5ec76f',
          'warning-color': '#efb33f',
          'border-radius-base': '4px',
          'error-color': '#ec655f',
          'border-color-base': '#9fd4c8',
        },
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        postcssCustomProperties(),
        postcssColorFunction(),
        autoprefixer(),
      ],
    },
  },
})
