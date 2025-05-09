import type { App, Directive, DirectiveBinding, VNode } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { router } from '@/router'
import { unref, withDirectives } from 'vue'

interface ButtonPermission {
  code: string
  name: string
}

const permission: Directive<HTMLElement, string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const currentRoute = unref(router.currentRoute) as RouteLocationNormalizedLoaded
    const btns = currentRoute.meta?.btns as ButtonPermission[] || []
    const permissionCodes = btns.map(item => item.code) || []

    if (!permissionCodes.includes(binding.value)) {
      el.remove()
    }
  },
}

export function setupDirectives(app: App): void {
  app.directive('permission', permission)
}

/**
 * 用于h函数使用自定义权限指令
 *
 * @param vnode 虚拟节点
 * @param code 权限码
 * @returns 返回一个包含权限指令的vnode
 *
 * 使用示例：withPermission(h('button', {class: 'text-red-500'}, '删除'), 'user:delete')
 *
 */
export function withPermission(vnode: VNode, code: string): VNode {
  return withDirectives(vnode, [[permission, code]])
}
