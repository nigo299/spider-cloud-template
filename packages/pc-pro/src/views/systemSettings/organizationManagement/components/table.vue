<script setup lang="ts">
import { useElementSize, useToggle } from '@vueuse/core'
import { to } from '@/utils/to'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref, h } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import type { DataTableColumn, PaginationProps, SelectOption } from 'naive-ui'
import { NTag, NTooltip } from 'naive-ui'

import {
  postBatchExportLock,
  postDeleteOrgMemberById,
  postDestroyUser,
  postOrgChangeStatus,
} from '@/api/system/organization'
import { customPaginationOptions, titleAndPaginationHeight } from '@/common/js/config'
import { withPermission } from '@/directives'
import deleteModal from './deleteModal.vue'
import secretKeyModal from './secretKey.vue'
import type { ITableList, ITreeSelect } from '@/interface/system/organization'
import type { TablePageChange } from '@/interface/system/roleManage'
import { useOrgTableStore } from '@/store/modules/innerOrganization'
import { download } from '@/utils/download'
import { phoneFormat } from '@/utils/format'
import { sm4Encrypt } from '@/utils/gmCrypto'

import InactiveUserList from './InactiveUserList/index.vue'
import detailDialog from './detailDialog.vue'
import RoleStatusModal from './roleStatusModal.vue'

const emits = defineEmits(['addOrEditListEmit', 'editListEmit'])
const orgTableStore = useOrgTableStore()
const { orgTableList, loading, total } = storeToRefs(orgTableStore)

// const { SecretKey } = useSecretKeyStore()
const validityPeriodType = ref<number | null>(null)
const secretKeyType = ref('')
const [keyInput, keyInputToggle] = useToggle(true)
const secretKeyPhone = ref('')
const secretKeyIdCard = ref('')
const secretKeyIndex = ref<number>()
const [roleStatusVisible, changeRoleStatusVisible] = useToggle(false)
const [roleStatusLoading, changeRoleStatusLoading] = useToggle(false)
const [isBatch, changeIsBatch] = useToggle(false)
const [detailDialogOpen, openDetailDialogToggle] = useToggle(false)
const [InactiveUserVis, InactiveUserVisChange] = useToggle(false)
const roleStatusTitle = ref<string>()
// 列表状态显示枚举
enum EStatus {
  nomarl = '开启',
  close = '锁定',
}
const btnText: Record<number, EStatus> = {
  0: EStatus.close,
  1: EStatus.nomarl,
} as const
const roleStatusRef = ref<InstanceType<typeof RoleStatusModal>>()
const pageNum = ref(1)
const pageSize = ref(10)
const detailData = ref({})
const columns: DataTableColumn[] = [
  {
    title: '序号',
    key: 'index',
    width: 50,
    align: 'center',
    render: (row, index) => {
      return `${index + 1 + (pageNum.value - 1) * pageSize.value}`
    },
    fixed: 'left',
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name',
    width: 80,
    fixed: 'left',
  },
  // {
  //   title: '联系电话',
  //   key: 'phone',
  //   width: 120,
  // },
  {
    align: 'center',
    title: 'i国网账号',
    key: 'account',
    width: 100,
  },
  {
    align: 'center',
    title: '账号类型',
    key: 'validityPeriodType',
    width: 100,
    render: renderAccountTypeColumn,
  },
  {
    title: '有限期',
    align: 'center',
    key: 'expirationDate',
    width: 100,
    render: renderExpirationDateColumn,
  },
  {
    title: '所属组织',
    align: 'center',
    key: 'orgTreeNamePathMapping',
    ellipsis: {
      tooltip: true,
    },
    width: 160,
    render: renderOrgColumn,
  },
  {
    title: '角色名称',
    align: 'center',
    key: 'roleName',
    width: 100,
    render: renderRoleColumn,
  },
  {
    title: '状态',
    align: 'center',
    key: 'status',
    width: 100,
    render: renderStatusColumn,
  },
  // {
  //   title: '锁定时长',
  //   key: 'lockDurationDate',
  //   width: 100,
  // },
  {
    align: 'center',
    title: '最后登录时间',
    key: 'lastLoginTime',
    width: 130,
    render: renderLastLoginTimeColumn,
  },
]
const tableKeyword = ref('')
const memberTable = ref(null)
const { height } = useElementSize(memberTable)
const scrollHeight = computed(() => {
  return height.value - titleAndPaginationHeight.common
})

