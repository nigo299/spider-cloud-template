// src/components/SvgIcon/index.ts

import type { App } from 'vue'

import SvgIcon from './SvgIcon.vue'

/**
 * 让 SvgIcon 具有类型提示
 */
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}

const SvgIconPlugin = (app: App) => {
  SvgIcon.name && app.component(SvgIcon.name, SvgIcon)
}

export { SvgIcon, SvgIconPlugin }
