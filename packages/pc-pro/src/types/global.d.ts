declare global {
  interface Window {
    $message: {
      success: (message: string) => void
      error: (message: string) => void
      warning: (message: string) => void
      info: (message: string) => void
    }

    $dialog: {
      warning: (options: any) => {
        loading: boolean
      }
      info: (options: any) => {
        loading: boolean
      }
      success: (options: any) => {
        loading: boolean
      }
      error: (options: any) => {
        loading: boolean
      }
    }

    $loadingBar: {
      start: () => void
      finish: () => void
      error: () => void
    }
  }

  // 全局变量
  const $message: Window['$message']
  const $dialog: Window['$dialog']
  const $loadingBar: Window['$loadingBar']
}
