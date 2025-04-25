import type { RolePermission, UserDetail } from '@/api/types'
import type { HttpResponse } from '@/types'
import type { Permission, UserInfo } from '@/types/store'
import api from '@/api'
import { basePermissions } from '@/settings'

export async function getUserInfo(): Promise<UserInfo> {
  const res = await api.getUser() as HttpResponse<UserDetail>
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

export async function getPermissions(): Promise<Permission[]> {
  let asyncPermissions: Permission[] = []
  try {
    const res = await api.getRolePermissions() as HttpResponse<RolePermission[]>
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}
