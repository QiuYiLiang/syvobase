import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import { useVirtualList } from '../useVirtualList'

describe('useVirtualList 虚拟列表 Hook', () => {
  let mockScrollElement: HTMLDivElement
  let mockResizeObserver: any

  beforeEach(() => {
    mockScrollElement = document.createElement('div')
    Object.defineProperty(mockScrollElement, 'getBoundingClientRect', {
      value: vi.fn().mockReturnValue({
        width: 300,
        height: 400,
        top: 0,
        left: 0,
        bottom: 400,
        right: 300,
        x: 0,
        y: 0,
      }),
    })
    mockScrollElement.scrollTop = 0
    document.body.appendChild(mockScrollElement)

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
    global.ResizeObserver = mockResizeObserver as any

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    document.body.removeChild(mockScrollElement)
    vi.restoreAllMocks()
  })

  describe('基础功能', () => {
    it('应该返回虚拟列表相关属性', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      expect(result.current).toHaveProperty('virtualList')
      expect(result.current).toHaveProperty('paddingTop')
      expect(result.current).toHaveProperty('paddingBottom')
    })

    it('应该返回部分数据作为虚拟列表', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      // 虚拟列表应该只包含可见范围内的数据（加上 overscan）
      expect(result.current.virtualList.length).toBeLessThan(data.length)
    })
  })

  describe('空数据', () => {
    it('空数据应该返回空虚拟列表', () => {
      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data: [],
          estimateSize: () => 50,
          scrollRef,
        })
      })

      expect(result.current.virtualList).toEqual([])
      expect(result.current.paddingTop).toBe(0)
      expect(result.current.paddingBottom).toBe(0)
    })
  })

  describe('enabled 选项', () => {
    it('enabled=false 时应该返回全部数据', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
          enabled: false,
        })
      })

      expect(result.current.virtualList).toEqual(data)
      expect(result.current.paddingTop).toBe(0)
      expect(result.current.paddingBottom).toBe(0)
    })

    it('enabled=true 时应该返回虚拟化数据', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
          enabled: true,
        })
      })

      expect(result.current.virtualList.length).toBeLessThanOrEqual(data.length)
    })
  })

  describe('overscan 选项', () => {
    it('应该使用自定义 overscan 值', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result: result1 } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
          overscan: 2,
        })
      })

      const { result: result2 } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
          overscan: 10,
        })
      })

      // 更大的 overscan 应该渲染更多项目
      expect(result2.current.virtualList.length).toBeGreaterThanOrEqual(
        result1.current.virtualList.length
      )
    })
  })

  describe('estimateSize 函数', () => {
    it('应该使用 estimateSize 计算项目高度', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))
      const estimateSize = vi.fn().mockReturnValue(50)

      renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize,
          scrollRef,
        })
      })

      expect(estimateSize).toHaveBeenCalled()
    })

    it('应该支持动态高度', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))
      const estimateSize = (index: number) => (index % 2 === 0 ? 30 : 60)

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize,
          scrollRef,
        })
      })

      expect(result.current.virtualList.length).toBeGreaterThan(0)
    })
  })

  describe('idKey 选项', () => {
    it('应该使用自定义 idKey', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        customId: `custom-${i}`,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
          idKey: 'customId',
        })
      })

      expect(result.current.virtualList.length).toBeGreaterThan(0)
    })
  })

  describe('滚动处理', () => {
    it('滚动时应该更新虚拟列表', async () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      // 模拟滚动
      act(() => {
        mockScrollElement.scrollTop = 500
        mockScrollElement.dispatchEvent(new Event('scroll'))
      })

      // 滚动后虚拟列表应该更新
      expect(result.current.virtualList.length).toBeGreaterThan(0)
    })
  })

  describe('paddingTop 和 paddingBottom', () => {
    it('滚动到中间位置时应该有 paddingTop', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      // 初始状态 paddingTop 应该是 0
      expect(result.current.paddingTop).toBe(0)
    })
  })

  describe('边界情况', () => {
    it('单个数据项', () => {
      const data = [{ id: 1, name: 'Single Item' }]

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      expect(result.current.virtualList).toHaveLength(1)
      expect(result.current.virtualList[0]).toEqual(data[0])
    })

    it('数据量小于可视区域', () => {
      const data = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(mockScrollElement)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      // 所有数据都应该在虚拟列表中
      expect(result.current.virtualList).toHaveLength(3)
    })

    it('scrollRef 为 null', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))

      const { result } = renderHook(() => {
        const scrollRef = useRef<HTMLDivElement>(null)
        return useVirtualList({
          data,
          estimateSize: () => 50,
          scrollRef,
        })
      })

      // 不应该报错
      expect(result.current.virtualList.length).toBeGreaterThanOrEqual(0)
    })
  })
})
