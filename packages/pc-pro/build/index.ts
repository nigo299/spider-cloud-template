import type { GlobOptionsWithFileTypesFalse } from 'glob'
import path from 'node:path'
import { globSync } from 'glob'
import dynamicIcons from '../src/assets/icons/dynamic-icons'

/**
 * @usage 生成icons, 用于 unocss safelist，以支持页面动态渲染自定义图标
 */
export function getIcons(): string[] {
  const globOptions: GlobOptionsWithFileTypesFalse = { nodir: true }
  const feFiles: string[] = globSync('src/assets/icons/feather/*.svg', globOptions)
  const meFiles: string[] = globSync('src/assets/icons/isme/*.svg', globOptions)
  const feIcons: string[] = feFiles.map((filePath) => {
    const fileName = path.basename(filePath) // 获取文件名，包括后缀
    const fileNameWithoutExt = path.parse(fileName).name // 获取去除后缀的文件名
    return `i-fe:${fileNameWithoutExt}`
  })
  const meIcons: string[] = meFiles.map((filePath) => {
    const fileName = path.basename(filePath) // 获取文件名，包括后缀
    const fileNameWithoutExt = path.parse(fileName).name // 获取去除后缀的文件名
    return `i-me:${fileNameWithoutExt}`
  })

  return [...dynamicIcons, ...feIcons, ...meIcons]
}

/**
 * @usage 生成.vue文件路径列表，用于添加菜单时可下拉选择对应的.vue文件路径，防止手动输入报错
 */
export function getPagePathes(): string[] {
  const files: string[] = globSync('src/views/**/*.vue')
  return files.map(item => `/${path.normalize(item).replace(/\\/g, '/')}`)
}
