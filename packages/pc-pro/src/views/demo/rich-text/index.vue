<template>
  <CommonPage>
    <div class="h-full flex-col" border="1 solid #ccc" dark:bg-dark>
      <WangToolbar
        border-b="1px solid #ccc"
        :editor="editorRef"
        :default-config="toolbarConfig"
        mode="default"
      />
      <WangEditor
        v-model="valueHtml"
        style="flex: 1; overflow-y: hidden"
        :default-config="editorConfig"
        mode="default"
        @on-created="handleCreated"
      />
    </div>
  </CommonPage>
</template>

<script setup lang="ts">
import '@wangeditor-next/editor/dist/css/style.css'
import { Editor as WangEditor, Toolbar as WangToolbar } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor } from '@wangeditor-next/editor'
import { ref, shallowRef } from 'vue'

defineOptions({ name: 'RichTextEditor' })
const editorRef = shallowRef()
const toolbarConfig = { excludeKeys: ['fullScreen'] }
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }
const valueHtml = ref('')

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style>
html.dark {
  --w-e-textarea-bg-color: #333;
  --w-e-textarea-color: #fff;
  --w-e-toolbar-bg-color: #333;
  --w-e-toolbar-color: #fff;
  --w-e-toolbar-active-bg-color: #666;
  --w-e-toolbar-active-color: #fff;
  /* ...其他... */
}
</style>
