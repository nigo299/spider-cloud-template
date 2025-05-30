<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to, NotRevalidateOption } from '@/utils/to'
import { storeToRefs } from 'pinia'
import useSWRV from 'swrv'
import { reactive, ref, computed } from 'vue'

import type { CascaderOption, FormInst, SelectOption } from 'naive-ui'
import { Eye, EyeOff } from '@vicons/ionicons5'

import { postSaveOrgMember } from '@/api/system/organization'
import { getRoleListByPermission } from '@/api/system/roleManage'
import secretKeyModal from './secretKey.vue'
import type {
  IDepartmentInfo,
  IRoleInfo,
  IRoleList,
  ISyncTreeList,
  ITableList,
  ITableModalFormState,
} from '@/interface/system/organization'
import { useOrgTableStore } from '@/store/modules/innerOrganization'
import { validateIgw } from '@/utils/validate'

const emits = defineEmits(['refreshTable'])

const formRef = ref<FormInst>()
const [meetingMemberEdit, meetingMemberEditToggle] = useToggle()
const secretKeyPhone = ref('')
const secretKeyIdCard = ref('')
const [keyInput, keyInputToggle] = useToggle()
const [submitLoading, submitLoadingToggle] = useToggle()

// 请求
const orgTableStore = useOrgTableStore()
orgTableStore.getRoleAndOrgTreeListAction()
const { orgTreeList, orgId, orgTableList } = storeToRefs(orgTableStore)
const isEditShow = ref(false)
const visible = ref<boolean>(false)
const canbeSelectRoleList = ref<IRoleList[]>([])
const formState = ref<ITableModalFormState>({
  name: '',
  departmentIds: [],
  roleIds: '',
  phone: null,
  account: '',
  roleInfo: [],
  userId: '',
  deptId: '',
  tenantId: '',
  orgTreePathMappingList: [],
  orgTreeNamePathMapping: '',
  // statusCode: 0,
  // statusValue: '',
  createTime: '',
  departmentInfo: [],
  validityPeriodType: 0,
  validDuration: null,
})

const fieldNames = {
  children: 'items',
  label: 'name',
  value: 'id',
}

// 将ISyncTreeList[]转换为CascaderOption[]类型
const cascaderOptions = computed<CascaderOption[]>(() => {
  return orgTreeList.value as unknown as CascaderOption[]
})

const defaultValue = ref<string[]>([])
const paganation = reactive({
  pageNum: 1,
  pageSize: 999,
  ignoreDisabledRole: true,
})
const total = ref(0)

async function handleGetRoleList() {
  const [data, err] = await to(getRoleListByPermission(paganation))

  if (!err) {
    total.value = data.total
    const list = data.list.map((item: IRoleList) => {
      item.value = item.id
      item.label = item.roleName
      return item
    })
    return list
  } else {
    window.$message.error(err.message)
  }
}
const { data: roleList } = useSWRV(
  () => `[getRoleList]${paganation.pageNum}${paganation.pageSize}`,
  () => handleGetRoleList(),
  NotRevalidateOption
)

function roleSelectPopupScroll(e: Event) {
  const target = e.target as HTMLElement

  if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
    if (paganation.pageNum * paganation.pageSize < total.value) {
      paganation.pageNum = 1
      paganation.pageSize = paganation.pageSize + 10
    }
  }
}

const onChange = (_value: string[]) => {
  defaultValue.value = _value
}

