import { request } from '@/utils'
import axios from 'axios'

export default {
  getMenuTree: () => request.get('/permission/menu/tree'),
  getButtons: ({ parentId }: { parentId: string }) => request.get(`/permission/button/${parentId}`),
  getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
  addPermission: (data: any) => request.post('/permission', data),
  savePermission: (id: string, data: any) => request.patch(`/permission/${id}`, data),
  deletePermission: (id: string) => request.delete(`permission/${id}`),
}