const roleStatusSelect = ref<number | null>(null)
const roleStatusList: SelectOption[] = [
  {
    label: '全部',
    value: null as any,
  },
  {
    label: '正常',
    value: 0,
  },
  {
    label: '锁定',
    value: 1,
  },
  {
    label: '注销',
    value: 2,
  },
]
const validityPeriodTypeList: SelectOption[] = [
  {
    label: '全部',
    value: null as any,
  },
  {
    label: '永久账号',
    value: 0,
  },
  {
    label: '临时账号',
    value: 1,
  },
]
const orgId = ref('')
const userIds = ref<string[]>([])
const deleteId = ref('')
const tableUserId = ref('')
const pagination = computed<PaginationProps>(() => ({
  itemCount: total.value,
  page: pageNum.value,
  pageSize: pageSize.value,
  showSizePicker: true,
  pageSizes: customPaginationOptions.pageSizeOptions?.map(Number) || [10, 20, 50, 100],
  onUpdatePage: (page: number) => handleTableChange({ current: page, pageSize: pageSize.value }),
  onUpdatePageSize: (size: number) => handleTableChange({ current: 1, pageSize: size }),
  prefix: (info) => `共 ${info.itemCount} 条`,
}))

// page变化
function handleTableChange({ current, pageSize: pageSizeValue }: TablePageChange) {
  pageNum.value = current ?? 1
  pageSize.value = pageSizeValue ?? 10
  refresh()
}

// 删除数据
const [delVisible, delVisibleToggle] = useToggle()
const [delLoading, delLoadingToggle] = useToggle()
const warningTitle = ref('')
const warningHint = ref('')
const warningMess = ref('')
const warnStatus = ref('')

function openSingleDelModal(id: string) {
  warnStatus.value = 'single'
  warningTitle.value = '删除操作'
  warningMess.value = '你确定需要删除此数据么？'
  warningHint.value = '请确保该角色是否被账号使用，若删除后数据将无法恢复'
  delVisibleToggle(true)
  deleteId.value = id
}

function openBatchDelModal() {
  if (userIds.value.length === 0) {
    window.$message.warning('请先选择账号')
    return
  }
  warningTitle.value = '删除操作'
  warnStatus.value = 'all'
  warningMess.value = '你确定需要删除这些数据么？'
  warningHint.value = '请确保这些角色是否被账号使用，若删除后数据将无法恢复'
  delVisibleToggle(true)
}

function handleDeleteCancel() {
  delVisibleToggle(false)
  delLoadingToggle(false)
  warnStatus.value = ''
  warningTitle.value = ''
  warningMess.value = ''
  warningHint.value = ''
  deleteId.value = ''
}

async function handleDeleteClick() {
  delLoadingToggle(true)
  const params = {
    userIds: [deleteId.value],
  }
  const [, err] = await to(postDeleteOrgMemberById(params))

  if (!err) {
    window.$message.success('删除成功')
    userIds.value = []
    pageNum.value = 1
    refresh()
  } else {
    window.$message.error(err.message)
  }
  handleDeleteCancel()
}

async function handleDeleteAllMember() {
  delLoadingToggle(true)
  const params = {
    userIds: userIds.value,
  }
  const [, err] = await to(postDeleteOrgMemberById(params))

  if (!err) {
    window.$message.success('删除成功')
    userIds.value = []
    pageNum.value = 1
    refresh()
  } else {
    window.$message.error(err.message ?? '删除失败')
  }
  handleDeleteCancel()
}

async function handleDeregistration() {
  delLoadingToggle(true)
  const params = {
    userId: deleteId.value,
  }
  const [, err] = await to(postDestroyUser(params))

  if (!err) {
    window.$message.success('注销成功')
    pageNum.value = 1
    refresh()
  } else {
    window.$message.error(err.message ?? '注销失败')
  }
  handleDeleteCancel()
}

