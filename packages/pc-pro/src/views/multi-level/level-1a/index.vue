<template>
  <CommonPage>
    <n-card title="菜单 1-A 页面" :bordered="false">
      <n-space vertical>
        <n-alert type="info" :show-icon="true">
          <template #header>
            <div class="text-16">这是一个多级菜单示例</div>
          </template>
          这是菜单 1-A 的主页面，它包含两个子菜单：
          <n-ul>
            <n-li>
              <n-button
                text
                type="primary"
                @click="router.push('/multi-level/level-1a/level-1a-1')"
              >
                菜单 1-A-1
              </n-button>
            </n-li>
            <n-li>
              <n-button
                text
                type="primary"
                @click="router.push('/multi-level/level-1a/level-1a-2')"
              >
                菜单 1-A-2
              </n-button>
            </n-li>
          </n-ul>
        </n-alert>

        <n-card title="子路由内容" embedded>
          <router-view></router-view>
        </n-card>
      </n-space>
    </n-card>
  </CommonPage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'Level1A' })

const router = useRouter()
</script>
