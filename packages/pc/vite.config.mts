import type { UserConfigFn } from 'vite'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, mergeConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueDevtools from 'vite-plugin-vue-devtools'
import { defaultViteConfig } from '../../scripts/vite'
import { viteInjectAppLoadingPlugin } from './src/plugins/inject-app-loading'

const defineCustomConfig: UserConfigFn = (env) => {
  const config = {
    define: {
      __PRODUCTION__: JSON.stringify(env.mode === 'production'),
    },
    base: '',
    server: {
      proxy: {
        '/digital-workplace': {
          target: 'http://192.168.0.13',
          // target: 'http://192.168.0.90:19206',
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/digital-workplace/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      viteInjectAppLoadingPlugin(env),
      VueDevtools(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        eslintrc: {
          enabled: false,
          filepath: './auto-import/.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
        imports: [
          'vue',
          'vue-router',
          // {
          //   vuex: ['useStore'],
          // },
        ],
        resolvers: [AntDesignVueResolver()],
        dts: './src/auto-import/auto-import.d.ts',
      }),
      createSvgIconsPlugin({
        // 指定目录
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // 使用svg图标的格式
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__',
      }),
      Components({
        dirs: ['src/components'],
        // 搜索子目录
        deep: true,
        extensions: ['vue', 'js', 'jsx', 'ts', 'tsx'],
        include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
        dts: './src/auto-import/components.d.ts',
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
            lodash: ['lodash'],
            dayjs: ['dayjs'],
            'ant-design-vue': ['ant-design-vue'],
          },
        },
      },
      minify: 'terser',
    },
  }
  if (env.mode === 'build') {
    config.plugins.push(
      legacy({
        targets: ['Chrome 68'],
        modernPolyfills: true,
      }),
    )
  }
  return config
}

export default defineConfig((env) => mergeConfig(defaultViteConfig(env), defineCustomConfig(env)))
