import { describe, it, expect } from 'vitest'
import { keysToMap } from '../keysToMap'

describe('keysToMap 函数测试', () => {
  it('应该将空数组转换为空对象', () => {
    const result = keysToMap([])
    expect(result).toEqual({})
  })

  it('应该将字符串数组转换为键值都为 true 的对象', () => {
    const keys = ['a', 'b', 'c']
    const result = keysToMap(keys)
    expect(result).toEqual({
      a: true,
      b: true,
      c: true,
    })
  })

  it('应该正确处理数组中的重复值', () => {
    const keys = ['a', 'b', 'a']
    const result = keysToMap(keys)
    expect(result).toEqual({
      a: true,
      b: true,
    })
  })

  it('应该保持对象的引用类型特性', () => {
    const result = keysToMap(['test'])
    result.test = false
    expect(result.test).toBe(false)
  })
})
