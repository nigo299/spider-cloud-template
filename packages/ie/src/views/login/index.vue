<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import useSWRV from 'swrv'
import { onMounted, reactive, ref } from 'vue'

import { getToken, login } from '@/api/login'
import { disableSession } from '@/api/user'
import { TOKEN_KEY } from '@/common/js/config'
import CopyRight from '@/components/CopyRight/index.vue'
import type { LoginParam } from '@/interface/login'
import router from '@/router'
import { to } from '@/utils'
import { NotRevalidateOption } from '@/utils/swrv'

const formState = reactive<LoginParam>({
  account: '',
  password: '',
  loginType: 1,
})
const [submit, submitToggle] = useToggle(false)
const isProd = ref(import.meta.env.MODE === 'build' || import.meta.env.MODE === 'pre')

function onFinish() {
  if (submit.value)
    return
  loginIn()
}

async function buildLogin() {
  const [data, err] = await to(getToken())

  if (!err) {
    sessionStorage.setItem(TOKEN_KEY, data.token)
  }
}

onMounted(async () => {
  if (isProd.value) {
    await buildLogin()
    router.replace('/indicatorDashboard')
  }
})

async function loginIn() {
  submitToggle(true)
  let loginParam = { ...formState }

  if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'production') {
    loginParam = {
      ...formState,
      password: import.meta.env.VITE_APP_ENCRYPTPASSWORD,
    }
  }
  const [data, err] = await to(login(loginParam))

  if (!err) {
    sessionStorage.setItem(TOKEN_KEY, data.token)
    submitToggle(false)
    router.replace('/indicatorDashboard')
  }
  else {
    submitToggle(false)
  }
}
</script>

<template>
  <div>
    <el-row v-if="!isProd" class="min-h-screen flex">
      <el-col :span="12" class="bg-[#00706b] h-screen" />
      <el-col :span="12" class="bg-[#ffffff] relative">
        <div class="w-full h-full flex justify-center items-center">
          <el-form class="w-1/2" :model="formState" name="basic" autocomplete="off" @keyup.enter.native="onFinish">
            <el-form-item prop="account" :rules="[{ required: true, message: '请输入账号' }]">
              <el-input v-model="formState.account" size="large" clearable placeholder="请输入账号" />
            </el-form-item>

            <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码' }]">
              <el-input v-model="formState.password" type="password" size="large" clearable placeholder="请输入密码" />
            </el-form-item>
            <el-form-item>
              <el-button size="large" class="w-full" round type="primary" :loading="submit" @click="onFinish">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="absolute bottom-8 w-full flex justify-center">
          <CopyRight />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
