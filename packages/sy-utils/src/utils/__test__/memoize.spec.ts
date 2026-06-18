import { describe, it, expect, vi } from 'vitest'
import { memoize } from '../memoize'

describe('memoize 记忆化函数', () => {
  it('应该缓存函数结果', () => {
    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn)

    expect(memoizedFn(5)).toBe(10)
    expect(memoizedFn(5)).toBe(10)
    expect(memoizedFn(5)).toBe(10)

    // 函数应该只被调用一次
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('不同参数应该分别缓存', () => {
    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn)

    expect(memoizedFn(5)).toBe(10)
    expect(memoizedFn(10)).toBe(20)
    expect(memoizedFn(5)).toBe(10)
    expect(memoizedFn(10)).toBe(20)

    // 每个不同的参数调用一次
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该支持多参数函数', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoizedFn = memoize(fn)

    expect(memoizedFn(1, 2)).toBe(3)
    expect(memoizedFn(1, 2)).toBe(3)
    expect(memoizedFn(2, 1)).toBe(3)

    // 参数顺序不同应该分别缓存
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该支持对象参数', () => {
    const fn = vi.fn((obj: { x: number; y: number }) => obj.x + obj.y)
    const memoizedFn = memoize(fn)

    expect(memoizedFn({ x: 1, y: 2 })).toBe(3)
    expect(memoizedFn({ x: 1, y: 2 })).toBe(3)
    expect(memoizedFn({ x: 2, y: 1 })).toBe(3)

    // 对象内容相同应该命中缓存
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该支持数组参数', () => {
    const fn = vi.fn((arr: number[]) => arr.reduce((a, b) => a + b, 0))
    const memoizedFn = memoize(fn)

    expect(memoizedFn([1, 2, 3])).toBe(6)
    expect(memoizedFn([1, 2, 3])).toBe(6)
    expect(memoizedFn([3, 2, 1])).toBe(6)

    // 数组内容不同应该分别缓存
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该支持自定义 resolver', () => {
    const fn = vi.fn((obj: { id: number; name: string }) => obj.name)
    const memoizedFn = memoize(fn, (obj) => obj.id.toString())

    expect(memoizedFn({ id: 1, name: 'John' })).toBe('John')
    expect(memoizedFn({ id: 1, name: 'Jane' })).toBe('John') // 使用缓存的值
    expect(memoizedFn({ id: 2, name: 'Jane' })).toBe('Jane')

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该处理返回 undefined 的函数', () => {
    const fn = vi.fn(() => undefined)
    const memoizedFn = memoize(fn)

    expect(memoizedFn()).toBe(undefined)
    expect(memoizedFn()).toBe(undefined)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该处理返回 null 的函数', () => {
    const fn = vi.fn(() => null)
    const memoizedFn = memoize(fn)

    expect(memoizedFn()).toBe(null)
    expect(memoizedFn()).toBe(null)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该处理抛出异常的函数', () => {
    const fn = vi.fn(() => {
      throw new Error('test error')
    })
    const memoizedFn = memoize(fn)

    expect(() => memoizedFn()).toThrow('test error')
    expect(() => memoizedFn()).toThrow('test error')

    // lodash 的 memoize 会缓存抛出异常的结果吗？不会，所以会调用两次
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该处理嵌套对象参数', () => {
    const fn = vi.fn((obj: { nested: { value: number } }) => obj.nested.value)
    const memoizedFn = memoize(fn)

    expect(memoizedFn({ nested: { value: 42 } })).toBe(42)
    expect(memoizedFn({ nested: { value: 42 } })).toBe(42)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该处理字符串参数', () => {
    const fn = vi.fn((str: string) => str.toUpperCase())
    const memoizedFn = memoize(fn)

    expect(memoizedFn('hello')).toBe('HELLO')
    expect(memoizedFn('hello')).toBe('HELLO')
    expect(memoizedFn('world')).toBe('WORLD')

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该处理布尔参数', () => {
    const fn = vi.fn((bool: boolean) => (bool ? 'yes' : 'no'))
    const memoizedFn = memoize(fn)

    expect(memoizedFn(true)).toBe('yes')
    expect(memoizedFn(true)).toBe('yes')
    expect(memoizedFn(false)).toBe('no')
    expect(memoizedFn(false)).toBe('no')

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该处理混合参数类型', () => {
    const fn = vi.fn((a: number, b: string, c: boolean) => `${a}-${b}-${c}`)
    const memoizedFn = memoize(fn)

    expect(memoizedFn(1, 'test', true)).toBe('1-test-true')
    expect(memoizedFn(1, 'test', true)).toBe('1-test-true')
    expect(memoizedFn(1, 'test', false)).toBe('1-test-false')

    expect(fn).toHaveBeenCalledTimes(2)
  })
})
