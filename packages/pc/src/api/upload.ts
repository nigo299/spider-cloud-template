import type { CancelTokenSource } from 'axios'

import Api, { FileOSS } from './axios'

export interface IFileSign {
  code: number
  msg: string
  exception: any
  id: any
  viewPath: any
  sid: any
  exTime: number
  data: string
}
let FAIL_URL = '/file'
if (!window.location.href.includes('http'))
  FAIL_URL = `${window.sessionStorage.getItem('IgwPortURL') || ''}`

export const fileSign = (): Promise<IFileSign> => Api.get('/file-token/v1/get')

/** 获取下载地址 */
export function getUploadSrc(viewPath: string) {
  const http = `${window.location.origin}/cloud-document`
  const sign = sessionStorage.getItem('sign')
  const src = `${http}${viewPath}?token=${sign}`
  return src
}

export const upload = async <T = any>(data: File, source?: CancelTokenSource) => {
  const form = new FormData()
  form.append('file', data)
  form.append('token', sessionStorage.getItem('sign') || '')
  const res = await FileOSS.post('/file/ossUploadAndSync', form, {
    cancelToken: source?.token,
  })
  return res.data
}
