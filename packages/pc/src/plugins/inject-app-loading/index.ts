import fsp from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnv } from 'vite'
import type { ConfigEnv, PluginOption } from 'vite'

/**
 * PC端项目的加载动画插件
 */
export async function viteInjectAppLoadingPlugin(env: ConfigEnv): Promise<PluginOption | undefined> {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  let loadingHtml = await fsp.readFile(join(__dirname, './default-loading.html'), 'utf8')

  // 加载环境变量
  // eslint-disable-next-line node/prefer-global/process
  const viteEnv = loadEnv(env.mode, process.cwd())

  return {
    enforce: 'pre',
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        // 替换title
        const title = viteEnv.VITE_APP_TITLE || 'Spider Design'
        loadingHtml = loadingHtml.replace('>Spider Design<', `>${title}<`)
        return html.replace(/<body\s*>/, `<body>${loadingHtml}`)
      },
      order: 'pre',
    },
  }
}
