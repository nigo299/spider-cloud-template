import { request } from '@/utils'

export default {
  create: (data: any) => request.post('/role', data),
  read: (params = {}) => request.get('/role/page', { params }),
  update: (data: any) => request.patch(`/role/${data.id}`, data),
  delete: (id: any) => request.delete(`/role/${id}`),

  getAllPermissionTree: () => request.get('/permission/tree'),
  getAllUsers: (params = {}) => request.get('/user', { params }),
  addRoleUsers: (roleId: any, data: any) => request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId: any, data: any) => request.patch(`/role/users/remove/${roleId}`, data),
}
