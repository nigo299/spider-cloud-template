type GroupByResult<T, U extends boolean> = U extends true
  ? T[] // 如果 U 为 true，返回数组
  : Record<string, T[]> // 如果 U 为 false，返回对象

export function groupBy<T>(
  array: T[],
  key: string,
  asArray?: boolean,
): GroupByResult<T, typeof asArray extends true ? true : false> {
  // 使用类型断言来指定 `result` 的类型
  const result = array.reduce<Record<string, T[]>>(
    (acc, currentValue) => {
      const keyValue = String(currentValue[key])

      if (!acc[keyValue]) {
        acc[keyValue] = []
      }
      acc[keyValue].push(currentValue)
      return acc
    },
    {} as Record<string, T[]>,
  )

  if (asArray) {
    return Object.values(result) as GroupByResult<T, true>
  }

  return result as GroupByResult<T, false>
}
