<script setup lang="ts">
import { pick, uniq, isEmpty } from 'lodash-es'
import { computed, ref, watch, h } from 'vue'
import { HelpCircleOutline } from '@vicons/ionicons5'

import useUser from '@/hooks/useUser'
import {
  DATA_PERMISSION_TYPE,
  FEATURES_PERMISSIONS_TYPE,
  ROLE_TYPE,
} from '@/interface/system/roleManage'
import type {
  BasicDepartmentInfo,
  FormatPermissionList,
  PermissionTreeData,
  RoleBasicMessage,
} from '@/interface/system/roleManage'
import type { FormInst } from 'naive-ui'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  roleInfoInEdit: {
    type: Object,
    default: () => {},
  },
  allPermissions: {
    type: Array<FormatPermissionList>,
    default: () => [],
  },
  permissionType: {
    type: Number,
    default: null,
  },
  permissionsUnitIdList: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['close', 'addRole'])
enum STEP_TYPE {
  roleInfo = '下一步',
  dataPermission = '下一步 ',
  permissionAssign = '确定',
}
const activeKey = ref<'roleInfo' | 'dataPermission' | 'permissionAssign'>('roleInfo')
const formState = ref<RoleBasicMessage>({
  roleName: '',
  id: '',
  remark: '',
})
const formRef = ref<FormInst | null>(null)
const { user } = useUser()
const unitIdList = ref<BasicDepartmentInfo[]>([])
const dataSource = ref<FormatPermissionList[]>([])
const dataSourceWithoutDepartment = ref<FormatPermissionList[]>([])
const selectDataPermission = ref<number | null>(null)

watch(
  () => props.roleInfoInEdit,
  (val) => {
    formState.value = pick(val, 'roleName', 'id', 'remark')
  }
)
watch(
  () => props.permissionType,
  (val) => {
    selectDataPermission.value = val
  }
)
watch(
  () => props.allPermissions,
  (val) => {
    dataSource.value = rowSpan(val, 'firstMenu')
    const notContainDepartment = val.filter(
      (item) => item.secondMenu.self.code !== 'menu_contact_department'
    )
    dataSourceWithoutDepartment.value = rowSpan(notContainDepartment, 'firstMenu')
  }
)
watch(
  () => props.permissionsUnitIdList,
  (val) => {
    unitIdList.value = val as BasicDepartmentInfo[]
  }
)

interface CellData extends FormatPermissionList {
  firstMenuRowSpan: number
}

const columns = [
  {
    title: '一级菜单',
    key: 'firstMenu',
    width: 150,
    render(row: FormatPermissionList, index: number) {
      const item = row as CellData
      const rowSpan = item.firstMenuRowSpan || 0
      if (rowSpan === 0) return null

      return h(
        'td',
        {
          rowSpan,
          style: { verticalAlign: 'middle' },
        },
        h('div', { class: 'flex items-center' }, [
          h(
            'n-checkbox',
            {
              checked: firstMenuStatus(row.firstMenu.id),
              disabled: props.roleInfoInEdit.roleType === ROLE_TYPE.system,
              onUpdateChecked: () => handleChangeFirstMenu(row as FormatPermissionList),
            },
            { default: () => row.firstMenu.name }
          ),
        ])
      )
    },
  },
  {
    title: '二级菜单',
    key: 'secondMenu',
    width: 150,
    render(row: FormatPermissionList) {
      if (!row.secondMenu.name) return null

      return h(
        'n-checkbox',
        {
          checked: row.secondMenu.value,
          disabled: props.roleInfoInEdit.roleType === ROLE_TYPE.system,
          onUpdateChecked: () => handleChangeSecondMenu(row as FormatPermissionList),
        },
        { default: () => row.secondMenu.name }
      )
    },
  },
  {
    title: '操作功能',
    key: 'actions',
    render(row: FormatPermissionList) {
      return h(
        'div',
        { class: 'flex flex-wrap gap-4' },
        row.actions.map((item, index) => {
          return h('div', { key: index, class: 'flex items-center' }, [
            h(
              'n-checkbox',
              {
                checked: viewActionsStatus(row as FormatPermissionList, item),
                disabled:
                  item.name === FEATURES_PERMISSIONS_TYPE.view ||
                  props.roleInfoInEdit.roleType === ROLE_TYPE.system,
                onUpdateChecked: () => handleChangeActions(row as FormatPermissionList, item),
              },
              { default: () => item.name }
            ),

            // 培训提示
            item.name === FEATURES_PERMISSIONS_TYPE.add && row.secondMenu.name === '全部培训'
              ? h(
                  'n-tooltip',
                  { trigger: 'hover', placement: 'top' },
                  {
                    trigger: () =>
                      h(
                        'n-icon',
                        { class: 'ml-1 text-gray-400' },
                        { default: () => h(HelpCircleOutline) }
                      ),
                    default: () =>
                      '仅具备对培训信息的新增权限，不具备对学员信息、课程信息、培训资料、其他信息的新增权限',
                  }
                )
              : null,

            // 会议提示
            item.name === FEATURES_PERMISSIONS_TYPE.add && row.secondMenu.name === '全部会议'
              ? h(
                  'n-tooltip',
                  { trigger: 'hover', placement: 'top' },
                  {
                    trigger: () =>
                      h(
                        'n-icon',
                        { class: 'ml-1 text-gray-400' },
                        { default: () => h(HelpCircleOutline) }
                      ),
                    default: () =>
                      '仅具备对基础信息的新增权限，不具备对会议成员、会议议程、会议资料、其他信息的新增权限',
                  }
                )
              : null,
          ])
        })
      )
    },
  },
]

