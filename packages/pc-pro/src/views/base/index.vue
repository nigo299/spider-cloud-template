<template>
  <CommonPage show-footer>
    <n-space size="large">
      <n-card title="按钮 Button">
        <n-space>
          <n-button>Default</n-button>
          <n-button type="tertiary">
            Tertiary
          </n-button>
          <n-button type="primary">
            Primary
          </n-button>
          <n-button type="info">
            Info
          </n-button>
          <n-button type="success">
            Success
          </n-button>
          <n-button type="warning">
            Warning
          </n-button>
          <n-button type="error">
            Error
          </n-button>
        </n-space>
      </n-card>

      <n-card title="带 Icon 的按钮">
        <n-space>
          <n-button type="info">
            <i class="i-material-symbols:add mr-4 text-18" />
            新增
          </n-button>
          <n-button type="error">
            <i class="i-material-symbols:delete-outline mr-4 text-18" />
            删除
          </n-button>
          <n-button type="warning">
            <i class="i-material-symbols:edit-outline mr-4 text-18" />
            编辑
          </n-button>
          <n-button type="primary">
            <i class="i-majesticons:eye-line mr-4 text-18" />
            查看
          </n-button>
        </n-space>
      </n-card>
    </n-space>

    <n-space size="large" mt-30>
      <n-card min-w-340 title="通知 Notification">
        <n-space>
          <n-button @click="notify('info')">
            信息
          </n-button>
          <n-button @click="notify('success')">
            成功
          </n-button>
          <n-button @click="notify('warning')">
            警告
          </n-button>
          <n-button @click="notify('error')">
            错误
          </n-button>
        </n-space>
      </n-card>

      <n-card min-w-340 title="确认弹窗 Dialog">
        <n-button type="error" @click="handleDelete">
          <i class="i-mi:delete mr-4" />
          删除
        </n-button>
      </n-card>

      <n-card min-w-340 title="消息提醒 Message">
        <n-space>
          <n-button :loading="loading" type="primary" @click="handleLogin">
            <i v-show="!loading" class="i-mdi:login mr-4" />
            登录
          </n-button>
          <n-button type="error" @click="handleMultiMessage">
            多个错误提醒
          </n-button>
        </n-space>
      </n-card>
    </n-space>
  </CommonPage>
</template>

<script setup lang="ts">
import { sleep } from '@/utils'
import { ref } from 'vue'

type NotificationType = 'info' | 'success' | 'warning' | 'error'

function handleDelete(): void {
  window.$dialog.confirm({
    content: '确认删除？',
    confirm() {
      window.$message.success('删除成功')
    },
    cancel() {
      window.$message.warning('已取消')
    },
  })
}

const loading = ref<boolean>(false)
async function handleLogin(): Promise<void> {
  loading.value = true
  window.$message.loading('登录中...', { key: 'login' })
  await sleep(2000)
  window.$message.error('登录失败', { key: 'login' })
  await sleep(500)
  window.$message.loading('正在尝试重新登录...', { key: 'login' })
  await sleep(2000)
  window.$message.success('登录成功', { key: 'login' })
  loading.value = false
}

function handleMultiMessage(): void {
  // 使用类型断言避免类型错误
  (window.$message.error as any)(['用户名不能为空！', '密码不能为空！', '密码必须大于6位！'])
}

function notify(type: NotificationType): void {
  window.$notification[type]({
    content: '说点啥呢',
    meta: '想不出来',
    duration: 2500,
    keepAliveOnHover: true,
  })
}
</script>
