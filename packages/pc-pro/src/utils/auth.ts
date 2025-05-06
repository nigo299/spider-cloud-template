import { logOut } from '@/api/login'
import { clearCookie } from '@/utils/format'
import { to } from '@/utils/to'

/**
 * 处理用户退出登录
 * @param showMessage 是否显示成功消息，默认为true
 * @returns Promise<boolean> 退出是否成功
 */
export async function handleLogout(showMessage = true): Promise<boolean> {
  const [, err] = await to(logOut())

  if (!err) {
    // 清除所有状态
    sessionStorage.clear()
    clearCookie()

    // 获取退出地址，优先使用环境变量中配置的地址
    const logoutRedirectUrl =
      import.meta.env.VITE_LOGOUT_REDIRECT_URL ||
      (import.meta.env.MODE === 'build'
        ? 'http://portalnew.cq.sgcc.com.cn/up/pweb/desktop/pweb/login/logout'
        : '/login')

    // 使用window.location.href确保完全刷新页面
    window.location.href = logoutRedirectUrl

    if (showMessage) {
      window.$message.success('已退出登录')
    }

    return true
  } else {
    window.$message.error(err.message)
    return false
  }
}
