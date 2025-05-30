/**
 * 判断当前所属浏览器。
 *
 * @returns {string} 返回当前浏览器环境，可能的值有：
 * - '微信'
 * - '支付宝'
 * - 'iOS浏览器'
 * - 'Android浏览器'
 * - '未知环境'
 */

export function parseBrowser(): 'notBrowser' | 'wechat' | 'ali' | 'iOS' | 'Android' | 'unknown' {
  // userAgent 字符串用于后续环境判断
  const userAgent = navigator.userAgent.toLowerCase()

  // H5 环境判断
  if (userAgent.includes('micromessenger')) {
    return 'wechat'
  }
  if (userAgent.includes('alipayclient')) {
    return 'ali'
  }

  // 移动操作系统环境判断
  if (/ios|iphone|ipad|ipod|iwatch/.test(userAgent)) {
    return 'iOS'
  }
  if (/android|adr/.test(userAgent)) {
    return 'Android'
  }

  // 如果以上条件都不满足，则认为是未知环境
  return 'unknown'
}

/**
 * 设置微信网页字体大小为默认。
 * 此函数旨在微信h5中使用，以禁止用户通过微信客户端更改网页字体大小。
 */
export function setWechatWebFontSize(): void {
  // 检查当前平台是否为 Web
  if (parseBrowser() !== 'wechat') {
    return
  }

  // 微信字体设置处理函数
  const handleFontSize = () => {
    /* istanbul ignore next */
    const WeixinJSBridge = (window as any).WeixinJSBridge

    WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 })
    WeixinJSBridge.on('menu:setfont', () => {
      WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 })
    })
  }

  // 尝试直接设置字体大小或监听 WeixinJSBridgeReady 事件
  const WeixinJSBridge = (window as any).WeixinJSBridge
  if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
    handleFontSize()
  }
  else {
    /* istanbul ignore next */
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
    }
  }
}
