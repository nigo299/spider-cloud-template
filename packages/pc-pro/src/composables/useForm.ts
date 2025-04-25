import type { Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'

// 表单规则类型
export interface FormRules {
  required: {
    required: boolean
    message: string
    trigger: string[]
  }
  [key: string]: any
}

// 表单返回值类型
export type UseFormReturn<T> = [
  Ref<any>,
  Ref<T>,
  () => Promise<void> | undefined,
  FormRules,
]

/**
 * 表单hooks
 * @param initFormData 初始表单数据
 * @returns [formRef, formModel, validation, rules]
 */
export function useForm<T extends Record<string, any>>(initFormData: T = {} as T): UseFormReturn<T> {
  const formRef = ref<any>(null)
  const formModel = ref(cloneDeep(initFormData)) as Ref<T>

  const rules: FormRules = {
    required: {
      required: true,
      message: '此为必填项',
      trigger: ['blur', 'change'],
    },
  }

  const validation = (): Promise<void> | undefined => {
    return formRef.value?.validate()
  }

  return [formRef, formModel, validation, rules]
}
