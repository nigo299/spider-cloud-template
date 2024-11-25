import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import type { UserConfigFn } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, mergeConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueDevtools from 'vite-plugin-vue-devtools'
import { defaultViteConfig } from '../../scripts/vite'
import { viteInjectAppLoadingPlugin } from './src/plugins/inject-app-loading'

const defineCustomConfig: UserConfigFn = env => ({
  define: {
    __PRODUCTION__: JSON.stringify(env.mode === 'production'),
  },
  base: '',
  server: {
    proxy: {
      '/spider': {
        target: 'http://192.168.0.10',
        changeOrigin: true,
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
      // eslint-disable-next-line node/prefer-global/process
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
          'vue': ['vue', 'vue-router'],
          'lodash': ['lodash'],
          'dayjs': ['dayjs'],
          'ant-design-vue': ['ant-design-vue'],
        },
      },
    },
    minify: 'terser',
  },
})

export default defineConfig(env => mergeConfig(defaultViteConfig(env), defineCustomConfig(env)))
