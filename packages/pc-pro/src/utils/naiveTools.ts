import type { MessageApi, DialogApi, ConfigProviderProps } from 'naive-ui'
import type { DialogOptions } from 'naive-ui/es/dialog'
import type { MessageOptions, MessageType } from 'naive-ui/es/message'
import { useAppStore } from '@/store'
import { isNullOrUndef } from '@/utils'

import * as naiveUI from 'naive-ui'
import { computed } from 'vue'

interface MessageInstance {
  destroy: () => void
  type: MessageType
  content: string
}

interface MessageKey {
  [key: string]: MessageInstance | undefined
}

interface RemoveTimer {
  [key: string]: ReturnType<typeof setTimeout> | undefined
}

// 扩展MessageOptions接口以包含key属性
interface ExtendedMessageOptions extends MessageOptions {
  key?: string
  duration?: number
}

/**
 * 封装消息提示
 * @param NMessage naive-ui消息实例
 * @returns 消息实例
 */
export function setupMessage(NMessage: MessageApi): {
  loading: (content: string | string[], option?: ExtendedMessageOptions) => void
  success: (content: string | string[], option?: ExtendedMessageOptions) => void
  error: (content: string | string[], option?: ExtendedMessageOptions) => void
  info: (content: string | string[], option?: ExtendedMessageOptions) => void
  warning: (content: string | string[], option?: ExtendedMessageOptions) => void
  destroy: (key: string, duration?: number) => void
} {
  class Message {
    static instance: Message
    private message: MessageKey = {}
    private removeTimer: RemoveTimer = {}

    constructor() {
      // 单例模式
      if (Message.instance) return Message.instance
      Message.instance = this
    }

    removeMessage(key: string, duration = 5000): void {
      this.removeTimer[key] && clearTimeout(this.removeTimer[key])
      this.removeTimer[key] = setTimeout(() => {
        this.message[key]?.destroy()
      }, duration)
    }

    destroy(key: string, duration = 200): void {
      setTimeout(() => {
        this.message[key]?.destroy()
      }, duration)
    }

    showMessage(
      type: MessageType,
      content: string | string[],
      option: ExtendedMessageOptions = {}
    ): void {
      if (Array.isArray(content)) {
        content.forEach((msg) => this.showMessage(type, msg, option))
        return
      }

      if (!option.key) {
        if (type === 'loading') NMessage.loading(content, option)
        else if (type === 'success') NMessage.success(content, option)
        else if (type === 'error') NMessage.error(content, option)
        else if (type === 'info') NMessage.info(content, option)
        else if (type === 'warning') NMessage.warning(content, option)
        return
      }

      const currentMessage = this.message[option.key]
      if (currentMessage) {
        currentMessage.type = type
        currentMessage.content = content
      } else {
        const messageMethod =
          type === 'loading'
            ? NMessage.loading
            : type === 'success'
              ? NMessage.success
              : type === 'error'
                ? NMessage.error
                : type === 'info'
                  ? NMessage.info
                  : NMessage.warning

        this.message[option.key] = messageMethod(content, {
          ...option,
          duration: 0,
          onAfterLeave: () => {
            delete this.message[option.key as string]
          },
        }) as MessageInstance
      }
      this.removeMessage(option.key, option.duration)
    }

    loading(content: string | string[], option: ExtendedMessageOptions = {}): void {
      this.showMessage('loading', content, option)
    }

    success(content: string | string[], option: ExtendedMessageOptions = {}): void {
      this.showMessage('success', content, option)
    }

    error(content: string | string[], option: ExtendedMessageOptions = {}): void {
      this.showMessage('error', content, option)
    }

    info(content: string | string[], option: ExtendedMessageOptions = {}): void {
      this.showMessage('info', content, option)
    }

    warning(content: string | string[], option: ExtendedMessageOptions = {}): void {
      this.showMessage('warning', content, option)
    }
  }

  return new Message()
}

/**
 * 封装对话框
 * @param NDialog naive-ui对话框实例
 * @returns 对话框实例
 */
export function setupDialog(NDialog: DialogApi): DialogApi & {
  confirm: (
    option?: DialogOptions & { confirm?: () => void; cancel?: () => void; type?: string }
  ) => any
} {
  const dialog = NDialog as DialogApi & {
    confirm: (
      option?: DialogOptions & { confirm?: () => void; cancel?: () => void; type?: string }
    ) => any
  }

  dialog.confirm = function (
    option: DialogOptions & { confirm?: () => void; cancel?: () => void; type?: string } = {}
  ): any {
    const showIcon = !isNullOrUndef(option.title)
    const type = (option.type as 'info' | 'success' | 'warning' | 'error') || 'warning'

    return type === 'info'
      ? NDialog.info({
          showIcon,
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: option.confirm,
          onNegativeClick: option.cancel,
          onMaskClick: option.cancel,
          ...option,
        })
      : type === 'success'
        ? NDialog.success({
            showIcon,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: option.confirm,
            onNegativeClick: option.cancel,
            onMaskClick: option.cancel,
            ...option,
          })
        : type === 'warning'
          ? NDialog.warning({
              showIcon,
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: option.confirm,
              onNegativeClick: option.cancel,
              onMaskClick: option.cancel,
              ...option,
            })
          : NDialog.error({
              showIcon,
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: option.confirm,
              onNegativeClick: option.cancel,
              onMaskClick: option.cancel,
              ...option,
            })
  }

  return dialog
}

/**
 * 设置全局naive-ui API
 */
export function setupNaiveDiscreteApi(): void {
  const appStore = useAppStore()
  const configProviderProps = computed<ConfigProviderProps>(() => ({
    theme: appStore.isDark ? naiveUI.darkTheme : undefined,
    themeOverrides: useAppStore().naiveThemeOverrides,
  }))

  const { message, dialog, notification, loadingBar } = naiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    { configProviderProps }
  )

  window.$loadingBar = loadingBar
  window.$notification = notification
  window.$message = setupMessage(message)
  window.$dialog = setupDialog(dialog)
}
