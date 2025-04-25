import type { HttpResponse } from '@/types'
import type { MenuValidation, RolePermission } from './types'
import { request } from '@/utils'

/**
 * 菜单创建参数
 */
export interface MenuCreateParams {
  name: string
  code: string
  path?: string
  component?: string
  redirect?: string
  icon?: string
  layout?: string
  parentId?: string
  order: number
  show: boolean
  keepAlive?: boolean
}

/**
 * 权限相关API
 */
export const permissionApi = {
  /**
   * 获取角色权限树
   */
  getRolePermissions(): Promise<HttpResponse<RolePermission[]>> {
    return request.get('/role/permissions/tree')
  },

  /**
   * 验证菜单路径是否有效
   * @param path 菜单路径
   */
  validateMenuPath(path: string): Promise<HttpResponse<MenuValidation>> {
    return request.get(`/permission/menu/validate?path=${path}`)
  },

  /**
   * 获取所有菜单
   */
  getAllMenus(): Promise<HttpResponse<RolePermission[]>> {
    return request.get('/permission/menu/list')
  },

  /**
   * 创建菜单
   * @param params 菜单参数
   */
  createMenu(params: MenuCreateParams): Promise<HttpResponse<RolePermission>> {
    return request.post('/permission/menu', params)
  },

  /**
   * 更新菜单
   * @param id 菜单ID
   * @param params 菜单参数
   */
  updateMenu(id: string, params: Partial<MenuCreateParams>): Promise<HttpResponse<RolePermission>> {
    return request.put(`/permission/menu/${id}`, params)
  },

  /**
   * 删除菜单
   * @param id 菜单ID
   */
  deleteMenu(id: string): Promise<HttpResponse<null>> {
    return request.delete(`/permission/menu/${id}`)
  },

  /**
   * 获取角色列表
   */
  getRoles(): Promise<HttpResponse<{ id: string, name: string, code: string }[]>> {
    return request.get('/role/list')
  },

  /**
   * 分配角色权限
   * @param roleId 角色ID
   * @param permissionIds 权限ID列表
   */
  assignRolePermissions(roleId: string, permissionIds: string[]): Promise<HttpResponse<null>> {
    return request.post(`/role/${roleId}/permissions`, { permissionIds })
  },
}
