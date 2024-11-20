<script setup lang="ts">
const appTitle = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <Page>
    <div class="flex justify-center items-center h-[calc(100vh-200px)]">
      <span>欢迎使用{{ appTitle }}</span>
    </div>
  </Page>
</template>

<style lang="less" scoped></style>