function handleDeleteConfirm() {
  switch (warnStatus.value) {
    case 'single':
      handleDeleteClick()
      break
    case 'all':
      handleDeleteAllMember()
      break
    case 'deregistration':
      handleDeregistration()
      break

    default:
      break
  }
}

function rowSelection(selectedRowKeys: (string | number)[]): void {
  userIds.value = selectedRowKeys.map((key) => String(key))
}

function handleAddOrEditListClick(isEdit = false, record?: ITableList) {
  emits('addOrEditListEmit', isEdit, record)
}

// 单独改变状态
function handleChangeStatus(userId: string, status: number) {
  tableUserId.value = userId
  changeIsBatch(false)
  roleStatusTitle.value = status ? btnText[1] : btnText[0]
  changeRoleStatusVisible(true)
}

// 批量改变状态
async function handleChangeAllStatus(type: number) {
  if (userIds.value.length === 0) {
    window.$message.warning('请先选择账号')
    return
  }
  changeIsBatch(true)
  const params = {
    status: 1,
    userIds: userIds.value,
  }
  // 批量开启
  if (type === 0) params.status = 0
  roleStatusTitle.value = type ? btnText[0] : btnText[1]
  changeRoleStatusVisible(true)
}

const statusConfirmEmit = async (val: { [key: string]: number }) => {
  changeRoleStatusLoading(true)
  const { lockDuration, lockType, validDuration, validityPeriodType } = val
  const params = {
    userIds: isBatch.value ? userIds.value : [tableUserId.value],
    status: roleStatusTitle.value === btnText[1] ? 0 : 1,
  }
  if (roleStatusTitle.value === btnText[1])
    Object.assign(params, { validDuration, validityPeriodType })
  else Object.assign(params, { lockDuration, lockType })
  const [, err] = await to(postOrgChangeStatus(params))

  if (!err) {
    window.$message.success('状态更改成功')
    roleStatusRef.value?.resetForm()
    refresh()
  } else {
    window.$message.error(err.message)
  }
  changeRoleStatusVisible(false)
  changeRoleStatusLoading(false)
}

const statusCancelEmit = () => {
  tableUserId.value = ''
  roleStatusRef.value?.resetForm()
  changeRoleStatusVisible(false)
}

function refresh() {
  const params = {
    orgId: orgId.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    status: roleStatusSelect.value,
    keyword: tableKeyword.value,
    validityPeriodType: validityPeriodType.value,
  }
  orgTableStore.getTableListAction({
    ...params,
    status: params.status || 0,
  })
}

function openDeregistrationModal(id: string) {
  warnStatus.value = 'deregistration'
  warningTitle.value = '注销操作'
  warningMess.value = '你确定需要注销该账号么？'
  warningHint.value = '此账号注销后其数据将无法恢复，请谨慎操作！'
  delVisibleToggle(true)
  deleteId.value = id
}

function selectOrgGetTableList(orgParams: ITreeSelect) {
  console.log('orgParams', orgParams)
  tableKeyword.value = orgParams.memberName
  orgId.value = orgParams.orgId
  pageNum.value = 1
  pageSize.value = 10
  tableUserId.value = ''
  refresh()
}

const handleBatchExport = async () => {
  const [data, err] = await to(postBatchExportLock())
  if (!err) download('不活跃账号.xlsx', 'blob' as any, data as Blob)
}

const handleChangeSecret = (index: number, secret: string, type: string) => {
  if (orgTableList.value && orgTableList.value[index][type]) {
    orgTableList.value[index][type] = false
  } else {
    secretKeyType.value = type
    secretKeyIndex.value = index

    if (type === 'phoneVisible') {
      secretKeyPhone.value = secret
      secretKeyIdCard.value = ''
    } else {
      secretKeyPhone.value = ''
      secretKeyIdCard.value = secret
    }
    keyInputToggle(true)
  }
}

