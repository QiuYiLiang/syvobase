import { useState, useEffect, RefObject } from 'react'
import { useRect } from './useRect'

export function useVirtualList<T>({
  data,
  estimateSize,
  overscan = 5,
  scrollRef,
  getItemElement,
  idKey = 'id',
  enabled = true,
}: {
  data: T[]
  estimateSize: (index: number) => number
  overscan?: number
  scrollRef: RefObject<HTMLElement | null>
  getItemElement?: (item: T) => HTMLElement | null
  idKey?: string
  enabled?: boolean
}) {
  const [scrollTop, setScrollTop] = useState(0)
  const { height: scrollHeight = 0 } = useRect(scrollRef, ['height'])
  const [measuredSizes, setMeasuredSizes] = useState<
    Map<string | number, number>
  >(new Map())

  const itemCount = data.length

  const getItemSize = (index: number) => {
    const item = data[index]
    const key = item?.[idKey]
    return measuredSizes.get(key) ?? estimateSize(index)
  }

  const itemOffsets = (() => {
    if (!enabled) return []

    const offsets = new Array(itemCount)
    if (itemCount === 0) return offsets

    offsets[0] = 0
    for (let i = 1; i < itemCount; i++) {
      offsets[i] = offsets[i - 1] + getItemSize(i - 1)
    }
    return offsets
  })()

  const totalSize = (() => {
    if (!enabled) return 0

    return itemCount > 0
      ? itemOffsets[itemCount - 1] + getItemSize(itemCount - 1)
      : 0
  })()

  const binarySearch = (offsets: number[], scrollTop: number) => {
    let left = 0
    let right = offsets.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (offsets[mid] <= scrollTop) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return Math.max(0, right)
  }

  const virtualRange = (() => {
    if (!enabled || itemCount === 0)
      return { startIndex: 0, endIndex: itemCount - 1 }

    const startIndex = binarySearch(itemOffsets, scrollTop)
    const endIndex = Math.min(
      itemCount - 1,
      binarySearch(itemOffsets, scrollTop + scrollHeight)
    )

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: Math.min(itemCount - 1, endIndex + overscan),
    }
  })()

  const virtualList = (() => {
    if (!enabled) {
      return data
    }

    if (virtualRange.endIndex < virtualRange.startIndex) return []

    return data.slice(virtualRange.startIndex, virtualRange.endIndex + 1)
  })()

  const paddingTop = (() => {
    if (!enabled) return 0

    return virtualRange.startIndex > 0
      ? itemOffsets[virtualRange.startIndex]
      : 0
  })()

  const paddingBottom = (() => {
    if (!enabled) return 0

    if (virtualRange.endIndex < itemCount - 1) {
      const lastVisibleItemEnd =
        itemOffsets[virtualRange.endIndex] + getItemSize(virtualRange.endIndex)
      return totalSize - lastVisibleItemEnd
    }
    return 0
  })()

  const measureElement = (id: string | number, element: HTMLElement) => {
    if (!enabled) return // 不启用时直接返回

    const height = element.getBoundingClientRect().height

    setMeasuredSizes((prev) => {
      const newMap = new Map(prev)
      if (newMap.get(id) !== height) {
        newMap.set(id, height)
        return newMap
      }
      return prev
    })
  }

  useRect()

  useEffect(() => {
    if (!enabled || !scrollRef.current) return

    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const handleScroll = () => {
      setScrollTop(scrollElement.scrollTop)
    }

    handleScroll()
    scrollElement.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [enabled, scrollRef])

  useEffect(() => {
    if (!enabled || !getItemElement) {
      return
    }
    virtualList.forEach((item) => {
      const element = getItemElement(item) as HTMLElement
      if (element) {
        measureElement(item[idKey], element)
      }
    })
  }, [virtualList, measureElement, enabled, getItemElement, idKey])

  return {
    virtualList,
    paddingTop,
    paddingBottom,
  }
}
