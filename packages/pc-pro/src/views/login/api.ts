import { request } from '@/utils/http'

export interface LoginParam {
  account: string
  password: string
  loginType: number
}

export function login(params: LoginParam) {
  return request.post('/auth/papi/common/token/v1/login', params)
}
