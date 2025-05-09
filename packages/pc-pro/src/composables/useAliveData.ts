import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const lastDataMap = new Map<string | symbol, any>()

export interface UseAliveDataReturn<T> {
  aliveData: Ref<T>
  reset: () => void
}

export function useAliveData<T extends Record<string, any>>(initData: T = {} as T, key?: string | symbol): UseAliveDataReturn<T> {
  const route = useRoute()
  const routeKey = key ?? route.name
  const mapKey = routeKey as string | symbol

  const lastData = lastDataMap.get(mapKey)
  const aliveData = ref(lastData || { ...initData }) as Ref<T>

  watch(
    aliveData,
    (v) => {
      lastDataMap.set(mapKey, v)
    },
    { deep: true },
  )

  return {
    aliveData,
    reset() {
      aliveData.value = { ...initData } as any
      lastDataMap.delete(mapKey)
    },
  }
}
