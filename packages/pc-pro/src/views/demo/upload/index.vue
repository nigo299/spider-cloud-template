<template>
  <CommonPage>
    <n-upload
      class="mx-auto w-[75%] p-20 text-center"
      :custom-request="handleUpload"
      :show-file-list="false"
      accept=".png,.jpg,.jpeg"
      @before-upload="onBeforeUpload"
    >
      <n-upload-dragger>
        <div class="h-150 f-c-c flex-col">
          <i class="i-mdi:upload mb-12 text-68 color-primary" />
          <n-text class="text-14 color-gray">
            点击或者拖动文件到该区域来上传
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>

    <n-card v-if="imgList && imgList.length" class="mt-16 items-center">
      <n-image-group>
        <n-space justify="space-between" align="center">
          <n-card v-for="(item, index) in imgList" :key="index" class="w-280 hover:card-shadow">
            <div class="h-160 f-c-c">
              <n-image width="200" :src="item.url" />
            </div>
            <n-space class="mt-16" justify="space-evenly">
              <n-button dashed type="primary" @click="copy(item.url)">
                url
              </n-button>
              <n-button dashed type="primary" @click="copy(`![${item.fileName}](${item.url})`)">
                MD
              </n-button>
              <n-button
                dashed
                type="primary"
                @click="copy(`&lt;img src=&quot;${item.url}&quot; /&gt;`)"
              >
                img
              </n-button>
            </n-space>
          </n-card>
          <div v-for="i in 4" :key="i" class="w-280" />
        </n-space>
      </n-image-group>
    </n-card>
  </CommonPage>
</template>

<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import type { Ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { reactive, watch } from 'vue'

defineOptions({ name: 'ImgUpload' })

/**
 * 图片项目的接口
 */
interface ImageItem {
  /** 图片URL */
  url: string
  /** 文件名称 */
  fileName?: string
}

/**
 * useClipboard hook返回值的类型
 */
interface ClipboardReturn {
  copy: (text: string) => Promise<void>
  copied: Ref<boolean>
  isSupported: Ref<boolean>
}

const { copy, copied }: ClipboardReturn = useClipboard()

// 图片列表
const imgList = reactive<ImageItem[]>([
  { url: 'https://img.isme.top/isme/67208863145ef.jpg' },
  { url: 'https://img.isme.top/isme/67208ab2a9de0.jpg' },
  { url: 'https://img.isme.top/isme/67208ab4c6596.jpg' },
])

// 监听复制状态
watch(copied, (val: boolean) => {
  if (val)
    window.$message.success('已复制到剪切板')
})

/**
 * 上传前验证文件
 * @param data 上传的文件数据
 * @returns 是否允许上传
 */
function onBeforeUpload(data: { file: UploadFileInfo }): boolean {
  const { file } = data
  if (!file.type?.startsWith('image/')) {
    window.$message.error('只能上传图片')
    return false
  }
  return true
}

/**
 * 自定义上传处理
 * @param options 上传选项
 */
async function handleUpload(options: UploadCustomRequestOptions): Promise<void> {
  const { file, onFinish } = options
  if (!file || !file.type) {
    window.$message.error('请选择文件')
    return
  }

  // 模拟上传
  window.$message.loading('上传中...')
  setTimeout(() => {
    window.$message.success('上传成功')
    imgList.push({ fileName: file.name, url: URL.createObjectURL(file.file as File) })
    onFinish()
  }, 1500)
}
</script>
