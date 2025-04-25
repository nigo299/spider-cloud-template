import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

// 定义一个可写的ComputedRef类型
interface WritableComputedRef<T> extends ComputedRef<T> {
  value: T
}

// 更新返回类型以使用WritableComputedRef
export type UseModalReturn = [Ref<any>, WritableComputedRef<boolean>]

/**
 * 模态框hooks
 * @returns [modalRef, okLoading]
 */
export function useModal(): UseModalReturn {
  const modalRef = ref<any>(null)

  const okLoading = computed({
    get() {
      return modalRef.value?.okLoading
    },
    set(v: boolean) {
      if (modalRef.value) {
        modalRef.value.okLoading = v
      }
    },
  }) as WritableComputedRef<boolean> // 使用类型断言确保类型正确

  return [modalRef, okLoading]
}
