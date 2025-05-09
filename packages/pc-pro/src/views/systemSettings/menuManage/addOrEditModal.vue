<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to } from '@/utils/to'
import { ref } from 'vue'
import { type FormInst, type FormRules, type TreeSelectOption, type SelectOption } from 'naive-ui'

import { addMenu, updateMenu } from '@/api/system/menuManage'
import type { IMenuTreeRecord } from '@/interface/system/menuManage'

import { formColumns, formConfig } from './config/editFormConfig'

const emit = defineEmits(['refresh'])
const [dialogVis, dialogVisChange] = useToggle(false)
const [isEditVis, isEditVisChange] = useToggle(false)
const data = ref({} as IMenuTreeRecord)
const formRef = ref<FormInst | null>(null)
const formRules = ref<FormRules>(formConfig.rules || {})

// 获取表单字段配置
const getParentField = () => formColumns.value.find((item) => item.field === 'parentId')
const getPermissionField = () => formColumns.value.find((item) => item.field === 'permissionType')
const getNameField = () => formColumns.value.find((item) => item.field === 'name')
const getPathField = () => formColumns.value.find((item) => item.field === 'path')
const getCodeField = () => formColumns.value.find((item) => item.field === 'code')

// 转换字段配置
const getFieldNames = () => {
  const field = getParentField()
  return (
    (field?.fieldNames as { label: string; value: string; children: string }) || {
      label: 'name',
      value: 'id',
      children: 'children',
    }
  )
}

// 转换选项为Naive UI SelectOption类型
const getPermissionOptions = () => {
  const field = getPermissionField()
  return (field?.options as SelectOption[]) || []
}

// 处理placeholder类型，确保返回字符串
const getPlaceholder = (field: ReturnType<typeof getParentField>, defaultValue: string): string => {
  if (!field?.placeholder) return defaultValue
  return Array.isArray(field.placeholder) ? field.placeholder[0] : field.placeholder
}

function showModal(isEdit: boolean, row?: IMenuTreeRecord) {
  isEditVisChange(isEdit)
  const parentIndex = formColumns.value.findIndex((item) => item.field === 'parentId')

  if (isEdit) {
    Object.assign(data.value, row)
  } else {
    if (row) {
      data.value.parentId = row.id
      data.value.id = null
    } else {
      formColumns.value[parentIndex].treeData = [
        { name: '主目录', id: null, parentId: null },
      ] as TreeSelectOption[]
      data.value.parentId = null
      data.value.id = null
    }
  }
  dialogVisChange(true)
}

function cancelEvent() {
  data.value = {} as IMenuTreeRecord
  dialogVisChange(false)
}

async function submit() {
  if (!formRef.value) return

  formRef.value.validate(async (errors) => {
    if (!errors) {
      const { code, name, path, id, parentId, permissionType } = data.value
      const params = { code, name, path, id, parentId, permissionType }

      try {
        if (isEditVis.value) {
          const [, error] = await to(updateMenu(params))

          if (error) {
            window.$message.error(error.message)
            return
          }
        } else {
          const [, error] = await to(addMenu(params))

          if (error) {
            window.$message.error(error.message)
            return
          }
        }
        window.$message.success(isEditVis.value ? '编辑成功' : '新增成功')
        emit('refresh')
        cancelEvent()
      } catch (error: any) {
        window.$message.error(error.message || '操作失败')
      }
    }
  })
}

defineExpose({
  showModal,
})
</script>

<template>
  <n-modal
    v-model:show="dialogVis"
    :title="`${isEditVis ? '编辑' : '新增'}`"
    preset="dialog"
    style="width: 60%"
    @close="cancelEvent"
  >
    <n-form
      ref="formRef"
      :model="data"
      :rules="formRules"
      label-placement="left"
      :label-width="120"
    >
      <!-- 上级菜单 -->
      <n-form-item label="上级菜单" path="parentId">
        <n-tree-select
          v-model:value="data.parentId"
          :options="getParentField()?.treeData || []"
          :disabled="getParentField()?.disabled"
          :placeholder="getPlaceholder(getParentField(), '请选择')"
          :label-field="getFieldNames().label"
          :key-field="getFieldNames().value"
          :children-field="getFieldNames().children"
        />
      </n-form-item>

      <!-- 菜单类型 -->
      <n-form-item label="菜单类型" path="permissionType">
        <n-select
          v-model:value="data.permissionType"
          :options="getPermissionOptions()"
          :placeholder="getPlaceholder(getPermissionField(), '请选择')"
        />
      </n-form-item>

      <!-- 菜单名称 -->
      <n-form-item label="菜单名称" path="name">
        <n-input
          v-model:value="data.name"
          :placeholder="getPlaceholder(getNameField(), '请输入菜单名称')"
        />
      </n-form-item>

      <!-- 请求地址 -->
      <n-form-item label="请求地址" path="path">
        <n-input
          v-model:value="data.path"
          :placeholder="getPlaceholder(getPathField(), '请输入请求地址')"
        />
      </n-form-item>

      <!-- 权限标识 -->
      <n-form-item label="权限标识" path="code">
        <n-input
          v-model:value="data.code"
          :placeholder="getPlaceholder(getCodeField(), '请输入权限标识')"
        />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="cancelEvent">取消</n-button>
        <n-button type="primary" @click="submit">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
