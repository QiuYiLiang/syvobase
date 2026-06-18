import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { useRect } from '../useRect'

describe('useRect 元素尺寸 Hook', () => {
  let mockElement: HTMLDivElement
  let mockResizeObserver: any

  beforeEach(() => {
    mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'getBoundingClientRect', {
      value: vi.fn().mockReturnValue({
        width: 100,
        height: 200,
        top: 10,
        left: 20,
        bottom: 210,
        right: 120,
        x: 20,
        y: 10,
      }),
    })
    document.body.appendChild(mockElement)

    // Mock ResizeObserver
    mockResizeObserver = class {
      static instances: any[] = []
      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
      constructor() {
        mockResizeObserver.instances.push(this)
      }
    }
    ;(globalThis as any).ResizeObserver = mockResizeObserver

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
    vi.restoreAllMocks()
  })

  describe('基础功能', () => {
    it('应该返回空对象当 watchKeys 为空时', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useRect(ref, [])
      })

      expect(result.current).toEqual({})
    })

    it('应该返回元素的尺寸信息', async () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useRect(ref, ['width', 'height'])
      })

      await waitFor(() => {
        expect(result.current.width).toBe(100)
        expect(result.current.height).toBe(200)
      })
    })

    it('应该返回元素的位置信息', async () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useRect(ref, ['top', 'left'])
      })

      await waitFor(() => {
        expect(result.current.top).toBe(10)
        expect(result.current.left).toBe(20)
      })
    })
  })

  describe('ref 为 null 的情况', () => {
    it('当 ref.current 为 null 时不应该报错', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useRect(ref, ['width'])
      })

      expect(result.current).toEqual({})
    })
  })

  describe('不传 ref 的情况', () => {
    it('不传 ref 时不应该报错', () => {
      const { result } = renderHook(() => useRect())

      expect(result.current).toEqual({})
    })
  })

  describe('ResizeObserver 集成', () => {
    it('应该创建 ResizeObserver', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useRect(ref, ['width'])
      })

      expect(mockResizeObserver.instances.length).toBeGreaterThan(0)
    })

    it('组件卸载时应该断开 ResizeObserver', () => {
      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(mockElement)
        return useRect(ref, ['width'])
      })

      const instance =
        mockResizeObserver.instances[mockResizeObserver.instances.length - 1]

      unmount()

      if (instance) {
        expect(instance.disconnect).toHaveBeenCalled()
      }
    })
  })

  describe('watchKeys 变化', () => {
    it('watchKeys 变化时应该重新监听', async () => {
      const { result, rerender } = renderHook(
        ({ keys }: { keys: string[] }) => {
          const ref = useRef<HTMLDivElement>(mockElement)
          return useRect(ref, keys)
        },
        { initialProps: { keys: ['width'] } }
      )

      await waitFor(() => {
        expect(result.current.width).toBe(100)
      })

      rerender({ keys: ['width', 'height'] })

      await waitFor(() => {
        expect(result.current.width).toBe(100)
        expect(result.current.height).toBe(200)
      })
    })
  })
})
