import type { Plugin } from 'vite'
import { getIcons } from '..'

const PLUGIN_ICONS_ID = 'isme:icons'

export function pluginIcons(): Plugin {
  return {
    name: 'isme:icons',
    resolveId(id: string) {
      if (id === PLUGIN_ICONS_ID)
        return `\0${PLUGIN_ICONS_ID}`
      return null
    },
    load(id: string) {
      if (id === `\0${PLUGIN_ICONS_ID}`) {
        return `export default ${JSON.stringify(getIcons())}`
      }
      return null
    },
  }
}
