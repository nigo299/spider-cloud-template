import type { StorageOption } from '@/types'
import { createStorage } from './storage'

const prefixKey = 'vue-naive-admin_'

export function createLocalStorage(option: StorageOption = {}): ReturnType<typeof createStorage> {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: localStorage,
  })
}

export function createSessionStorage(option: StorageOption = {}): ReturnType<typeof createStorage> {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: sessionStorage,
  })
}

export const lStorage = createLocalStorage({ prefixKey })

export const sStorage = createSessionStorage({ prefixKey })
