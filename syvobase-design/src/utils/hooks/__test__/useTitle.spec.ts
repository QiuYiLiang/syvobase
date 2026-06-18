import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTitle } from '../useTitle'

describe('useTitle 标题 Hook', () => {
  const originalTitle = document.title

  beforeEach(() => {
    document.title = 'Original Title'
  })

  afterEach(() => {
    document.title = originalTitle
  })

  describe('基础功能', () => {
    it('应该设置文档标题', () => {
      renderHook(() => useTitle('New Title'))

      expect(document.title).toBe('New Title')
    })

    it('应该在标题变化时更新', () => {
      const { rerender } = renderHook(({ title }) => useTitle(title), {
        initialProps: { title: 'First Title' },
      })

      expect(document.title).toBe('First Title')

      rerender({ title: 'Second Title' })

      expect(document.title).toBe('Second Title')
    })
  })

  describe('不同标题类型', () => {
    it('应该处理空字符串', () => {
      renderHook(() => useTitle(''))

      expect(document.title).toBe('')
    })

    it('应该处理中文标题', () => {
      renderHook(() => useTitle('中文标题'))

      expect(document.title).toBe('中文标题')
    })

    it('应该处理包含特殊字符的标题', () => {
      renderHook(() => useTitle('Title <with> "special" & chars'))

      expect(document.title).toBe('Title <with> "special" & chars')
    })

    it('应该处理很长的标题', () => {
      const longTitle = 'A'.repeat(1000)
      renderHook(() => useTitle(longTitle))

      expect(document.title).toBe(longTitle)
    })

    it('应该处理包含数字的标题', () => {
      renderHook(() => useTitle('Page 123 - Section 456'))

      expect(document.title).toBe('Page 123 - Section 456')
    })

    it('应该处理包含 emoji 的标题', () => {
      renderHook(() => useTitle('🎉 Welcome! 👍'))

      expect(document.title).toBe('🎉 Welcome! 👍')
    })
  })

  describe('标题不变时', () => {
    it('相同标题不应该重复设置', () => {
      const { rerender } = renderHook(({ title }) => useTitle(title), {
        initialProps: { title: 'Same Title' },
      })

      expect(document.title).toBe('Same Title')

      // 使用相同标题重新渲染
      rerender({ title: 'Same Title' })

      expect(document.title).toBe('Same Title')
    })
  })

  describe('组件卸载', () => {
    it('卸载后标题保持最后设置的值', () => {
      const { unmount } = renderHook(() => useTitle('My Title'))

      expect(document.title).toBe('My Title')

      unmount()

      // 卸载后标题不会自动恢复
      expect(document.title).toBe('My Title')
    })
  })

  describe('多个组件使用', () => {
    it('后渲染的组件应该覆盖标题', () => {
      renderHook(() => useTitle('First Component'))
      expect(document.title).toBe('First Component')

      renderHook(() => useTitle('Second Component'))
      expect(document.title).toBe('Second Component')
    })
  })
})
