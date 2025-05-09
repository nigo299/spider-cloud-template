<template>
  <CommonPage>
    <n-card title="菜单 1-B 页面" :bordered="false">
      <n-space vertical>
        <n-alert type="success" :show-icon="true">
          <template #header>
            <div class="text-16">这是第二组一级菜单示例</div>
          </template>
          这是菜单 1-B 的主页面，它包含一个子菜单：
          <n-ul>
            <n-li>
              <n-button
                text
                type="primary"
                @click="router.push('/multi-level/level-1b/level-1b-1')"
              >
                菜单 1-B-1（单个子菜单）
              </n-button>
            </n-li>
          </n-ul>
        </n-alert>

        <n-divider>与其他一级菜单的导航</n-divider>
        <n-button @click="router.push('/multi-level/level-1a')"> 访问菜单 1-A </n-button>

        <n-card title="子路由内容" embedded class="mt-20">
          <router-view></router-view>
        </n-card>
      </n-space>
    </n-card>
  </CommonPage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'Level1B' })

const router = useRouter()
</script>
