import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'
import { useForm, useModal } from './index'

export interface CrudOptions<T, D = any> {
  name: string
  initForm?: Partial<T>
  doCreate?: (form: T) => Promise<D>
  doDelete?: (id: number | string) => Promise<D>
  doUpdate?: (form: T) => Promise<D>
  refresh: (data?: D, isDelete?: boolean) => void
}

export interface ModalOpenOptions<T> {
  action: 'add' | 'edit' | 'view' | string
  row?: Partial<T>
  title?: string
  onOk?: () => Promise<boolean | void>
  [key: string]: any
}

export interface ActionConfig {
  api: () => Promise<any>
  cb: () => void
}

export interface DialogConfirmOptions {
  content?: string
  title?: string
  positiveText?: string
  negativeText?: string
  onPositiveClick?: () => void
  [key: string]: any
}

const ACTIONS = {
  view: '查看',
  edit: '编辑',
  add: '新增',
}

/**
 * CRUD操作hooks
 */
export function useCrud<T extends Record<string, any>, D = any>(options: CrudOptions<T, D>) {
  const { name, initForm = {} as Partial<T>, doCreate, doDelete, doUpdate, refresh } = options

  const modalAction = ref<string>('')
  const [modalRef, okLoading] = useModal()
  const [modalFormRef, modalForm, validation] = useForm<T>(initForm as T)

  /** 新增 */
  function handleAdd(row: Partial<T> = {}, title?: string) {
    handleOpen({
      action: 'add',
      title,
      row: Object.assign({}, cloneDeep(initForm), cloneDeep(row)),
    })
  }

  /** 修改 */
  function handleEdit(row: Partial<T>, title?: string) {
    handleOpen({ action: 'edit', title, row })
  }

  /** 查看 */
  function handleView(row: Partial<T>, title?: string) {
    handleOpen({ action: 'view', title, row })
  }

  /** 打开modal */
  function handleOpen(options: ModalOpenOptions<T>) {
    const { action, row, title, onOk } = options
    modalAction.value = action
    modalForm.value = { ...row } as any
    modalRef.value?.open({
      ...options,
      async onOk() {
        if (typeof onOk === 'function') {
          return await onOk()
        } else {
          return await handleSave()
        }
      },
      title: title ?? (ACTIONS[modalAction.value as keyof typeof ACTIONS] || '') + name,
    })
  }

  /** 保存 */
  async function handleSave(customAction?: ActionConfig): Promise<boolean> {
    if (!customAction && !['edit', 'add'].includes(modalAction.value)) {
      return false
    }

    await validation()

    const actions: Record<string, ActionConfig> = {
      add: {
        api: () => {
          if (doCreate) return doCreate(modalForm.value)
          return Promise.resolve() as Promise<any>
        },
        cb: () => {
          window.$message?.success('新增成功')
        },
      },
      edit: {
        api: () => {
          if (doUpdate) return doUpdate(modalForm.value)
          return Promise.resolve() as Promise<any>
        },
        cb: () => {
          window.$message?.success('保存成功')
        },
      },
    }

    const action = customAction || actions[modalAction.value]

    if (!action) return false

    try {
      okLoading.value = true
      const data = await action.api()
      action.cb()

      okLoading.value = false
      data && refresh(data)
      return true
    } catch (error) {
      console.error(error)
      okLoading.value = false
      return false
    }
  }

  /** 删除 */
  function handleDelete(id: number | string, confirmOptions?: DialogConfirmOptions): void {
    if (id === undefined && id !== 0) return

    const d = window.$dialog?.warning({
      content: '确定删除？',
      title: '提示',
      positiveText: '确定',
      negativeText: '取消',
      async onPositiveClick() {
        try {
          d.loading = true
          if (doDelete) {
            const data = await doDelete(id)
            window.$message?.success('删除成功')
            refresh(data, true)
          }
          d.loading = false
        } catch (error) {
          console.error(error)
          d.loading = false
        }
      },
      ...confirmOptions,
    })
  }

  return {
    modalRef,
    modalFormRef,
    modalAction,
    modalForm,
    okLoading,
    validation,
    handleAdd,
    handleDelete,
    handleEdit,
    handleView,
    handleOpen,
    handleSave,
  }
}
