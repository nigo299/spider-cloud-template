import type { Plugin, UserConfigFn } from 'vite'

import path from 'node:path'
import transformerDirective from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import tsConfigPath from 'vite-tsconfig-paths'

export function splitChunk(options: {
  rules: Array<string | { regex: RegExp; to: string }>
}): Plugin {
  function matchRule(id: string): { matched: boolean; id?: string } {
    for (const rule of options.rules) {
      if (typeof rule === 'string') {
        if (id.includes(rule)) return { matched: true, id: rule }
      } else if (rule.regex.test(id)) {
        return { matched: true, id: rule.to }
      }
    }

    return { matched: false }
  }

  return {
    name: 'rollup-plugin-multiple-vendors',
    outputOptions(o) {
      o.manualChunks = (id: string) => {
        if (id.includes('?worker')) return path.basename(id.replace(/\?[\w-]+/, ''))

        if (id.includes('node_modules')) {
          const ret = matchRule(id)
          if (ret.matched) return ret.id ?? 'vendor'

          return 'vendor'
        }
      }
      return o
    },
  }
}

export const defaultViteConfig: UserConfigFn = () => ({
  plugins: [
    vue(),
    vueJsx(),
    tsConfigPath(),
    Unocss({
      mode: 'vue-scoped',
      transformers: [transformerVariantGroup(), transformerDirective()],
      hmrTopLevelAwait: false,
      inspector: false,
      safelist: [],
      preflights: [],
    }),
  ],
  base: './',
  server: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:8088',
    },
    hmr: {
      overlay: false,
    },
  },
  build: {
    reportCompressedSize: false,
  },
})
