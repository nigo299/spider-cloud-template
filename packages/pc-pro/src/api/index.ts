import type { Api } from './types'
import { permissionApi } from './permission'
import { userApi } from './user'

// 导出所有API模块
export { permissionApi, userApi }

/**
 * 合并所有API模块为一个对象
 * 注意: 该对象仅作为兼容旧代码使用，新代码应直接使用分模块API
 * @deprecated 使用分模块API代替
 */
const api: Api = {
  // 用户API
  getUser: userApi.getUserInfo,
  refreshToken: userApi.refreshToken,
  logout: userApi.logout,
  // 权限API
  getRolePermissions: permissionApi.getRolePermissions,
  validateMenuPath: permissionApi.validateMenuPath,
}

// 默认导出合并后的API对象（保持向后兼容）
export default api