function rowSpan(data: FormatPermissionList[], key: string) {
  const mergeRowspan = data
    .reduce((result: string[], item: FormatPermissionList) => {
      if (!result.includes(item.firstMenu.name)) result.push(item.firstMenu.name)

      return result
    }, [])
    .reduce((result: FormatPermissionList[], keys: string) => {
      const children = data.filter((item: FormatPermissionList) => item.firstMenu.name === keys)
      result = result.concat(
        children.map((item: FormatPermissionList, index: number) => ({
          ...item,
          [`${key}RowSpan`]: index === 0 ? children.length : 0,
        }))
      )
      return result
    }, [])
  return mergeRowspan
}
const currentPeremissionAssignList = computed(() =>
  selectDataPermission.value === DATA_PERMISSION_TYPE.individual
    ? dataSourceWithoutDepartment.value
    : dataSource.value
)

function firstMenuStatus(id: string) {
  const rowspanData = currentPeremissionAssignList.value.filter(
    (item: FormatPermissionList) => item.firstMenu.id === id
  )
  return rowspanData.some((item: FormatPermissionList) => item.secondMenu.value)
}

function getPermissionBySelect(data: FormatPermissionList[]) {
  const result: string[] = []
  data.forEach((item) => {
    if (item.firstMenu.value) result.push(item.firstMenu.id)

    if (!isEmpty(item.secondMenu) && item.secondMenu.value) result.push(item.secondMenu.id)

    if (item.actions.length) {
      const actionsList = item.actions.filter((arg) => arg.value)
      if (actionsList.length) actionsList.forEach((sec) => result.push(sec.id))
    }
  })
  return uniq(result)
}

function tapConfirm() {
  if (formState.value.id) handleOkByEdit()
  else handleOkByAdd()
}

function handleOkByEdit() {
  formRef.value
    ?.validate()
    .then(() => {
      checkPermissionAssign()
    })
    .catch(() => {
      activeKey.value = 'roleInfo'
      window.$message?.warning('请先完善信息')
    })
}

function handleOkByAdd() {
  switch (activeKey.value) {
    case 'roleInfo':
      formRef.value
        ?.validate()
        .then(() => {
          activeKey.value = 'dataPermission'
        })
        .catch(() => {
          window.$message?.warning('请先完善信息')
        })
      break
    case 'dataPermission':
      activeKey.value = 'permissionAssign'
      break
    case 'permissionAssign':
      formRef.value
        ?.validate()
        .then(() => {
          checkPermissionAssign()
        })
        .catch(() => {
          activeKey.value = 'roleInfo'
          window.$message?.warning('请先完善信息')
        })
      break
    default:
      break
  }
}

function checkPermissionAssign() {
  const result = getPermissionBySelect(currentPeremissionAssignList.value)

  if (result.length) {
    const ids = unitIdList.value.map((item) => item.deptId)
    const param = {
      dataPermissionType: selectDataPermission.value,
      webPermissionIds: result,
      ...formState.value,
      dynamicDataPermissionRef: {
        departmentIds: selectDataPermission.value === DATA_PERMISSION_TYPE.unit ? ids : [],
      },
    }
    emits('addRole', param)
  } else {
    activeKey.value = 'permissionAssign'
    window.$message?.warning('权限分配中至少选择一项菜单权限')
  }
}

function beforeCancel() {
  activeKey.value = 'roleInfo'
  unitIdList.value = []
}

function handleCancel() {
  beforeCancel()
  emits('close')
}

function permissionChange(value: number) {
  selectDataPermission.value = value
}

function handleChangeFirstMenu(record: FormatPermissionList) {
  const id = record.firstMenu.id
  const exist = currentPeremissionAssignList.value.filter(
    (item: FormatPermissionList) => item.firstMenu.id === id && !item.secondMenu.value
  )
  changeStatus(id, !!exist.length)
}

