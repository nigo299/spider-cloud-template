import { defaultLayout, defaultPrimaryColor, naiveThemeOverrides } from '@/settings'
import { generate, getRgbStr } from '@arco-design/color'
import { useDark } from '@vueuse/core'
import { defineStore } from 'pinia'

interface AppState {
  collapsed: boolean
  isDark: ReturnType<typeof useDark>
  layout: string
  primaryColor: string
  naiveThemeOverrides: any
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    collapsed: false,
    isDark: useDark(),
    layout: defaultLayout,
    primaryColor: defaultPrimaryColor,
    naiveThemeOverrides,
  }),
  actions: {
    switchCollapsed(): void {
      this.collapsed = !this.collapsed
    },
    setCollapsed(b: boolean): void {
      this.collapsed = b
    },
    toggleDark(): void {
      this.isDark = !this.isDark
    },
    setLayout(v: string): void {
      this.layout = v
    },
    setPrimaryColor(color: string): void {
      this.primaryColor = color
    },
    setThemeColor(color: string = this.primaryColor, isDark: boolean = this.isDark): void {
      const colors = generate(color, {
        list: true,
        dark: isDark,
      })
      document.body.style.setProperty('--primary-color', getRgbStr(colors[5]))
      this.naiveThemeOverrides.common = Object.assign(this.naiveThemeOverrides.common || {}, {
        primaryColor: colors[5],
        primaryColorHover: colors[4],
        primaryColorSuppl: colors[4],
        primaryColorPressed: colors[6],
      })
    },
  },
  persist: {
    pick: ['collapsed', 'layout', 'primaryColor', 'naiveThemeOverrides'],
    storage: sessionStorage,
  },
})
