import { describe, it, expect } from 'vitest'
import { getHasToolbar } from '../toolbar'
import type { ToolbarProps } from '@/toolbar'

describe('getHasToolbar 工具栏检查函数', () => {
  describe('有工具栏内容', () => {
    it('应该返回 true 当有 left 内容时', () => {
      const props: ToolbarProps = {
        left: [{ name: '按钮' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该返回 true 当有 items 内容时', () => {
      const props: ToolbarProps = {
        items: [{ name: '按钮' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该返回 true 当有 right 内容时', () => {
      const props: ToolbarProps = {
        right: [{ name: '按钮' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该返回 true 当有多个区域内容时', () => {
      const props: ToolbarProps = {
        left: [{ name: '左' }],
        items: [{ name: '中' }],
        right: [{ name: '右' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该返回 true 当 left 和 right 都有内容时', () => {
      const props: ToolbarProps = {
        left: [{ name: '左' }],
        right: [{ name: '右' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })
  })

  describe('无工具栏内容', () => {
    it('应该返回 false 当所有数组为空时', () => {
      const props: ToolbarProps = {
        left: [],
        items: [],
        right: [],
      }
      expect(getHasToolbar(props)).toBe(false)
    })

    it('应该返回 false 当 props 为空对象时', () => {
      const props: ToolbarProps = {}
      expect(getHasToolbar(props)).toBe(false)
    })

    it('应该返回 false 当所有属性为 undefined 时', () => {
      const props: ToolbarProps = {
        left: undefined,
        items: undefined,
        right: undefined,
      }
      expect(getHasToolbar(props)).toBe(false)
    })

    it('应该返回 false 当只有空数组时', () => {
      const props: ToolbarProps = {
        left: [],
      }
      expect(getHasToolbar(props)).toBe(false)
    })
  })

  describe('混合情况', () => {
    it('应该返回 true 当有一个区域有内容而其他为空时', () => {
      const props: ToolbarProps = {
        left: [],
        items: [{ name: '按钮' }],
        right: [],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该返回 true 当有一个区域有内容而其他为 undefined 时', () => {
      const props: ToolbarProps = {
        left: undefined,
        items: [{ name: '按钮' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('应该处理只有一个元素的数组', () => {
      const props: ToolbarProps = {
        items: [{ name: '唯一按钮' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该处理多个元素的数组', () => {
      const props: ToolbarProps = {
        items: [{ name: '按钮1' }, { name: '按钮2' }, { name: '按钮3' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })

    it('应该处理复杂的工具栏配置', () => {
      const props: ToolbarProps = {
        left: [{ name: '新建' }, { name: '编辑' }],
        items: [{ name: '搜索' }],
        right: [{ name: '保存' }, { name: '取消' }],
      }
      expect(getHasToolbar(props)).toBe(true)
    })
  })
})
