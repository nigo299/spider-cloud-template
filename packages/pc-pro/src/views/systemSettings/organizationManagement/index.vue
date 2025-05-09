<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

import type { ITableList, ITreeAdd, ITreeEdit, ITreeSelect } from '@/interface/system/organization'
import { useOrgTableStore } from '@/store/modules/innerOrganization'

import Table from './components/table.vue'
import TableModal from './components/tableModal.vue'
import Tree from './components/tree.vue'
import TreeModal from './components/treeModal.vue'

const treeRef = ref<InstanceType<typeof Tree>>()
const tableRef = ref<InstanceType<typeof Table>>()
const treeModalRef = ref<InstanceType<typeof TreeModal>>()
const tableModalRef = ref<InstanceType<typeof TableModal>>()

// 打开新增弹窗-树形
function handleAddOrganizationEmit(addParams: ITreeAdd) {
  treeModalRef.value?.showModal(addParams)
}

// 打开编辑弹窗-树形
function handleEditOrganizationEmit(editParams: ITreeEdit) {
  treeModalRef.value?.showModal(editParams)
}

// 树形选择，获取表格
function handleOnSelectOrg(orgParams: ITreeSelect) {
  tableRef.value?.selectOrgGetTableList(orgParams)
}

// 刷新表格
function handleRefreshTable() {
  tableRef.value?.refresh()
}

// 打开弹窗-列表
function handleAddOrEditListEmit(isEdit = false, record?: ITableList) {
  tableModalRef.value?.showModal(isEdit, record)
}
onUnmounted(() => {
  const orgTableStore = useOrgTableStore()
  orgTableStore.clearOrgTableList()
})

function isBusinessRole() {
  const permissions = sessionStorage.getItem('permissions')
  return permissions?.includes('button_contact_department_get_user')
}
</script>

<template>
  <CommonPage>
    <div class="bg-white flex h-full rounded-lg shadow-md">
      <!-- 左侧：机构树 -->
      <div class="left min-w-3/12 max-w-3/12 px-5 py-6 bg-gray-50 dark:bg-dark-800 rounded-l-lg">
        <Tree
          ref="treeRef"
          :show-search="isBusinessRole()"
          @add-organization-emit="handleAddOrganizationEmit"
          @edit-organization-emit="handleEditOrganizationEmit"
          @on-select-org="handleOnSelectOrg"
        />
      </div>
      <!-- 右侧：表格 -->
      <div class="h-full flex-1 px-6 py-6 overflow-hidden">
        <Table ref="tableRef" @add-or-edit-list-emit="handleAddOrEditListEmit" />
      </div>
      <TreeModal ref="treeModalRef" />
      <TableModal ref="tableModalRef" @refresh-table="handleRefreshTable" />
    </div>
  </CommonPage>
</template>

<style scoped>
:deep(.n-button.n-button--primary-type) {
  background-color: #00706b;
}

:deep(.n-button.n-button--primary-type:hover),
:deep(.n-button.n-button--primary-type:focus) {
  background-color: #005a56;
}

:deep(.n-button.n-button--primary-type.n-button--ghost) {
  color: #00706b;
  border-color: #00706b;
}

:deep(.n-button.n-button--primary-type.n-button--ghost:hover),
:deep(.n-button.n-button--primary-type.n-button--ghost:focus) {
  color: #005a56;
  border-color: #005a56;
}

:deep(.n-tag.n-tag--success-type) {
  background-color: rgba(0, 112, 107, 0.1);
  color: #00706b;
  border-color: rgba(0, 112, 107, 0.3);
}
</style>
