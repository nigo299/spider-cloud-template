/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
// 全局变量声明
interface Window {
  $loadingBar: import('naive-ui').LoadingBarApiInjection
  $notification: import('naive-ui').NotificationApiInjection
  $message: {
    loading: (content: string, option?: any) => void
    success: (content: string, option?: any) => void
    error: (content: string, option?: any) => void
    info: (content: string, option?: any) => void
    warning: (content: string, option?: any) => void
    destroy: (key: string, duration?: number) => void
  }
  $dialog: import('naive-ui').DialogApiInjection & {
    confirm: (option?: any) => any
  }
}
