<template>
  <CommonPage :show-header="false">
    <div class="wh-full flex">
      <n-result
        class="m-auto"
        status="403"
        title="403 禁止访问"
        description="抱歉，您暂无权限访问，请联系管理员开通权限。"
        size="large"
      >
        <template #footer>
          <n-button v-if="back" type="primary" ghost @click="router.replace(back)">
            返回上一页
          </n-button>
          <n-button type="primary" class="ml-20" @click="router.replace('/')">
            返回首页
          </n-button>
        </template>
      </n-result>
    </div>
  </CommonPage>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const back = history.state.back

if (history.state.from === 'permission-guard') {
  delete history.state.from
}
else if (route.query.path) {
  router.replace(route.query.path as string)
}
</script>
