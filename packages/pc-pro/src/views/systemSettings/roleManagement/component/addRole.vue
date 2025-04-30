<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to } from '@/utils/to'
import { isEmpty } from 'lodash-es'
import { reactive, ref, watch, h } from 'vue'

import { getPermissionList, getRoleDetail, postSaveRole } from '@/api/system/roleManage'
import { FEATURES_PERMISSIONS_TYPE } from '@/interface/system/roleManage'
import type {
  CellData,
  FormatPermissionList,
  ISaveRole,
  PermissionTreeData,
} from '@/interface/system/roleManage'
import type { FormInst, DataTableColumns } from 'naive-ui'

// 定义自定义列的类型
interface CustomColumns<T> {
  title: string
  dataIndex: keyof T
  key: keyof T
  customCell?: (data: CellData) => any
  width?: number
  align?: 'left' | 'center' | 'right'
}

const emits = defineEmits(['addRefresh'])
const formRef = ref<FormInst | null>(null)
const [visible, changeVisible] = useToggle(false)
const [saveLoading, changeSaveLoading] = useToggle(false)
const [detailLoading, detailLoadingVis] = useToggle(false)
const activeKey = ref('roleInfo')
const roleFormState = reactive<ISaveRole>({
  remark: '',
  status: 0,
  roleName: '',
})
const isEditShow = ref(false)
const roleId = ref('')
const dataSource = ref<FormatPermissionList[]>([])
const allPermissions = ref<FormatPermissionList[]>([])

const rowSpan = (key: string) => {
  const groupMap = dataSource.value.reduce((acc, item) => {
    const groupName = item.firstMenu.name
    const group = acc.get(groupName) || []
    group.push(item)
    acc.set(groupName, group)
    return acc
  }, new Map<string, FormatPermissionList[]>())

  const result: FormatPermissionList[] = []
  groupMap.forEach((groupItems) => {
    for (let i = 0; i < groupItems.length; i++) {
      result.push({
        ...groupItems[i],
        [`${key}RowSpan`]: i === 0 ? groupItems.length : 0,
      })
    }
  })

  dataSource.value = result
}

const columns: DataTableColumns<FormatPermissionList> = [
  {
    title: '一级菜单',
    key: 'firstMenu',
    render(row: FormatPermissionList) {
      const rowSpan = row.firstMenuRowSpan
      if (rowSpan === 0) return null
      return h(
        'div',
        { class: 'flex justify-start items-center px-2', style: { gridRow: `span ${rowSpan}` } },
        [
          h(
            'n-checkbox',
            {
              checked: row.firstMenu.value,
              onUpdateChecked: () => handleChangeFirstMenu(row, dataSource.value.indexOf(row)),
            },
            { default: () => row.firstMenu.name }
          ),
        ]
      )
    },
    width: 150,
    align: 'center',
  },
  {
    title: '二级菜单',
    key: 'secondMenu',
    render(row: FormatPermissionList) {
      if (!row.secondMenu.name) return null
      return h('div', { class: 'flex justify-start items-center px-2' }, [
        h(
          'n-checkbox',
          {
            checked: row.secondMenu.value,
            onUpdateChecked: () => handleChangeSecondMenu(row),
          },
          { default: () => row.secondMenu.name }
        ),
      ])
    },
    width: 180,
    align: 'center',
  },
  {
    title: '操作功能',
    key: 'actions',
    render(row: FormatPermissionList) {
      return h('div', { class: 'grid grid-cols-4 gap-4 px-2' }, row.actions.map((action: PermissionTreeData) =>
          h(
            'n-checkbox',
            {
              checked: isViewActionSelected(row, action),
              disabled: action.name === FEATURES_PERMISSIONS_TYPE.view,
              onUpdateChecked: () => handleChangeActions(row, action),
            },
            { default: () => action.name }
          )
        ))
    },
    align: 'center',
  },
]

watch(
  () => allPermissions.value,
  (val) => {
    dataSource.value = val as FormatPermissionList[]
    rowSpan('firstMenu')
  }
)

const formatRoleInfo = (permissionList: PermissionTreeData[]) => {
  return permissionList.reduce((result: FormatPermissionList[], item) => {
    if (item.hasChildren) {
      item.items.forEach((subitem: PermissionTreeData) => {
        const actions = subitem.hasChildren
          ? subitem.items.map(({ self, ...action }) => ({ ...action, self, value: !!self.checked }))
          : []

        result.push({
          firstMenu: { ...item, value: !!item.self.checked },
          secondMenu: { ...subitem, value: !!subitem.self.checked },
          actions,
        })
      })
    } else {
      result.push({
        firstMenu: { ...item, value: !!item.self.checked },
        secondMenu: {} as PermissionTreeData,
        actions: [],
      })
    }
    return result
  }, [])
}