// 表单验证
function onFinish() {
  formRef.value
    ?.validate()
    .then(async () => {
      submitLoadingToggle(true)
      const isMultiDept = formState.value.departmentInfo.map((item: IDepartmentInfo) => {
        return item.deptId
      }).length
      let departmentIds: string[] = []

      if (isMultiDept > 1) {
        // 多部门
        const originDeptIds = formState.value.departmentInfo.map((item: IDepartmentInfo) => {
          return item.deptId
        })
        const index = originDeptIds.findIndex((item: string) => {
          return item === orgId.value
        })
        const finalllyDeptId =
          formState.value.departmentIds[formState.value.departmentIds.length - 1]
        originDeptIds.splice(index, 1, finalllyDeptId)
        departmentIds = Array.from(new Set(originDeptIds))
      } else {
        // 单部门
        departmentIds = [formState.value.departmentIds[formState.value.departmentIds.length - 1]]
      }
      // const cloneParams = cloneDeep(formState.value)

      // const { phone } = cloneParams
      // formState.value.phone = sm4Encrypt(phone)
      if (isEditShow.value) {
        // 编辑
        const params = {
          ...formState.value,
          id: formState.value.userId,
          departmentIds,
          roleIds: formState.value.roleIds ? [formState.value.roleIds] : [],
        }
        const [, err] = await to(postSaveOrgMember(params))

        if (!err) {
          emits('refreshTable')
          window.$message.success('编辑成功')
        } else {
          window.$message.error(err.message)
        }
      } else {
        // 新增
        const params = {
          ...formState.value,
          departmentIds,
          roleIds: formState.value.roleIds ? [formState.value.roleIds] : [],
        }
        const [, err] = await to(postSaveOrgMember(params))

        if (!err) {
          emits('refreshTable')
          window.$message.success('新增成功')
        } else {
          window.$message.error(err.message)
        }
      }
      submitLoadingToggle(false)
      resetForm()
      visible.value = false
    })
    .catch(() => {})
}

// 表单重置
function resetForm() {
  visible.value = false
  formRef.value?.restoreValidation()
  formState.value = {
    name: '',
    departmentIds: [],
    roleIds: '',
    phone: null,
    account: '',
    roleInfo: [],
    userId: '',
    deptId: '',
    tenantId: '',
    orgTreePathMappingList: [],
    orgTreeNamePathMapping: '',
    // statusCode: 0,
    // statusValue: '',
    createTime: '',
    departmentInfo: [],
    validityPeriodType: 0,
    validDuration: null,
  }
}

function showModal(isEdit: boolean, row?: ITableList) {
  isEditShow.value = isEdit

  if (isEdit && row) {
    let roleIds = ''
    if (row.roleInfo && row.roleInfo.length) roleIds = row.roleInfo[0].id
    const newRow = {
      ...row,
      departmentIds: row.orgTreePathMappingList,
      // status: row.statusCode,
      roleIds,
    }
    formState.value = { ...newRow }
    // const phone = formState.value.phone as string
    // formState.value.phone = phone?.length > 11 ? String(sm4Decrypt(phone)) : phone
    let unauthorizedRoleList: IRoleInfo[] = []

    if (row.roleInfo && row.roleInfo.length) {
      unauthorizedRoleList = row.roleInfo.filter(
        (item) => !roleList.value!.some((subItem) => subItem.id === item.id)
      )
    }
    canbeSelectRoleList.value = [...roleList.value!, ...unauthorizedRoleList] as IRoleList[]
  } else {
    // 新增列表
    const res = getDefaultShow(orgTreeList.value, orgId.value)
    let deptsId: string[] = []
    if (orgTableList.value.length > 0) deptsId = orgTableList.value[0].orgTreePathMappingList

    formState.value = {
      ...formState.value,
      departmentIds: deptsId.length ? deptsId : (res as string[]),
    }
    canbeSelectRoleList.value = roleList.value ?? []
  }
  visible.value = true
  meetingMemberEditToggle(false)
}

function getDefaultShow(arr: ISyncTreeList[], id: string) {
  for (let i = 0; i < arr.length; i++) {
    const currentItem = arr[i]

    if (currentItem.id === id) {
      return currentItem.idPath
    } else {
      if (currentItem.items && currentItem.items.length > 0) {
        const res = getDefaultShow(currentItem.items, id) as []
        if (res) return res
      }
    }
  }
}

function handleChangeSecret() {
  if (!isEditShow.value) return

  if (meetingMemberEdit.value) {
    meetingMemberEditToggle(false)
  } else {
    // const { phone } = formState.value
    // secretKeyPhone.value = phone ? phone : ''
    keyInputToggle(true)
  }
}