const secretKeyConfirm = ({ phone }: { phone: string }) => {
  if (!orgTableList.value) return
  const decryptPhone = atob(phone)
  orgTableList.value[secretKeyIndex.value as number].phone = sm4Encrypt(decryptPhone)
  orgTableList.value[secretKeyIndex.value as number][secretKeyType.value] = true
}

defineExpose({
  selectOrgGetTableList,
  refresh,
})

// 渲染名称列
function renderNameColumn(row: any) {
  return h('a', {}, { default: () => row.name })
}

// 渲染组织列
function renderOrgColumn(row: any) {
  if (
    !row.departmentInfo ||
    !Array.isArray(row.departmentInfo) ||
    row.departmentInfo.length === 0
  ) {
    return '-'
  }

  return row.departmentInfo.map((item: any) => {
    return h('div', { class: 'my-1' }, [
      h(
        NTooltip,
        { placement: 'top', trigger: 'hover' },
        {
          trigger: () => h('div', { class: 'truncate max-w-full' }, item.orgTreeNamePathMapping),
          default: () => item.orgTreeNamePathMapping,
        }
      ),
    ])
  })
}

// 渲染角色列
function renderRoleColumn(row: any) {
  if (!row.roleInfo || !Array.isArray(row.roleInfo) || row.roleInfo.length === 0) {
    return '-'
  }

  return h(
    'div',
    { class: 'flex flex-wrap gap-1' },
    row.roleInfo.map((item: any) => {
      // 截断长文本，确保在Tag中显示得当
      const displayName =
        item.roleName.length > 10 ? item.roleName.slice(0, 10) + '...' : item.roleName

      return h(
        NTag,
        {
          type: 'info',
          size: 'small',
          round: true,
          bordered: false,
          class: 'inline-flex items-center',
          style: 'max-width: 150px; white-space: nowrap;',
        },
        {
          default: () =>
            h(
              NTooltip,
              { placement: 'top', trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    'span',
                    {
                      class: 'truncate inline-block',
                      style: 'max-width: 100%; overflow: hidden;',
                    },
                    displayName
                  ),
                default: () => item.roleName,
              }
            ),
        }
      )
    })
  )
}

// 渲染状态列
function renderStatusColumn(row: any) {
  const statusMap = {
    0: { type: 'success', text: '正常' },
    1: { type: 'error', text: '锁定' },
    2: { type: 'warning', text: '注销' },
  }

  const statusConfig = statusMap[row.statusCode as keyof typeof statusMap] || {
    type: 'default',
    text: row.statusValue || '未知',
  }

  return h(
    NTag,
    {
      type: statusConfig.type as 'success' | 'error' | 'warning' | 'default',
      size: 'small',
      round: true,
      bordered: false,
      class: 'inline-flex items-center justify-center',
      style: 'min-width: 60px;',
    },
    { default: () => statusConfig.text }
  )
}

// 渲染有效期列
function renderExpirationDateColumn(row: any) {
  if (!row.expirationDate) {
    return '永久'
  }
  return dayjs(Number(row.expirationDate)).format('YYYY-MM-DD HH:mm')
}

// 渲染最后登录时间列
function renderLastLoginTimeColumn(row: any) {
  return dayjs(Number(row.lastLoginTime)).format('YYYY-MM-DD HH:mm')
}

// 渲染账号类型列
function renderAccountTypeColumn(row: any) {
  const typeConfig = {
    0: { type: 'success', text: '永久账号' },
    1: { type: 'info', text: '临时账号' },
  }

  const config = typeConfig[row.validityPeriodType as keyof typeof typeConfig] || {
    type: 'default',
    text: '未知类型',
  }

  return h(
    NTag,
    {
      type: config.type as 'success' | 'info' | 'default',
      size: 'small',
      round: true,
      bordered: false,
      class: 'inline-flex items-center justify-center',
      style: 'min-width: 80px;',
    },
    { default: () => config.text }
  )
}