const getSelectedPermissionIds = (formattedPermissions: FormatPermissionList[]) => {
  return formattedPermissions.reduce((acc: string[], { firstMenu, secondMenu, actions }) => {
    if (firstMenu.value) acc.push(firstMenu.id)
    if (secondMenu.value) acc.push(secondMenu.id)
    if (actions.some(({ value }) => value))
      acc.push(...actions.filter(({ value }) => value).map(({ id }) => id))
    return acc
  }, [])
}

// 一级菜单选择
const changeStatus = (id: string, status: boolean) => {
  dataSource.value.forEach((item: FormatPermissionList) => {
    if (item.firstMenu.id === id) {
      item.firstMenu.value = status

      // 为了提高可读性，将条件判断提取为函数
      const setSecondaryMenuStatus = (menu: PermissionTreeData) => {
        if (!isEmpty(menu)) menu.value = status
      }

      setSecondaryMenuStatus(item.secondMenu)

      // 对于actions数组的遍历和值修改，可以使用forEach或者map，这里使用forEach比较合适
      item.actions.forEach((action) => {
        action.value = status
      })
    }
  })
}

const handleChangeFirstMenu = (record: FormatPermissionList, index: number) => {
  const id = record.firstMenu.id

  // 提前退出循环，减少遍历次数
  const exist = dataSource.value.some((item: FormatPermissionList) => {
    return item.firstMenu.id === id && !item.secondMenu.value
  })
  const hasSecondMenu = record.secondMenu

  if (Object.entries(hasSecondMenu).length) changeStatus(id, exist)
  else dataSource.value[index].firstMenu.value = !record.firstMenu.value
}

// 二级菜单选择
const handleChangeSecondMenu = (record: FormatPermissionList) => {
  const index = dataSource.value.findIndex((item) => item.secondMenu.id === record.secondMenu.id)
  const status = !record.secondMenu.value

  // 更新第二级菜单状态
  dataSource.value[index].secondMenu.value = status

  // 更新第一级菜单状态
  const firstMenuId = record.firstMenu.id
  const matchingMenus = dataSource.value.filter((item) => item.firstMenu.id === firstMenuId)
  const firstMenuStatus = matchingMenus.some((item) => item.secondMenu.value)

  matchingMenus.forEach((item) => {
    item.firstMenu.value = firstMenuStatus
  })

  dataSource.value[index].actions.forEach((action) => {
    action.value = status
  })
}

const handleChangeActions = (record: FormatPermissionList, action: PermissionTreeData) => {
  const { actions, firstMenu, secondMenu } = record
  const { name } = action

  action.value = !action.value

  const checked = actions.some(({ value }) => value)
  firstMenu.value = checked
  secondMenu.value = checked

  const index = actions.findIndex(
    ({ name: actionName }) => actionName === FEATURES_PERMISSIONS_TYPE.view
  )

  if (index !== -1 && actions[index].name === name) actions[index].value = checked
}

const isViewActionSelected = (record: FormatPermissionList, action: PermissionTreeData) => {
  return action.name === FEATURES_PERMISSIONS_TYPE.view ? record.secondMenu.value : action.value
}

const resetFormData = () => {
  activeKey.value = 'roleInfo'
  roleId.value = ''
  allPermissions.value = []
  changeVisible(false)
  formRef.value?.restoreValidation()
}

const isRoleInfoIncomplete = (activeKey: string | null): boolean => {
  return activeKey === 'permissionAssign' || activeKey === 'dataPermissions'
}

const handleSubmitClick = async () => {
  try {
    await formRef.value?.validate()

    const selectedPermissionIds = getSelectedPermissionIds(dataSource.value)

    if (!selectedPermissionIds.length) {
      window.$message.warning('请至少选择一个权限')
      return
    }

    changeSaveLoading(true)

    const param = {
      webPermissionIds: selectedPermissionIds,
      id: roleId.value || '',
      ...roleFormState,
    }

    const [, error] = await to(postSaveRole(param))

    if (!error) {
      emits('addRefresh')
      window.$message.success('操作成功')
    }
  } catch {
    if (isRoleInfoIncomplete(activeKey.value)) return window.$message.warning('请先完善角色信息')
  } finally {
    changeSaveLoading(false)
    resetFormData()
  }
}

