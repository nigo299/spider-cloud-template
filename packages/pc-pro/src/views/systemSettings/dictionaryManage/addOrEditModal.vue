<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to } from '@/utils/to'
import { type FormInst } from 'naive-ui'
import { ref } from 'vue'

import { updateDictionary, updateDictionaryDetail } from '@/api/system/dictionary'
import type { FormColumnType, FormConfigType } from '@/interface/form'
import type { IDictionaryAddOrEditParams } from '@/interface/system/dictionary'

import {
  dictionaryValueFormColumns,
  dictionaryValueFormConfig,
  formColumns,
  formConfig,
} from './config/addOrEditFormConfig'

const emit = defineEmits(['refresh'])
const [dialogVis, dialogVisChange] = useToggle(false)
const [isEditVis, isEditVisChange] = useToggle(false)
const [inDictionaryValueList, inDictionaryValueListChange] = useToggle(false)
const data = ref({} as IDictionaryAddOrEditParams)
const formRef = ref<FormInst | null>(null)

const config = ref<FormConfigType>({} as FormConfigType)
const columns = ref<FormColumnType[]>([])
const formRules = ref<Record<string, any>>({})

function showModal(isEdit: boolean, isDictionaryValue: boolean, row?: IDictionaryAddOrEditParams) {
  isEditVisChange(isEdit)
  inDictionaryValueListChange(isDictionaryValue)
  columns.value = isDictionaryValue ? dictionaryValueFormColumns.value : formColumns.value
  config.value = isDictionaryValue ? dictionaryValueFormConfig : formConfig
  formRules.value = isDictionaryValue
    ? dictionaryValueFormConfig.rules || {}
    : formConfig.rules || {}

  if (isDictionaryValue) data.value.dictId = row?.dictId

  if (isEdit && row) Object.assign(data.value, row)

  dialogVisChange(true)
}

function cancelEvent() {
  data.value = {} as IDictionaryAddOrEditParams
  dialogVisChange(false)
}

async function submit() {
  if (!formRef.value) return

  formRef.value.validate((errors: any) => {
    if (!errors) {
      handleSubmit()
    }
  })
}

async function handleSubmit() {
  if (inDictionaryValueList.value) {
    const [, error] = await to(updateDictionaryDetail(data.value))

    if (error) {
      window.$message.error(error.message)
      return
    }
  } else {
    const [, error] = await to(updateDictionary(data.value))

    if (error) {
      window.$message.error(error.message)
      return
    }
  }
  emit('refresh')
  cancelEvent()
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
    :style="{ width: '60%' }"
    @close="cancelEvent"
  >
    <n-form
      ref="formRef"
      :model="data"
      :rules="formRules"
      label-placement="left"
      :label-width="120"
    >
      <template v-for="(item, index) in columns" :key="index">
        <n-form-item :label="item.label" :path="item.field">
          <template v-if="item.type === 'input'">
            <n-input
              v-model:value="data[item.field as keyof IDictionaryAddOrEditParams]"
              :placeholder="typeof item.placeholder === 'string' ? item.placeholder : '请输入'"
              clearable
            />
          </template>
          <template v-else-if="item.type === 'select'">
            <n-select
              v-model:value="data[item.field as keyof IDictionaryAddOrEditParams]"
              :options="item.options"
              :placeholder="typeof item.placeholder === 'string' ? item.placeholder : '请选择'"
              clearable
            />
          </template>
          <template v-else-if="item.type === 'textarea'">
            <n-input
              v-model:value="data[item.field as keyof IDictionaryAddOrEditParams]"
              type="textarea"
              :placeholder="typeof item.placeholder === 'string' ? item.placeholder : '请输入'"
            />
          </template>
        </n-form-item>
      </template>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="cancelEvent">取消</n-button>
        <n-button type="primary" @click="submit">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
