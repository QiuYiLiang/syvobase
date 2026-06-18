import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mergeTag } from '../tag'

describe('mergeTag 标签合并函数', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('开发环境', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('应该返回带有 data-tag 属性的对象', () => {
      const result = mergeTag('button')
      expect(result).toEqual({ 'data-tag': 'nk-button' })
    })

    it('应该使用自定义的 data-tag 值', () => {
      const result = mergeTag('button', { 'data-tag': 'custom-tag' })
      expect(result).toEqual({ 'data-tag': 'custom-tag' })
    })

    it('应该处理不同的标签名', () => {
      expect(mergeTag('input')).toEqual({ 'data-tag': 'nk-input' })
      expect(mergeTag('select')).toEqual({ 'data-tag': 'nk-select' })
      expect(mergeTag('modal')).toEqual({ 'data-tag': 'nk-modal' })
    })

    it('应该处理空 props', () => {
      const result = mergeTag('button', {})
      expect(result).toEqual({ 'data-tag': 'nk-button' })
    })

    it('应该处理带有其他属性的 props', () => {
      const result = mergeTag('button', {
        className: 'my-class',
        id: 'my-id',
      })
      expect(result).toEqual({ 'data-tag': 'nk-button' })
    })

    it('应该处理复杂标签名', () => {
      expect(mergeTag('date-picker')).toEqual({ 'data-tag': 'nk-date-picker' })
      expect(mergeTag('TreeSelect')).toEqual({ 'data-tag': 'nk-TreeSelect' })
    })

    it('应该处理空字符串标签名', () => {
      const result = mergeTag('')
      expect(result).toEqual({ 'data-tag': 'nk-' })
    })

    it('应该优先使用传入的 data-tag', () => {
      const result = mergeTag('button', { 'data-tag': '' })
      // 空字符串是 falsy，所以使用默认值
      expect(result).toEqual({ 'data-tag': 'nk-button' })
    })

    it('应该处理 undefined data-tag', () => {
      const result = mergeTag('button', { 'data-tag': undefined })
      expect(result).toEqual({ 'data-tag': 'nk-button' })
    })
  })

  describe('生产环境', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('应该返回空对象', () => {
      const result = mergeTag('button')
      expect(result).toEqual({})
    })

    it('应该忽略自定义 data-tag', () => {
      const result = mergeTag('button', { 'data-tag': 'custom-tag' })
      expect(result).toEqual({})
    })

    it('应该对任何标签名返回空对象', () => {
      expect(mergeTag('input')).toEqual({})
      expect(mergeTag('select')).toEqual({})
      expect(mergeTag('modal')).toEqual({})
    })

    it('应该忽略所有 props', () => {
      const result = mergeTag('button', {
        className: 'my-class',
        id: 'my-id',
        'data-tag': 'custom',
      })
      expect(result).toEqual({})
    })
  })

  describe('测试环境', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
    })

    it('应该返回空对象（非 development 环境）', () => {
      const result = mergeTag('button')
      expect(result).toEqual({})
    })
  })

  describe('边界情况', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('应该处理包含特殊字符的标签名', () => {
      expect(mergeTag('my_component')).toEqual({
        'data-tag': 'nk-my_component',
      })
      expect(mergeTag('my.component')).toEqual({
        'data-tag': 'nk-my.component',
      })
    })

    it('应该处理数字标签名', () => {
      expect(mergeTag('h1')).toEqual({ 'data-tag': 'nk-h1' })
      expect(mergeTag('input2')).toEqual({ 'data-tag': 'nk-input2' })
    })

    it('应该处理中文标签名', () => {
      expect(mergeTag('按钮')).toEqual({ 'data-tag': 'nk-按钮' })
    })

    it('应该处理非常长的标签名', () => {
      const longName = 'a'.repeat(100)
      expect(mergeTag(longName)).toEqual({ 'data-tag': `nk-${longName}` })
    })
  })
})
