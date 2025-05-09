import type { UserDetail } from '@/api/types'
import type { HttpResponse } from '@/types'
import type { UserInfo } from '@/types/store'
import api from '@/api'

export async function getUserInfo(): Promise<UserInfo> {
  const res = (await api.getUser()) as HttpResponse<UserDetail>
  const { id, username, profile, roles, currentRole } = res.data || {}
  return {
    id,
    username,
    avatar: profile?.avatar,
    nickName: profile?.nickName || '',
    gender: profile?.gender,
    address: profile?.address,
    email: profile?.email,
    roles,
    currentRole,
  }
}
