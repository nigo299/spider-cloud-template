/**
 * Asynchronously executes a Promise and returns a Promise<[T, E]>.
 * 异步执行 Promise 并返回 Promise<[T, E]>。
 *
 * @template T - 结果值的类型。
 * @template E - 错误值的类型（默认为 Error）。
 * @param {Promise<T>} promise - 要执行的 Promise。
 * @returns {Promise<[T, E]>} - 一个 Promise，解析为包含 Promise 结果（类型为 T）和错误值（类型为 E）的元组。
 */
export async function to<T, E = Error>(promise: Promise<T>): Promise<[T, E]> {
  try {
    const ret = await promise
    return [ret, null as unknown as E]
  } catch (e: any) {
    return [null as unknown as T, e]
  }
}

export const NotRevalidateOption = {
  revalidateOnFocus: false, // auto revalidate when window gets focused
  shouldRetryOnError: false, // retry when fetcher has an error
}
