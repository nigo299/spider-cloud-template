<template>
  <CommonPage :show-header="false">
    <div class="wh-full flex">
      <n-result m-auto status="404" title="404 您访问的页面不存在" description="" size="large">
        <template #footer>
          <n-button type="primary" ghost @click="replace('/')"> 返回首页 </n-button>
        </template>
      </n-result>
    </div>
  </CommonPage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const { replace } = useRouter()
</script>
