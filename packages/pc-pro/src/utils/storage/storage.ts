import type { StorageData, StorageOption } from '@/types'
import { isNullOrUndef } from '@/utils'

class Storage {
  private storage: globalThis.Storage
  private prefixKey: string

  constructor(option: StorageOption) {
    this.storage = option.storage || sessionStorage
    this.prefixKey = option.prefixKey || ''
  }

  private getKey(key: string): string {
    return `${this.prefixKey}${key}`.toLowerCase()
  }

  set<T>(key: string, value: T, expire?: number): void {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: !isNullOrUndef(expire) ? new Date().getTime() + expire * 1000 : null,
    })
    this.storage.setItem(this.getKey(key), stringData)
  }

  get<T = any>(key: string): T | null {
    const { value } = this.getItem<T>(key, null)
    return value
  }

  getItem<T = any>(key: string, def: { value: T | null, time?: number } | null = null): { value: T | null, time?: number } {
    const val = this.storage.getItem(this.getKey(key))
    if (!val)
      return def as { value: T | null, time?: number }
    try {
      const data = JSON.parse(val) as StorageData<T>
      const { value, time, expire } = data
      if (isNullOrUndef(expire) || expire > new Date().getTime()) {
        return { value, time }
      }
      this.remove(key)
      return def as { value: T | null, time?: number }
    }
    catch (error) {
      console.error(error)
      this.remove(key)
      return def as { value: T | null, time?: number }
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  clear(): void {
    this.storage.clear()
  }
}

export function createStorage({ prefixKey = '', storage = sessionStorage }: StorageOption): Storage {
  return new Storage({ prefixKey, storage })
}
