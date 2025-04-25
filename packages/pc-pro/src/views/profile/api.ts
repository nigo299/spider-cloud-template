import { request } from '@/utils'

interface PasswordForm {
  oldPassword: string
  newPassword: string
}

interface ProfileForm {
  id: string | number
  nickName?: string
  gender?: number
  address?: string
  email?: string
  avatar?: string
}

export default {
  changePassword: (data: PasswordForm) => request.post('/auth/password', data),
  updateProfile: (data: ProfileForm) => request.patch(`/user/profile/${data.id}`, data),
}
