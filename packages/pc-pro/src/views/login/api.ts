import { request } from '@/utils'

export default {
  toggleRole: (data: any) => request.post('/auth/role/toggle', data),
  login: (data: any) => request.post('/auth/login', data, { needToken: false }),
  getUser: () => request.get('/user/detail'),
}
