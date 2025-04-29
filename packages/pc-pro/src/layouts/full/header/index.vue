<template>
  <AppCard class="flex items-center px-12" border-b="1px solid light_border dark:dark_border">
    <MenuCollapse />

    <BreadCrumb />

    <div class="ml-auto flex flex-shrink-0 items-center px-12 text-18">
      <ToggleTheme />
      <Fullscreen />
      <ThemeSetting class="mr-16" />
      <UserAvatar />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ToggleTheme } from '@/components'
import { BreadCrumb, Fullscreen, MenuCollapse, UserAvatar } from '@/layouts/components'

function handleLinkClick(link: string) {
  window.open(link)
}
</script>
