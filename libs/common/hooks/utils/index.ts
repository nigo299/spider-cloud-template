export function isObject(value: unknown): value is Record<any, any> {
  return value !== null && typeof value === 'object'
}

// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = (value: unknown): value is Function => typeof value === 'function'
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isUndef = (value: unknown): value is undefined => typeof value === 'undefined'
