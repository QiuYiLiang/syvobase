import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useToolbarProps } from '../useToolbar'

describe('useToolbarProps 工具栏属性 Hook', () => {
  describe('无值情况', () => {
    it('value 为 undefined 时应该返回 [false, {}]', () => {
      const { result } = renderHook(() => useToolbarProps(undefined))

      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toEqual({})
    })

    it('value 为 null 时应该返回 [false, {}]', () => {
      const { result } = renderHook(() => useToolbarProps(null as any))

      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toEqual({})
    })
  })

  describe('数组值', () => {
    it('数组值应该默认转换为 right 属性', () => {
      const items = [{ name: '按钮1' }, { name: '按钮2' }]
      const { result } = renderHook(() => useToolbarProps(items))

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual({ right: items })
    })

    it('align=left 时数组应该转换为 left 属性', () => {
      const items = [{ name: '按钮1' }]
      const { result } = renderHook(() =>
        useToolbarProps(items, { align: 'left' })
      )

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual({ left: items })
    })

    it('align=center 时数组应该转换为 items 属性', () => {
      const items = [{ name: '按钮1' }]
      const { result } = renderHook(() =>
        useToolbarProps(items, { align: 'center' })
      )

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual({ items })
    })

    it('align=right 时数组应该转换为 right 属性', () => {
      const items = [{ name: '按钮1' }]
      const { result } = renderHook(() =>
        useToolbarProps(items, { align: 'right' })
      )

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual({ right: items })
    })

    it('空数组应该返回 [false, { right: [] }]', () => {
      const { result } = renderHook(() => useToolbarProps([]))

      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toEqual({ right: [] })
    })
  })

  describe('对象值', () => {
    it('对象值应该直接使用', () => {
      const toolbarProps = {
        left: [{ name: '左按钮' }],
        right: [{ name: '右按钮' }],
      }
      const { result } = renderHook(() => useToolbarProps(toolbarProps))

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual(toolbarProps)
    })

    it('只有 items 的对象', () => {
      const toolbarProps = {
        items: [{ name: '中间按钮' }],
      }
      const { result } = renderHook(() => useToolbarProps(toolbarProps))

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual(toolbarProps)
    })

    it('空对象应该返回 [false, {}]', () => {
      const { result } = renderHook(() => useToolbarProps({}))

      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toEqual({})
    })

    it('所有属性为空数组的对象应该返回 [false, ...]', () => {
      const toolbarProps = {
        left: [],
        items: [],
        right: [],
      }
      const { result } = renderHook(() => useToolbarProps(toolbarProps))

      expect(result.current[0]).toBe(false)
    })
  })

  describe('返回值结构', () => {
    it('应该返回元组 [boolean, ToolbarProps]', () => {
      const { result } = renderHook(() => useToolbarProps([{ name: 'test' }]))

      expect(Array.isArray(result.current)).toBe(true)
      expect(result.current).toHaveLength(2)
      expect(typeof result.current[0]).toBe('boolean')
      expect(typeof result.current[1]).toBe('object')
    })
  })

  describe('options 默认值', () => {
    it('不传 options 时应该使用默认值', () => {
      const items = [{ name: '按钮' }]
      const { result } = renderHook(() => useToolbarProps(items))

      // 默认 align 是 'right'
      expect(result.current[1]).toHaveProperty('right')
    })

    it('传空对象 options 时应该使用默认值', () => {
      const items = [{ name: '按钮' }]
      const { result } = renderHook(() => useToolbarProps(items, {}))

      // 默认 align 是 'right'
      expect(result.current[1]).toHaveProperty('right')
    })
  })

  describe('边界情况', () => {
    it('单个元素的数组', () => {
      const { result } = renderHook(() => useToolbarProps([{ name: 'single' }]))

      expect(result.current[0]).toBe(true)
    })

    it('多个元素的数组', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({ name: `btn${i}` }))
      const { result } = renderHook(() => useToolbarProps(items))

      expect(result.current[0]).toBe(true)
      expect(result.current[1].right).toHaveLength(10)
    })

    it('复杂的工具栏配置', () => {
      const toolbarProps = {
        left: [{ name: '新建' }, { name: '编辑' }],
        items: [{ name: '搜索' }],
        right: [{ name: '保存' }, { name: '取消' }],
      }
      const { result } = renderHook(() => useToolbarProps(toolbarProps))

      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toEqual(toolbarProps)
    })
  })
})
