import type { Permission } from '@/types/store'

export const defaultLayout: string = 'normal'

export const defaultPrimaryColor: string = '#00706b'

// 控制 LayoutSetting 组件是否可见
export const layoutSettingVisible = import.meta.env.PROD === false

interface ThemeOverrides {
  common: {
    primaryColor: string
    primaryColorHover: string
    primaryColorPressed: string
    primaryColorSuppl: string
  }
  DataTable?: {
    thColor?: string
    thTextColor?: string
    thFontWeight?: string
  }
}

export const naiveThemeOverrides: ThemeOverrides = {
  common: {
    primaryColor: '#00706b',
    primaryColorHover: '#008c86',
    primaryColorPressed: '#005451',
    primaryColorSuppl: '#00706b',
  },
  DataTable: {
    thColor: '#00706b',
    thTextColor: '#ffffff',
    thFontWeight: '500',
  },
}

// 基础权限
export const basePermissions: Permission[] = []
