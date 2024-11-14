# Upload 上传组件

基于 ant-design-vue 的 Upload 组件封装,支持图片上传、预览和自定义验证等功能。

## 基本用法

```vue
<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([])

const onError = (error: unknown) => {
  console.error('上传出错:', error)
}
</script>

<template>
  <Upload
    v-model:file-list="fileList"
    :max-size="5"
    :max-count="3"
    :multiple="true"
    @error="onError"
  >
    <AButton>点击上传</AButton>
  </Upload>
</template>
```

## API

### Props

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
maxSize | 最大文件大小(MB) | `number` | `5`
maxCount | 最大上传数量 | `number` | `1`
allowedTypes | 允许的文件类型 | `string[]` | `['image/jpeg', 'image/png']`
multiple | 是否支持多选 | `boolean` | `false`
defaultFileList | 默认已上传的文件列表 | `UploadFile[]` | `[]`

### Events

事件名 | 说明 | 回调参数
--- | --- | ---
update:fileList | 文件列表更新时触发 | `(files: UploadFile[]) => void`
error | 上传失败时触发 | `(error: unknown) => void`

### Methods

方法名 | 说明 | 参数
--- | --- | ---
setDefaultFileList | 设置默认文件列表 | `(files: UploadFile[]) => void`

### Slots

插槽名 | 说明 | 参数
--- | --- | ---
default | 上传按钮的内容 | -
