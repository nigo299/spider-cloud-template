import { useAuthStore } from '@/store'

let isConfirming = false

/**
 * 根据错误代码处理对应的操作
 * @param code 错误代码
 * @param message 错误信息
 * @param needTip 是否需要提示
 * @returns 处理后的错误信息或false
 */
export function resolveResError(code: number | string, message: string, needTip = true): string | false {
  switch (code) {
    case 401:
      if (isConfirming || !needTip)
        return false
      isConfirming = true
      window.$dialog?.confirm({
        title: '提示',
        type: 'info',
        content: '登录已过期，是否重新登录？',
        confirm() {
          useAuthStore().logout()
          window.$message?.success('已退出登录')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    case 11007:
    case 11008:
      if (isConfirming || !needTip)
        return false
      isConfirming = true
      window.$dialog?.confirm({
        title: '提示',
        type: 'info',
        content: `${message}，是否重新登录？`,
        confirm() {
          useAuthStore().logout()
          window.$message?.success('已退出登录')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    case 403:
      message = '请求被拒绝'
      break
    case 404:
      message = '请求资源或接口不存在'
      break
    case 500:
      message = '服务器发生异常'
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  needTip && window.$message?.error(message)
  return message
}
