import { BaseValueProps } from '@/utils'
import { createContext, Dispatch, ReactNode, SetStateAction } from 'react'

export interface AutoLayoutItemType {
  // 唯一id
  id: string
  // 横坐标
  x: number
  // 纵坐标
  y: number
  // 宽度
  w: number
  // 高度 像素
  h: number
}

export interface DraggingInfo {
  dropEl: HTMLDivElement | null
  item: AutoLayoutItemType
  offsetLeft: number
  offsetTop: number
}

export type AutoLayoutItemsType = AutoLayoutItemType[]

export interface AutoLayoutProps extends BaseValueProps<AutoLayoutItemsType> {
  xStep?: number // 每格多少百分比
  yStep?: number // 像素
  readMode?: boolean
  onItemRender: OnItemRender
  renderType?: 'pc' | 'mobile'
  // editor props
  padding?: number
  canDrop?: (item: AutoLayoutItemType) => boolean
  // pc props
  autoHeight?: boolean
}

export type OnItemRender = (options: {
  item: AutoLayoutItemType
  onDelete?: () => void
  onHeightChange?: (height: number) => void
}) => ReactNode

export const DEFAULT_XSTEP = 50
export const DEFAULT_YSTEP = 5

export const AutoLayoutEditorContext = createContext<{
  draggingInfo: null | DraggingInfo
  setDraggingInfo: Dispatch<SetStateAction<null | DraggingInfo>>
}>({} as any)

export function calculationLayout({
  layout: _layout,
  xStep: xStep,
  yStep: yStep,
}: {
  layout: AutoLayoutItemsType
  xStep: number
  yStep: number
}) {
  const layout = _layout.map((item) => ({ ...item }))
  const items = Array.from(layout).sort((a, b) => a.y - b.y || a.x - b.x)
  const placed: AutoLayoutItemsType = []

  const bucketSize = yStep * 3
  const buckets = new Map<number, AutoLayoutItemType[]>()

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n))

  const snapCacheX = new Map<number, number>()
  const snapCacheY = new Map<number, number>()
  const snapX = (x: number) => {
    const key = Math.round(x / xStep)
    if (!snapCacheX.has(key)) snapCacheX.set(key, key * xStep)
    return snapCacheX.get(key)!
  }
  const snapY = (y: number) => {
    const key = Math.round(y / yStep)
    if (!snapCacheY.has(key)) snapCacheY.set(key, key * yStep)
    return snapCacheY.get(key)!
  }

  const isOverlap = (a: AutoLayoutItemType, b: AutoLayoutItemType) => {
    const overlapX = a.x < b.x + b.w && a.x + a.w > b.x
    const overlapY = a.y < b.y + b.h && a.y + a.h > b.y
    return overlapX && overlapY
  }

  const addToBucket = (item: AutoLayoutItemType) => {
    const start = Math.floor(item.y / bucketSize)
    const end = Math.floor((item.y + item.h) / bucketSize)
    for (let i = start; i <= end; i++) {
      const arr = buckets.get(i)
      if (arr) arr.push(item)
      else buckets.set(i, [item])
    }
  }

  const getNearbyCandidates = (y: number) => {
    const bucketIdx = Math.floor(y / bucketSize)
    return [
      ...(buckets.get(bucketIdx - 1) ?? []),
      ...(buckets.get(bucketIdx) ?? []),
      ...(buckets.get(bucketIdx + 1) ?? []),
    ]
  }

  for (const it of items) {
    it.w = clamp(it.w, xStep, 100)
    it.x = snapX(clamp(it.x, 0, 100 - it.w))
    it.h = Math.max(yStep, snapY(it.h ?? yStep))

    // 初始位置
    let currentY = snapY(it.y ?? 0)

    // 向下放置
    while (true) {
      const overlapping = getNearbyCandidates(currentY).filter((p) =>
        isOverlap({ ...it, y: currentY }, p)
      )
      if (overlapping.length === 0) break

      const nextY = Math.max(...overlapping.map((p) => p.y + p.h))
      const snappedY = snapY(nextY)
      if (snappedY === currentY) break
      currentY = snappedY
    }

    it.y = currentY

    // 向上吸附
    let prevY = it.y
    while (prevY > 0) {
      const testY = snapY(prevY - yStep)
      const overlapping = getNearbyCandidates(testY).some((p) =>
        isOverlap({ ...it, y: testY }, p)
      )
      if (overlapping) break
      prevY = testY
    }
    it.y = Math.max(0, prevY)

    placed.push(it)
    addToBucket(it)
  }

  // 保持输入顺序输出
  const resultMap = new Map<string, AutoLayoutItemType>()
  for (const p of placed) resultMap.set(p.id, p)
  return layout.map((orig) => resultMap.get(orig.id) ?? { ...orig })
}

export function isSameLayout(a: AutoLayoutItemsType, b: AutoLayoutItemsType) {
  if (a === b) return true
  if (a.length !== b.length) return false
  const mapB = new Map<string, AutoLayoutItemType>()
  for (const item of b) mapB.set(item.id, item)
  for (const ia of a) {
    const ib = mapB.get(ia.id)
    if (!ib) return false
    if (ia.x !== ib.x || ia.y !== ib.y || ia.w !== ib.w || ia.h !== ib.h)
      return false
  }
  return true
}
