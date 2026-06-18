import { describe, it, expect } from 'vitest'
import { useFocusClassName } from '../useFocusClassName'

describe('useFocusClassName 焦点类名 Hook', () => {
  describe('基础功能', () => {
    it('应该返回数组', () => {
      const result = useFocusClassName(true)
      expect(Array.isArray(result)).toBe(true)
    })

    it('应该包含 hover 效果类名', () => {
      const result = useFocusClassName(false)
      expect(result[0]).toContain('hover:ring-2')
      expect(result[0]).toContain('hover:ring-ring/80')
    })
  })

  describe('聚焦状态', () => {
    it('当 focus 为 true 时应该包含 ring 类名', () => {
      const result = useFocusClassName(true)
      expect(result[1]).toContain('ring-2')
      expect(result[1]).toContain('ring-ring/50')
    })

    it('当 focus 为 false 时第二个元素应该为 false', () => {
      const result = useFocusClassName(false)
      expect(result[1]).toBe(false)
    })
  })

  describe('返回值结构', () => {
    it('应该返回两个元素的数组', () => {
      const result = useFocusClassName(true)
      expect(result).toHaveLength(2)
    })

    it('第一个元素应该是字符串', () => {
      const result = useFocusClassName(true)
      expect(typeof result[0]).toBe('string')
    })

    it('第二个元素应该是字符串或 false', () => {
      const focusedResult = useFocusClassName(true)
      const unfocusedResult = useFocusClassName(false)

      expect(typeof focusedResult[1]).toBe('string')
      expect(unfocusedResult[1]).toBe(false)
    })
  })

  describe('类名可用于 cn 函数', () => {
    it('返回值可以直接展开使用', () => {
      const result = useFocusClassName(true)
      // 模拟 cn 函数的行为 - 可以展开数组
      expect(() => [...result]).not.toThrow()
    })
  })
})
