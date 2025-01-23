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
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
    },
    optimizeDeps: {
      include: [
        'ant-design-vue',
        '@ant-design/icons-vue',
        'ant-design-vue/es/locale/zh_CN',
        // 预构建常用组件的样式
        'ant-design-vue/es/button/style/index',
        'ant-design-vue/es/spin/style/index',
        'ant-design-vue/es/checkbox/style/index',
        'ant-design-vue/es/radio/style/index',
        'ant-design-vue/es/tree/style/index',
        'ant-design-vue/es/table/style/index',
        'ant-design-vue/es/select/style/index',
        'ant-design-vue/es/input/style/index',
        'ant-design-vue/es/form/style/index',
        'ant-design-vue/es/modal/style/index',
        'ant-design-vue/es/message/style/index',
        'ant-design-vue/es/notification/style/index',
        'ant-design-vue/es/menu/style/index',
        'ant-design-vue/es/tabs/style/index',
        'ant-design-vue/es/dropdown/style/index',
        'ant-design-vue/es/drawer/style/index',
        'ant-design-vue/es/tooltip/style/index',
        'ant-design-vue/es/popover/style/index',
        'ant-design-vue/es/card/style/index',
        'ant-design-vue/es/pagination/style/index',
        'ant-design-vue/es/upload/style/index',
        'ant-design-vue/es/modal/style/index',
      ],
      exclude: [],
    },
    plugins: [
      viteInjectAppLoadingPlugin(env),
      VueDevtools(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'vue-router'],
        resolvers: [AntDesignVueResolver()],
        dts: './src/auto-import/auto-import.d.ts',
      }),
      Components({
        dirs: ['src/components'],
        deep: true,
        extensions: ['vue', 'js', 'jsx', 'ts', 'tsx'],
        include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
        exclude: [
          /[\\/]node_modules[\\/]/,
          /[\\/]\.git[\\/]/,
          /[\\/]\.nuxt[\\/]/,
          /SvgIcon(\/index)?\.vue$/,
        ],
        resolvers: [
          AntDesignVueResolver({
            importStyle: 'less',
            resolveIcons: true,
            cjs: false,
            exclude: ['style-provider', 'config-provider'],
          }),
        ],
        dts: './src/auto-import/components.d.ts',
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__',
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
      cssCodeSplit: true,
      chunkSizeWarningLimit: 2000,
    },
  }

  if (env.mode === 'build') {
    config.plugins.push(
      legacy({
        targets: ['Chrome 68'],
        modernPolyfills: true,
      })
    )
  }
  return config
}

export default defineConfig((env) => mergeConfig(defaultViteConfig(env), defineCustomConfig(env)))
