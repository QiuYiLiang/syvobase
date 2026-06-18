import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { useHover } from '../useHover'

describe('useHover 悬停检测 Hook', () => {
  let mockElement: HTMLDivElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
    vi.clearAllMocks()
  })

  describe('基础功能', () => {
    it('初始状态应该为 false', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useHover(ref)
      })

      expect(result.current).toBe(false)
    })

    it('鼠标进入时应该变为 true', async () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useHover(ref)
      })

      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true })
        )
      })

      await waitFor(() => {
        expect(result.current).toBe(true)
      })
    })

    it('鼠标离开时应该变回 false', async () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useHover(ref)
      })

      // 先进入
      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true })
        )
      })

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      // 再离开
      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseleave', { bubbles: true })
        )
      })

      await waitFor(() => {
        expect(result.current).toBe(false)
      })
    })
  })

  describe('ref 为 null 的情况', () => {
    it('当 ref.current 为 null 时不应该报错', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useHover(ref)
      })

      expect(result.current).toBe(false)
    })
  })

  describe('事件监听器清理', () => {
    it('组件卸载时应该移除事件监听器', () => {
      const removeEventListenerSpy = vi.spyOn(
        mockElement,
        'removeEventListener'
      )

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useHover(ref)
      })

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      )
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      )
    })
  })

  describe('多次进出', () => {
    it('应该正确响应多次鼠标进出', async () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useHover(ref)
      })

      // 第一次进入
      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true })
        )
      })
      await waitFor(() => expect(result.current).toBe(true))

      // 第一次离开
      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseleave', { bubbles: true })
        )
      })
      await waitFor(() => expect(result.current).toBe(false))

      // 第二次进入
      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseenter', { bubbles: true })
        )
      })
      await waitFor(() => expect(result.current).toBe(true))

      // 第二次离开
      act(() => {
        mockElement.dispatchEvent(
          new MouseEvent('mouseleave', { bubbles: true })
        )
      })
      await waitFor(() => expect(result.current).toBe(false))
    })
  })
})