// 渲染操作列
function renderOperationColumn(row: any) {
  if (row.statusCode === 2) return null

  return h('span', { class: 'actions' }, [
    withPermission(
      h(
        'n-button',
        {
          text: true,
          type: 'primary',
          class: 'px-0',
          onClick: () => handleAddOrEditListClick(true, row as ITableList),
        },
        { default: () => '编辑' }
      ),
      'button_contact_department_edit'
    ),
    withPermission(
      h(
        'n-button',
        {
          text: true,
          type: 'primary',
          class: 'px-0',
          onClick: () => handleChangeStatus(row.userId, row.statusCode),
        },
        { default: () => btnText[row.statusCode as number] }
      ),
      'button_contact_department_status'
    ),
    withPermission(
      h(
        'n-button',
        {
          text: true,
          type: 'error',
          class: 'px-0',
          onClick: () => openDeregistrationModal(row.userId),
        },
        { default: () => '注销' }
      ),
      'button_contact_department_destroy'
    ),
    withPermission(
      h(
        'n-button',
        {
          text: true,
          type: 'error',
          class: 'px-0',
          onClick: () => openSingleDelModal(row.userId),
        },
        { default: () => '删除' }
      ),
      'button_contact_department_delete'
    ),
  ])
}
</script>

<template>
  <div class="h-full w-full">
    <div class="mb-6">
      <h3 class="text-18 font-bold text-gray-800 dark:text-gray-200 flex items-center">
        <div class="bg-[#00706b] h-20px w-4px rounded-sm mr-10 ml-6"></div>
        <span>账号列表</span>
      </h3>
    </div>
    <div v-if="orgId" class="search-box mb-5">
      <div class="flex items-center justify-between">
        <!-- 左侧搜索区域 -->
        <div class="flex items-center gap-6">
          <n-input
            v-model:value="tableKeyword"
            placeholder="请输入关键字"
            class="!w-200px search-input"
            @update:value="() => refresh()"
          >
          </n-input>
          <n-select
            v-model:value="validityPeriodType"
            placeholder="账号类型"
            class="w-160px custom-select"
            :options="validityPeriodTypeList"
            @update:value="() => refresh()"
          />
          <n-select
            v-model:value="roleStatusSelect"
            placeholder="账号状态"
            class="w-160px custom-select"
            :options="roleStatusList"
            @update:value="() => refresh()"
          />
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex items-center gap-3">
          <n-popover placement="bottom" trigger="hover">
            <template #trigger>
              <n-button type="primary" class="custom-button"> 批量操作 </n-button>
            </template>
            <n-space vertical class="custom-popover">
              <div class="cursor-pointer hover-item" @click.stop="openBatchDelModal">
                <component
                  :is="
                    withPermission(h('span', null, '批量删除'), 'button_contact_department_delete')
                  "
                />
              </div>
              <div class="cursor-pointer hover-item" @click.stop="handleChangeAllStatus(1)">
                <component
                  :is="
                    withPermission(h('span', null, '批量锁定'), 'button_contact_department_status')
                  "
                />
              </div>
              <div class="cursor-pointer hover-item" @click.stop="handleChangeAllStatus(0)">
                <component
                  :is="
                    withPermission(h('span', null, '批量开启'), 'button_contact_department_status')
                  "
                />
              </div>
            </n-space>
          </n-popover>
          <component
            :is="
              withPermission(
                h(
                  'n-button',
                  {
                    type: 'primary',
                    ghost: true,
                    class: 'custom-button',
                    onClick: () => handleAddOrEditListClick(false),
                  },
                  { default: () => '新增' }
                ),
                'button_contact_department_add'
              )
            "
          />
          <component
            :is="
              withPermission(
                h(
                  'n-button',
                  {
                    type: 'primary',
                    ghost: true,
                    class: 'custom-button',
                    onClick: () => InactiveUserVisChange(true),
                  },
                  { default: () => '不活跃账号' }
                ),
                'button_contact_department_locked_user_export'
              )
            "
          />
        </div>
      </div>
    </div>
    <div ref="memberTable" class="tableContent custom-scrollbar">
      <n-data-table
        size="medium"
        :columns="columns"
        :data="orgTableList"
        :loading="loading"
        :pagination="pagination"
        :scroll-x="1000"
        :row-key="(row) => row.userId"
        class="custom-table"
        @update:checked-row-keys="rowSelection"
      >
        <template #empty>
          <n-empty description="暂无数据" />
        </template>
      </n-data-table>
    </div>
    <deleteModal
      :visible="delVisible"
      :loading="delLoading"
      :title="warningTitle"
      :hint="warningHint"
      :message="warningMess"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
    <RoleStatusModal
      ref="roleStatusRef"
      :status-visible="roleStatusVisible"
      :title="roleStatusTitle"
      :is-batch="isBatch"
      :loading="roleStatusLoading"
      @status-cancel-emit="statusCancelEmit"
      @status-confirm-emit="statusConfirmEmit"
    />
    <secretKeyModal
      :visible="keyInput"
      title="查看"
      :secret-key-type="secretKeyType"
      :secret-key-phone="secretKeyPhone"
      :secret-key-id-card="secretKeyIdCard"
      @cancel="keyInputToggle(false)"
      @confirm="secretKeyConfirm"
    />
    <detailDialog
      :visible="detailDialogOpen"
      :detail-data="detailData as ITableList"
      @close="openDetailDialogToggle(false)"
    />
    <InactiveUserList v-model="InactiveUserVis" @export="handleBatchExport" />
  </div>
