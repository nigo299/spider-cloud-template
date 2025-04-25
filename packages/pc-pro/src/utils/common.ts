import dayjs from 'dayjs'

/**
 * 格式化日期时间
 * @param time 时间
 * @param format 格式
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(time: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(time).format(format)
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD'): string {
  return formatDateTime(date, format)
}

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param wait 等待时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let context: any, args: any
  let previous = 0

  return function (this: any, ...argArr: Parameters<T>): void {
    const now = +new Date()
    context = this
    args = argArr
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * 防抖函数
 * @param method 要执行的方法
 * @param wait 等待时间
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  method: T,
  wait: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null

  return function (this: any, ...args: Parameters<T>): void {
    const context = this
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        method.apply(context, args)
      }
    }
    else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        /**
         * args是一个类数组对象，所以使用fn.apply
         * 也可写作method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 睡眠函数
 * @param time 毫秒数
 * @returns Promise
 */
export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 监听元素大小变化
 * @param el HTML元素
 * @param cb 回调函数
 * @return ResizeObserver实例
 */
export function useResize(el: HTMLElement, cb: (rect: DOMRectReadOnly) => void): ResizeObserver {
  const observer = new ResizeObserver((entries) => {
    cb(entries[0].contentRect)
  })
  observer.observe(el)
  return observer
}
