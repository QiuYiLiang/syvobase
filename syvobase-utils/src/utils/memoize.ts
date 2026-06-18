import { memoize as _memoize } from 'lodash-es'

export function memoize<T extends (...args: any) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => any
): T

export function memoize(
  fn: any,
  resolver = (...args: any) => JSON.stringify(args)
) {
  return _memoize(fn, resolver)
}
