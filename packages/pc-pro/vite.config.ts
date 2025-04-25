import type { UserConfig } from 'vite'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import {
  NaiveUiResolver,
  VueUseComponentsResolver,
  VueUseDirectiveResolver,
} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import removeNoMatch from 'vite-plugin-router-warn'
import VueDevTools from 'vite-plugin-vue-devtools'
import { pluginIcons, pluginPagePathes } from './build/plugin-isme'

// 定义环境变量类型
interface ViteEnv {
  VITE_PUBLIC_PATH: string
  VITE_PROXY_TARGET: string
  [key: string]: string
}

export default defineConfig(({ mode }): UserConfig => {
  const viteEnv = loadEnv(mode, process.cwd()) as unknown as ViteEnv
  const { VITE_PUBLIC_PATH, VITE_PROXY_TARGET } = viteEnv

  return {
    base: VITE_PUBLIC_PATH || '/',
    plugins: [
      Vue(),
      VueJsx(),
      VueDevTools(),
      Unocss(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
            'axios': [
              ['default', 'axios'],
            ],
            'dayjs': [
              ['default', 'dayjs'],
            ],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/utils',
          'src/store/modules',
        ],
        vueTemplate: true,
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [
          NaiveUiResolver(),
          VueUseComponentsResolver(),
          VueUseDirectiveResolver(),
        ],
        dts: 'src/types/components.d.ts',
        dirs: [
          'src/components',
          'src/layouts',
          'src/views',
        ],
        extensions: ['vue', 'tsx'],
        deep: true,
        directoryAsNamespace: false,
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      }),
      // 自定义插件，用于生成页面文件的path，并添加到虚拟模块
      pluginPagePathes(),
      // 自定义插件，用于生成自定义icon，并添加到虚拟模块
      pluginIcons(),
      // 移除非必要的vue-router动态路由警告: No match found for location with path
      removeNoMatch(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '~': path.resolve(process.cwd()),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3200,
      open: false,
      proxy: {
        '/api': {
          target: VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
          secure: false,
          configure: (proxy, options) => {
            // 配置此项可在响应头中看到请求的真实地址
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target as string)?.href || ''
            })
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1024, // chunk 大小警告的限制（单位kb）
    },
  }
})
