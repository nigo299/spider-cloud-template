const DESIGNWIDTH = 9800
const DESIGNHEIGHT = 2100
/** 解析px */
export function pixelDecimalTransformer(px: string | number) {
  if (!px)
    return 0

  if (typeof px === 'number')
    return px

  return +px.replace('px', '')
}

/**
 * 转换成当前屏幕真实的px
 * @param px 目标像素
 * @param designWidth 设计图宽度
 * @returns 转换之后的真实像素
 */
export function trans2RealPx(px: number, designWidth = DESIGNWIDTH) {
  return (window.innerWidth / designWidth) * px
}

/**
 * px转换成vw
 * @param px 目标像素
 * @param designWidth 设计图宽度
 */
export function px2vw(px: number, designWidth = DESIGNWIDTH) {
  return (trans2RealPx(px, designWidth) * 100) / window.innerWidth
}

/**
 * px转换成vw单位
 * @param px
 * @param designWidth
 */
export function px2vwUnit(px: string | number, designWidth = DESIGNWIDTH) {
  return `${px2vw(pixelDecimalTransformer(px), designWidth)}vw`
}

/**
 * 转换成当前屏幕真实的px
 * @param px 目标像素
 * @param designHeight 设计图高度
 * @returns 转换之后的真实像素
 */
export function trans2RealHPx(px: number, designHeight = DESIGNHEIGHT) {
  const screenHeight = window.innerHeight
  const heightRatio = screenHeight / designHeight
  return heightRatio * px
}

/**
 * px转换成vh单位
 * @param px
 * @param designHeight
 */
export function px2vhUnit(px: string | number, designHeight = DESIGNHEIGHT) {
  return `${(trans2RealHPx(pixelDecimalTransformer(px), designHeight) / window.innerHeight) * 100}vh`
}