const secretKeyConfirm = () => {
  // const decryptPhone = phone ? atob(phone) : ''
  // formState.value.phone = decryptPhone
  meetingMemberEditToggle(true)
}

// 将roleList转换为符合SelectOption类型的数组
const roleOptions = computed<SelectOption[]>(() => {
  return canbeSelectRoleList.value.map((item) => ({
    label: item.roleName,
    value: item.id,
    disabled: !item.roleType,
  }))
})

defineExpose({
  showModal,
})
</script>

<template>
  <div class="organization">
    <n-modal
      v-model:show="visible"
      :mask-closable="false"
      style="width: 30%"
      @close="resetForm"
      @positive-click="onFinish"
    >
      <template #action>
        <n-space>
          <n-button @click="resetForm"> 取消 </n-button>
          <n-button type="primary" ghost :loading="submitLoading" @click="onFinish">
            保存
          </n-button>
        </n-space>
      </template>
      <template #header>
        <div class="cursor-pointer" style="width: fit-content" @click="handleChangeSecret">
          {{ `${isEditShow ? '编辑' : '新增'}成员` }}
          <template v-if="isEditShow">
            <n-icon v-if="meetingMemberEdit"><Eye /></n-icon>
            <n-icon v-if="!meetingMemberEdit"><EyeOff /></n-icon>
          </template>
        </div>
      </template>
      <n-form
        ref="formRef"
        class="form"
        :model="formState"
        label-placement="left"
        :label-width="80"
      >
        <n-form-item
          label="姓名"
          path="name"
          :rule="{ required: true, message: '请输入姓名', trigger: 'blur' }"
        >
          <n-input v-model:value="formState.name" placeholder="请输入" :disabled="isEditShow" />
        </n-form-item>
        <n-form-item
          label="i国网账号"
          path="account"
          :rule="{ validator: validateIgw, required: true, trigger: 'blur' }"
        >
          <n-input v-model:value="formState.account" placeholder="请输入" :disabled="isEditShow" />
        </n-form-item>
        <n-form-item
          label="所属组织"
          path="departmentIds"
          :rule="{ required: true, message: '请选择组织', trigger: 'blur' }"
        >
          <n-cascader
            v-model:value="formState.departmentIds"
            :options="cascaderOptions"
            :disabled="isEditShow"
            :field-names="fieldNames"
            :default-value="defaultValue"
            placeholder="请选择组织"
            check-strategy="child"
            @update:value="onChange"
          />
        </n-form-item>
        <n-form-item label="角色名称" path="roleIds">
          <n-select
            v-model:value="formState.roleIds"
            clearable
            :max-tag-count="3"
            placeholder="请选择"
            :options="roleOptions"
            @scroll="roleSelectPopupScroll"
          />
        </n-form-item>
        <n-form-item label="账号类型" path="validityPeriodType">
          <n-radio-group
            v-model:value="formState.validityPeriodType"
            class="mt-5px w-full"
            :disabled="isEditShow"
          >
            <n-radio :value="0"> 永久账号 </n-radio>
            <br />
            <n-radio :value="1">
              <span>临时账号</span>
              <div
                v-if="formState.validityPeriodType === 1 && !isEditShow"
                class="ml-8 inline-block"
              >
                有效时长（天）：
                <n-input-number
                  id="inputNumber"
                  v-model:value="formState.validDuration as number"
                  :min="1"
                  :max="90"
                />
              </div>
            </n-radio>
          </n-radio-group>
        </n-form-item>
      </n-form>
    </n-modal>
    <secretKeyModal
      :visible="keyInput"
      title="编辑"
      secret-key-type="organizationEdit"
      :secret-key-phone="secretKeyPhone"
      :secret-key-id-card="secretKeyIdCard"
      @cancel="keyInputToggle(false)"
      @confirm="secretKeyConfirm"
    />
  </div>
</template>

<style lang="less" scoped>
.organization {
  :deep(.n-modal-header) {
    text-align: center;
  }
}
</style>
