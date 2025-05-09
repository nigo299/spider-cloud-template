import type { LoadingBarApiType } from '@/types'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { useRouterStore } from './router'

// 在顶层声明全局变量，避免在全局作用域中使用var

declare const $loadingBar: LoadingBarApiType

interface TabItem {
  path: string
  keepAlive?: boolean
  [key: string]: any
}

interface TabState {
  tabs: TabItem[]
  activeTab: string
  reloading: boolean
}

export const useTabStore = defineStore('tab', {
  state: (): TabState => ({
    tabs: [],
    activeTab: '',
    reloading: false,
  }),
  getters: {
    activeIndex(): number {
      return this.tabs.findIndex(item => item.path === this.activeTab)
    },
  },
  actions: {
    async setActiveTab(path: string): Promise<void> {
      await nextTick() // tab栏dom更新完再设置激活，让tab栏定位到新增的tab上生效
      this.activeTab = path
    },
    setTabs(tabs: TabItem[]): void {
      this.tabs = tabs
    },
    addTab(tab: TabItem = { path: '' }): void {
      const findIndex = this.tabs.findIndex(item => item.path === tab.path)
      if (findIndex !== -1) {
        this.tabs.splice(findIndex, 1, tab)
      }
      else {
        this.setTabs([...this.tabs, tab])
      }
      this.setActiveTab(tab.path)
    },
    async reloadTab(path: string, keepAlive?: boolean): Promise<void> {
      const findItem = this.tabs.find(item => item.path === path)
      if (!findItem)
        return
      // 更新key可让keepAlive失效
      if (keepAlive)
        findItem.keepAlive = false
      $loadingBar.start()
      this.reloading = true
      await nextTick()
      this.reloading = false
      findItem.keepAlive = !!keepAlive
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 })
        $loadingBar.finish()
      }, 100)
    },
    async removeTab(path: string): Promise<void> {
      this.setTabs(this.tabs.filter(tab => tab.path !== path))
      if (path === this.activeTab) {
        useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path)
      }
    },
    removeOther(curPath: string = this.activeTab): void {
      this.setTabs(this.tabs.filter(tab => tab.path === curPath))
      if (curPath !== this.activeTab) {
        useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path)
      }
    },
    removeLeft(curPath: string): void {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index >= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab)) {
        useRouterStore().router?.push(filterTabs[filterTabs.length - 1].path)
      }
    },
    removeRight(curPath: string): void {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index <= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab)) {
        useRouterStore().router?.push(filterTabs[filterTabs.length - 1].path)
      }
    },
    resetTabs(): void {
      this.$reset()
    },
  },
  persist: {
    pick: ['tabs'],
    storage: sessionStorage,
  },
} as const)
