<script lang="ts" setup>
import { to } from '@web/common/util'
import type { UploadFile, UploadProps } from 'ant-design-vue'
import { Image, Upload, message } from 'ant-design-vue'
import { ref, watch } from 'vue'

import { upload } from '@/api/upload'

interface Props {
  maxSize?: number // 最大文件大小 (MB)
  maxCount?: number
  allowedTypes?: string[] // 允许的文件类型
  multiple?: boolean
  defaultFileList?: UploadFile[] // 初始文件列表（用于回显）
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 5,
  maxCount: 1,
  allowedTypes: () => ['image/jpeg', 'image/png'],
  multiple: false,
  defaultFileList: () => [],
})

const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  'error': [error: unknown]
}>()

// 状态管理
const fileList = ref<UploadFile[]>(props.defaultFileList)
const previewOpen = ref(false)
const previewImage = ref('')

// 获取base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// 上传前校验
const beforeUpload = (file: File) => {
  const isAllowedType = props.allowedTypes.includes(file.type)

  if (!isAllowedType) {
    message.error(`只允许上传 ${props.allowedTypes.join(', ')} 格式的文件`)
  }

  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize

  if (!isLtMaxSize) {
    message.error(`文件大小必须小于 ${props.maxSize}MB!`)
  }

  return isAllowedType && isLtMaxSize
}

// 自定义上传
const customRequest = async (options: any) => {
  try {
    const [res, err] = await to(upload(options.file))

    if (!err) {
      options.onSuccess(res.viewPath, options.file)
      const fileData: UploadFile = {
        uid: res.viewPath,
        name: options.file.name as string,
        status: 'done',
        url: res.viewPath,
      }

      const updatedFileList = props.multiple
        ? [...fileList.value, fileData]
        : [fileData]

      fileList.value = updatedFileList
      emit('update:fileList', updatedFileList)
    }
  }
  catch (error) {
    emit('error', error)
    message.error('文件上传失败')
  }
}

// 删除文件
const onRemoveFile = (file: UploadFile) => {
  const newFileList = fileList.value.filter(v => v.uid !== file.uid)
  fileList.value = newFileList
  emit('update:fileList', newFileList)
}

// 预览文件
const onPreviewFile = async (file: UploadFile) => {
  try {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }
    previewImage.value = file.url || (file.preview as string)
    previewOpen.value = true
  }
  catch (err) {
    console.error('预览文件出错:', err)
  }
}

// 设置默认文件列表
const setDefaultFileList = (newFileList: UploadFile[]) => {
  fileList.value = newFileList
}

// 暴露方法给父组件
defineExpose({
  setDefaultFileList,
})

// 监听默认文件列表变化
watch(() => props.defaultFileList, (newVal) => {
  fileList.value = newVal
})
</script>

<template>
  <div>
    <Upload
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :file-list="fileList"
      :multiple="multiple"
      @preview="onPreviewFile"
      @remove="onRemoveFile"
    >
      <slot v-if="multiple ? fileList.length < maxCount : fileList.length === 0" />
    </Upload>

    <Image
      v-if="previewImage"
      :src="previewImage"
      :wrapper-style="{ display: 'none' }"
      :preview="{
        visible: previewOpen,
        onVisibleChange: (visible) => previewOpen = visible,
      }"
    />
  </div>
</template>

<style lang="less" scoped>
// 可以添加需要的样式
</style>
