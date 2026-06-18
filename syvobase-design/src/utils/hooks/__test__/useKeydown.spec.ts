import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKeydown } from '../useKeydown'

describe('useKeydown 键盘事件 Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础功能', () => {
    it('应该监听指定的按键', () => {
      const callback = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useKeydown('Enter', callback))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('按下指定按键时应该触发回调', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('Enter', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })

      expect(callback).toHaveBeenCalled()
    })

    it('按下其他按键时不应该触发回调', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('Enter', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('不同按键支持', () => {
    it('应该支持 Escape 键', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('Escape', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      expect(callback).toHaveBeenCalled()
    })

    it('应该支持字母键', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('a', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      })

      expect(callback).toHaveBeenCalled()
    })

    it('应该支持数字键', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('1', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))
      })

      expect(callback).toHaveBeenCalled()
    })

    it('应该支持功能键', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('F1', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F1' }))
      })

      expect(callback).toHaveBeenCalled()
    })

    it('应该支持空格键', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown(' ', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
      })

      expect(callback).toHaveBeenCalled()
    })
  })

  describe('key 为 undefined 的情况', () => {
    it('key 为 undefined 时不应该添加事件监听器', () => {
      const callback = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useKeydown(undefined, callback))

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })
  })

  describe('事件监听器清理', () => {
    it('组件卸载时应该移除事件监听器', () => {
      const callback = vi.fn()
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useKeydown('Enter', callback))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('key 为 undefined 时卸载不应该报错', () => {
      const callback = vi.fn()

      const { unmount } = renderHook(() => useKeydown(undefined, callback))

      expect(() => unmount()).not.toThrow()
    })
  })

  describe('异步回调', () => {
    it('应该支持异步回调', async () => {
      const asyncCallback = vi.fn().mockResolvedValue(undefined)

      renderHook(() => useKeydown('Enter', asyncCallback))

      await act(async () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })

      expect(asyncCallback).toHaveBeenCalled()
    })
  })

  describe('多次按键', () => {
    it('应该响应多次按键', () => {
      const callback = vi.fn()

      renderHook(() => useKeydown('Enter', callback))

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })

      expect(callback).toHaveBeenCalledTimes(3)
    })
  })

  describe('key 变化', () => {
    it('key 变化时应该更新事件监听器', () => {
      const callback = vi.fn()

      const { rerender } = renderHook(({ key }) => useKeydown(key, callback), {
        initialProps: { key: 'Enter' },
      })

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })
      expect(callback).toHaveBeenCalledTimes(1)

      rerender({ key: 'Escape' })

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })
      // Enter 不应该再触发
      expect(callback).toHaveBeenCalledTimes(1)

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })
      // Escape 应该触发
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })
})