</template>

<style lang="less" scoped>
.tableContent {
  min-height: calc(200px - 36px);
  overflow-y: hidden;
  margin-top: 10px;
  height: calc(100% - 170px);
}

.search-box {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.hover-item {
  padding: 8px 14px;
  border-radius: 4px;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: rgba(0, 112, 107, 0.08);
    color: #00706b;
  }
}

.actions {
  :deep(.n-button::after) {
    content: ' | ';
    display: inline-block;
    margin: 0 8px;
    color: #e5e7eb;
  }
  :deep(.n-button:last-child::after) {
    content: '';
  }
}

.cursor-pointer {
  padding: 5px;
}

.search-input {
  :deep(.n-input__border),
  :deep(.n-input__state-border) {
    border-color: #e5e7eb;
  }

  :deep(.n-input:hover .n-input__border) {
    border-color: #00706b;
  }

  :deep(.n-input--focus .n-input__state-border) {
    box-shadow: 0 0 0 2px rgba(0, 112, 107, 0.2);
    border-color: #00706b;
  }
}

.custom-select {
  :deep(.n-base-selection) {
    border-color: #e5e7eb;
  }

  :deep(.n-base-selection:hover) {
    border-color: #00706b;
  }

  :deep(.n-base-selection--focus) {
    box-shadow: 0 0 0 2px rgba(0, 112, 107, 0.2);
    border-color: #00706b;
  }

  :deep(.n-base-selection-tags__wrapper .n-tag) {
    background-color: rgba(0, 112, 107, 0.1);
    color: #00706b;
    border-color: rgba(0, 112, 107, 0.3);
  }
}

.custom-button {
  :deep(&.n-button--primary-type.n-button--ghost) {
    color: #00706b;
    border-color: #00706b;
  }

  :deep(&.n-button--primary-type.n-button--ghost:hover) {
    color: white;
    background-color: #00706b;
  }
}

.custom-table {
  :deep(.n-data-table-thead) {
    background-color: #f8f9fa;
  }

  :deep(.n-data-table-tr:hover) {
    background-color: rgba(0, 112, 107, 0.05);
  }

  :deep(.n-button--primary-type) {
    color: #00706b;
  }

  :deep(.n-button--primary-type:hover) {
    color: #005a56;
  }

  :deep(.n-button--error-type) {
    color: #d03050;
  }

  :deep(.n-button--error-type:hover) {
    color: #ab2440;
  }

  :deep(.n-pagination .n-pagination-item--active) {
    background-color: #00706b;
    color: white;
  }

  :deep(.n-checkbox-box--checked) {
    background-color: #00706b;
    border-color: #00706b;
  }
}

.custom-popover {
  :deep(.n-popover-content) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 112, 107, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 112, 107, 0.3);
    border-radius: 6px;
  }
}
</style>
