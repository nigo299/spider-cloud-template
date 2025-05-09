import type { Plugin } from 'vite'
import { getPagePathes } from '..'

const PLUGIN_PAGE_PATHES_ID = 'isme:page-pathes'

export function pluginPagePathes(): Plugin {
  return {
    name: 'isme:page-pathes',
    resolveId(id: string) {
      if (id === PLUGIN_PAGE_PATHES_ID)
        return `\0${PLUGIN_PAGE_PATHES_ID}`
      return null
    },
    load(id: string) {
      if (id === `\0${PLUGIN_PAGE_PATHES_ID}`) {
        return `export default ${JSON.stringify(getPagePathes())}`
      }
      return null
    },
  }
}
