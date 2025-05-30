<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import { login, type LoginParam } from './api'

import { useAuthStore } from '@/store'
import { lStorage } from '@/utils'
import { encrypt } from '@/utils/encrypt'
import { to } from '@/utils/to'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const title = import.meta.env.VITE_TITLE

const loginInfo = ref({
  username: '',
  password: '',
})

const localLoginInfo = lStorage.get('loginInfo')

if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

const isRemember = useStorage('isRemember', true)
const loading = ref(false)

function convertLoginParams(params: typeof loginInfo.value): LoginParam {
  return {
    account: params.username,
    password: encrypt(params.password) || '',
    loginType: 1,
  }
}

async function handleLogin() {
  const { username, password } = loginInfo.value

  if (!username || !password) {
    return window.$message.warning('请输入用户名和密码')
  }

  try {
    loading.value = true
    window.$message.loading('正在验证，请稍后...', { key: 'login' })
    const params = convertLoginParams(loginInfo.value)
    const [data, err] = await to(login(params))

    if (!err) {
      const token = data?.data?.token
      const userName = data?.data?.name
      const userAccount = data?.data?.account

      if (isRemember.value) {
        lStorage.set('loginInfo', { username, password })
      } else {
        lStorage.remove('loginInfo')
      }
      onLoginSuccess(token, userName, userAccount)
    } else {
      window.$message.destroy('login')
    }
  } finally {
    loading.value = false
  }
}

async function onLoginSuccess(token: string, userName?: string, userAccount?: string) {
  authStore.setToken({ accessToken: token, userName, userAccount })
  sessionStorage.setItem(import.meta.env.VITE_TOKEN, token)

  if (userName) {
    sessionStorage.setItem('userName', userName)
  }
  window.$message.loading('登录中...', { key: 'login' })

  try {
    window.$message.success('登录成功', { key: 'login' })

    if (route.query.redirect) {
      const path = route.query.redirect as string
      delete route.query.redirect
      router.push({ path, query: route.query })
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    window.$message.destroy('login')
  }
}
</script>

<template>
  <div class="wh-full flex-col bg-[url(@/assets/images/login_bg.webp)] bg-cover">
    <div
      class="m-auto max-w-700 min-w-345 f-c-c rounded-8 bg-opacity-20 bg-cover p-12 card-shadow auto-bg"
    >
      <div class="hidden w-380 px-20 py-35 md:block">
        <img src="@/assets/images/login_banner.webp" class="w-full" alt="login_banner" />
      </div>

      <div class="w-320 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img src="@/assets/images/logo.png" class="mr-12 h-50" />
          {{ title }}
        </h2>
        <n-input
          v-model:value="loginInfo.username"
          autofocus
          class="mt-32 h-40 items-center"
          placeholder="请输入用户名"
          :maxlength="20"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20" />
          </template>
        </n-input>
        <n-input
          v-model:value="loginInfo.password"
          class="mt-20 h-40 items-center"
          type="password"
          show-password-on="mousedown"
          placeholder="请输入密码"
          :maxlength="20"
          @keydown.enter="handleLogin()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20" />
          </template>
        </n-input>

        <n-checkbox
          class="mt-20"
          :checked="isRemember"
          label="记住我"
          :on-update:checked="val => (isRemember = val)"
        />

        <div class="mt-20 flex items-center">
          <n-button
            class="h-40 flex-1 rounded-5 text-16"
            type="primary"
            :loading="loading"
            @click="handleLogin()"
          >
            登录
          </n-button>
        </div>
      </div>
    </div>

    <TheFooter class="py-12" />
  </div>
</template>
