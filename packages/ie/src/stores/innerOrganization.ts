import { Message } from 'element-ui'
import { defineStore } from 'pinia'
import { to } from '@/utils/index'

import {
  postOrganizationTableListInDepartment,
  postOrganizationTreeListOldSync,
} from '@/api/system/organization'
import type {
  IOrgTableType,
  IRoleList,
  ISyncTreeList,
  ITableList,
} from '@/interface/system/organization'

interface iOrgTableList {
  orgTableList: ITableList[]
  total: number
  loading: boolean
  roleList: IRoleList[]
  orgTreeList: ISyncTreeList[]
  orgId: string
}

export const useOrgTableStore = defineStore('orgTable', {
  state: (): iOrgTableList => ({
    orgTableList: [],
    total: 0,
    loading: false,
    roleList: [],
    orgTreeList: [],
    orgId: '',
  }),
  actions: {
    async getTableListAction(params: IOrgTableType) {
      this.loading = true
      const [res, err] = await to(postOrganizationTableListInDepartment(params))

      if (!err) {
        this.total = res.total
        this.orgTableList = res.list
        this.loading = false
      }
      else {
        Message.error(err.message ?? '请求失败')
        this.loading = false // Make sure loading is set to false even if there's an error
      }
    },
    async getRoleAndOrgTreeListAction() {
      // 组织列表
      const [orgTreeRes, orgTreeErr] = await to(
        postOrganizationTreeListOldSync({
          orgType: 0,
        }),
      )
      if (!orgTreeErr) {
        this.orgTreeList = orgTreeRes
      }
      else {
        Message.error(orgTreeErr.message ?? '组织树列表获取失败')
      }
    },
    setOrgIdAction(id: string) {
      this.orgId = id
    },
    clearOrgTableList() {
      this.total = 0
      this.orgTableList = []
      this.loading = false
    },
  },
})