const showModal = async (isEdit: boolean, roleIds?: string) => {
  isEditShow.value = isEdit
  roleId.value = roleIds || ''
  changeVisible(true)
  detailLoadingVis(true)

  if (isEdit && roleIds) {
    const [detailRes, error] = await to(getRoleDetail(roleIds))

    if (!error) {
      const { roleName, remark, status, webPermissions } = detailRes
      Object.assign(roleFormState, { roleName, remark, status })
      allPermissions.value = formatRoleInfo(webPermissions)
    }
  } else {
    const [permissionsRes, error] = await to(getPermissionList())

    if (!error) {
      const { webPermissions } = permissionsRes
      allPermissions.value = formatRoleInfo(webPermissions)
    }
  }
  detailLoadingVis(false)
}

defineExpose({
  showModal,
})
</script>

<template>
  <n-modal
    v-model:show="visible"
    :title="roleId ? '编辑角色' : '新增角色'"
    preset="dialog"
    :style="{ width: '60%' }"
    :mask-closable="false"
    @close="resetFormData"
  >
    <n-spin :show="detailLoading">
      <div>
        <n-tabs v-model:value="activeKey" type="line" animated>
          <n-tab-pane name="roleInfo" tab="角色信息">
            <div class="h-50vh overflow-y-auto py-2">
              <n-form
                ref="formRef"
                class="form"
                :model="roleFormState"
                label-placement="left"
                :label-width="100"
              >
                <n-form-item
                  label="角色名称"
                  path="roleName"
                  :rule="{
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  }"
                >
                  <n-input
                    v-model:value="roleFormState.roleName"
                    clearable
                    show-count
                    :maxlength="30"
                    placeholder="请输入"
                  />
                </n-form-item>
                <n-form-item
                  label="是否启用"
                  path="status"
                  :rule="{
                    required: true,
                    message: '请选择',
                    trigger: 'blur',
                  }"
                >
                  <n-select
                    v-model:value="roleFormState.status"
                    clearable
                    placeholder="请选择"
                    :options="[
                      { label: '是', value: 0 },
                      { label: '否', value: 1 },
                    ]"
                  />
                </n-form-item>
                <n-form-item label="备注" path="remark">
                  <n-input
                    v-model:value="roleFormState.remark"
                    type="textarea"
                    show-count
                    :maxlength="100"
                    :autosize="{ minRows: 4, maxRows: 5 }"
                  />
                </n-form-item>
              </n-form>
            </div>
          </n-tab-pane>
          <n-tab-pane name="permissionAssign" tab="权限分配">
            <div class="h-50vh overflow-y-auto py-2">
              <n-table class="bg-white rounded-[5px]" :bordered="true" :single-line="false">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 150px">一级菜单</th>
                    <th class="text-center" style="width: 180px">二级菜单</th>
                    <th class="text-center">操作功能</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in dataSource" :key="index">
                    <tr>
                      <td
                        :rowspan="item.firstMenuRowSpan || 1"
                        v-if="item.firstMenuRowSpan !== 0"
                        class="text-center"
                      >
                        <div class="flex justify-start items-center px-2">
                          <n-checkbox
                            :checked="item.firstMenu.value"
                            @update:checked="handleChangeFirstMenu(item, index)"
                          >
                            {{ item.firstMenu.name }}
                          </n-checkbox>
                        </div>
                      </td>
                      <td class="text-center">
                        <div class="flex justify-start items-center px-2">
                          <n-checkbox
                            v-if="item.secondMenu.name"
                            :checked="item.secondMenu.value"
                            @update:checked="handleChangeSecondMenu(item)"
                          >
                            {{ item.secondMenu.name }}
                          </n-checkbox>
                        </div>
                      </td>
                      <td>
                        <div class="grid grid-cols-4 gap-4 px-2">
                          <n-checkbox
                            v-for="(action, actionIndex) in item.actions"
                            :key="actionIndex"
                            :checked="isViewActionSelected(item, action)"
                            :disabled="action.name === FEATURES_PERMISSIONS_TYPE.view"
                            @update:checked="handleChangeActions(item, action)"
                          >
                            {{ action.name }}
                          </n-checkbox>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-spin>
    <template #action>
      <n-space justify="end">
        <n-button @click="resetFormData">取消</n-button>
        <n-button type="primary" :loading="saveLoading" @click="handleSubmitClick">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