function changeStatus(id: string, status: boolean) {
  currentPeremissionAssignList.value.forEach((item: FormatPermissionList) => {
    if (item.firstMenu.id === id) {
      item.firstMenu.value = status
      if (!isEmpty(item.secondMenu)) item.secondMenu.value = status

      if (item.actions.length) item.actions.forEach((sec) => (sec.value = status))
    }
  })
}

function handleChangeSecondMenu(record: FormatPermissionList) {
  record.secondMenu.value = !record.secondMenu.value
  record.firstMenu.value = record.secondMenu.value
  record.actions.forEach((sec) => (sec.value = record.secondMenu.value))
}

function handleChangeActions(record: FormatPermissionList, data: PermissionTreeData) {
  data.value = !data.value
  const exist = record.actions.some((item) => item.value)
  record.firstMenu.value = exist
  record.secondMenu.value = exist
  const index = record.actions.findIndex((item) => item.name === FEATURES_PERMISSIONS_TYPE.view)
  record.actions[index].value = exist
}

function viewActionsStatus(record: FormatPermissionList, data: PermissionTreeData) {
  if (data.name === FEATURES_PERMISSIONS_TYPE.view) return record.secondMenu.value

  return data.value
}

function dynamicTitle() {
  if (formState.value.id) {
    if (props.roleInfoInEdit.roleType === ROLE_TYPE.system) return '查看角色'

    return '编辑角色'
  } else {
    return '新增角色'
  }
}

function canBeCheckCompany() {
  const isUnit = user.value?.dataPermissionType === DATA_PERMISSION_TYPE.unit
  const isIndividual = user.value?.dataPermissionType === DATA_PERMISSION_TYPE.individual
  return isUnit || isIndividual
}

function canBeCheckUnit() {
  const isIndividual = user.value?.dataPermissionType === DATA_PERMISSION_TYPE.individual
  return isIndividual
}

function dynamicConfirmText() {
  return formState.value.id ? '确定' : STEP_TYPE[activeKey.value]
}
</script>

<template>
  <n-modal
    v-model:show="props.visible"
    style="width: 50%"
    :mask-closable="false"
    preset="card"
    :title="dynamicTitle()"
    :bordered="false"
    @after-leave="beforeCancel"
    @close="handleCancel"
  >
    <div class="h-[60vh] overflow-hidden">
      <n-tabs v-model:value="activeKey" class="h-full" animated>
        <n-tab-pane name="roleInfo" tab="角色信息">
          <n-form ref="formRef" :model="formState" class="mx-auto">
            <n-form-item
              label="名称"
              path="roleName"
              :rule="{ required: true, message: '请输入角色名称', trigger: 'blur' }"
            >
              <n-input
                v-model:value="formState.roleName"
                placeholder="请输入角色名称"
                :maxlength="16"
                show-count
                clearable
                :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
                @input="(e) => e.replace(/[, ]/g, '')"
              />
            </n-form-item>
            <n-form-item v-show="formState.id" label="ID" path="id">
              <n-input v-model:value="formState.id as string" disabled />
            </n-form-item>
            <n-form-item label="备注" path="remark">
              <n-input
                v-model:value="formState.remark"
                placeholder="请输入备注"
                type="textarea"
                show-count
                :maxlength="250"
                :autosize="{ minRows: 4, maxRows: 6 }"
                :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="dataPermission" tab="数据权限" :disabled="!formState.roleName">
          <n-radio-group
            v-model:value="selectDataPermission"
            :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
            @update:value="permissionChange"
          >
            <n-space>
              <n-radio :value="8" :disabled="canBeCheckCompany()"> 全公司数据 </n-radio>
              <n-radio :value="4" :disabled="canBeCheckUnit()"> 单位数据 </n-radio>
              <n-radio :value="1"> 仅本人数据 </n-radio>
            </n-space>
          </n-radio-group>
          <!-- <div
            v-if="selectDataPermission === DATA_PERMISSION_TYPE.unit"
            class="h-[calc(60vh-110px)] overflow-hidden pb-2"
          >
            <UnitDataModal
              :unit-list="unitIdList"
              :canbe-edit="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
              @handleSelect="selectUnitList"
            />
          </div> -->
        </n-tab-pane>
        <n-tab-pane name="permissionAssign" tab="权限分配" :disabled="!formState.roleName">
          <div class="h-[calc(60vh-110px)] overflow-y-auto">
            <n-data-table
              class="bg-white py-3"
              :columns="columns"
              :data="
                selectDataPermission === DATA_PERMISSION_TYPE.individual
                  ? dataSourceWithoutDepartment
                  : dataSource
              "
              :bordered="true"
              :pagination="false"
              :single-line="false"
            />
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button
          type="primary"
          :loading="props.loading"
          :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
          @click="tapConfirm"
        >
          {{ dynamicConfirmText() }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
:deep(.n-input-textarea) {
  min-height: 120px;
}
</style>
