import { request } from '@/utils'

export default {
  create: (data: any) => request.post('/user', data),
  read: (params = {}) => request.get('/user', { params }),
  update: (data: any) => request.patch(`/user/${data.id}`, data),
  delete: (id: any) => request.delete(`/user/${id}`),
  resetPwd: (id: any, data: any) => request.patch(`/user/password/reset/${id}`, data),

  getAllRoles: () => request.get('/role?enable=1'),
}
