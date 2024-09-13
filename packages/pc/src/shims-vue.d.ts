declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, any>
  export default component
}
declare module 'vue/types/vue' {
  import type { Route } from 'vue-router'
  import type VueRouter from 'vue-router'

  interface Vue {
    $router: VueRouter
    $route: Route
  }
}

declare module '*.svg' {
  const content: string
  export default content
}
