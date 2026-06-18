import RcResizeObserver from 'rc-resize-observer'
import {
  AutoLayoutItemsType,
  AutoLayoutItemType,
  AutoLayoutProps,
  calculationLayout,
  DEFAULT_XSTEP,
} from './shared'
import { useState } from 'react'
import { cn, useControllable } from '@/utils'
import { mergeTag } from '@/utils/tag'

// 获取元素右边定位
function getRight(item: AutoLayoutItemType) {
  return item.x + item.w
}

// 获取元素下边定位
function getBottom(item: AutoLayoutItemType) {
  return item.y + item.h
}

// 获取元素左边的元素
function getLeftItem(data: AutoLayoutItemsType, item: AutoLayoutItemType) {
  let leftItem: AutoLayoutItemType | undefined
  data.forEach((compareItem) => {
    if (isOnRow(item, compareItem)) {
      // 和当前元素是同一行的
      const compareItemRight = getRight(compareItem)
      if (item.x >= compareItemRight) {
        // 找到当前元素左边的元素
        if (leftItem) {
          // 如果之前已经找到了，和之前的比较
          if (getRight(leftItem) < compareItemRight) {
            // 找到离当前元素最近的那个左边的元素
            leftItem = compareItem
          }
        } else {
          leftItem = compareItem
        }
      }
    }
  })
  return leftItem
}

// 获取元素右边的元素
function getRightItem(data: AutoLayoutItemsType, item: AutoLayoutItemType) {
  // 元素向右补齐
  let rightItem: AutoLayoutItemType | undefined
  data.forEach((compareItem) => {
    if (isOnRow(item, compareItem)) {
      // 和当前元素是同一行的
      const currentItemRight = getRight(item)
      if (currentItemRight <= compareItem.x) {
        // 找到当前元素右边的元素
        if (rightItem) {
          // 如果之前已经找到了，和之前的比较
          if (rightItem.x > compareItem.x) {
            // 找到离当前元素最近的那个左边的元素
            rightItem = compareItem
          }
        } else {
          rightItem = compareItem
        }
      }
    }
  })
  return rightItem
}

// 元素向左补齐
function fillLeft(data: AutoLayoutItemsType, item: AutoLayoutItemType) {
  const leftItem: AutoLayoutItemType | undefined = getLeftItem(data, item)

  if (leftItem) {
    // 如果存在左边的元素，补齐
    item.x = getRight(leftItem)
  } else {
    // 如果不存在，补齐到最左边
    item.x = 0
  }
}

// 元素向右补齐
function fillRight(data: AutoLayoutItemsType, item: AutoLayoutItemType) {
  const rightItem: AutoLayoutItemType | undefined = getRightItem(data, item)

  if (rightItem) {
    // 如果存在右边的元素，向右补齐
    item.w = rightItem.x - item.x
  } else {
    item.w = 100 - item.x
  }
}

// 元素向下补齐
function fillBottom(
  data: AutoLayoutItemsType,
  currentItem: AutoLayoutItemType,
  height: number
) {
  if (height === 0) {
    return
  }
  let bottomItem: AutoLayoutItemType | undefined

  data.forEach((compareItem) => {
    if (isOnCol(currentItem, compareItem)) {
      // 和当前元素是同一列
      if (currentItem.y <= compareItem.y) {
        const currentItemBottom = getBottom(currentItem)
        if (currentItemBottom > compareItem.y) {
          compareItem.y = currentItemBottom
        }

        // 找到当前元素底下的元素
        if (bottomItem) {
          // 如果之前已经找到了，和之前的比较
          if (bottomItem.y > compareItem.y) {
            // 找到离当前元素最近的底部元素
            bottomItem = compareItem
          }
        } else {
          bottomItem = compareItem
        }
      }
    }
  })
  if (bottomItem) {
    currentItem.h = bottomItem.y - currentItem.y
  } else if (height > getBottom(currentItem)) {
    currentItem.h = height - currentItem.y
  }
}

// 元素处于同一行
function isOnRow(
  currentItem: AutoLayoutItemType,
  compareItem: AutoLayoutItemType
) {
  return (
    currentItem.id !== compareItem.id &&
    !(
      currentItem.y >= compareItem.y + compareItem.h ||
      currentItem.y + currentItem.h <= compareItem.y
    )
  )
}

// 元素处于同一列
function isOnCol(
  currentItem: AutoLayoutItemType,
  compareItem: AutoLayoutItemType
) {
  return (
    currentItem.id !== compareItem.id &&
    !(
      currentItem.x >= getRight(compareItem) ||
      getRight(currentItem) <= compareItem.x
    )
  )
}

interface SizeType {
  width: number
  height: number
}

function useLayoutedItems(value: AutoLayoutItemsType, sizeInfo: SizeType) {
  const [layouted, setLayoutEnd] = useState(false)
  const { width, height } = sizeInfo

  if (height === 0 || width === 0) {
    return { layoutedItems: value, layouted }
  }

  setTimeout(() => {
    setLayoutEnd(true)
  })

  // 计算固定值宽度
  const layoutedItems = [...value]

  // 向下补齐
  layoutedItems.forEach((currentItem) => {
    fillBottom(layoutedItems, currentItem, height)
  })

  layoutedItems.forEach((currentItem) => {
    // 向左补齐
    fillLeft(layoutedItems, currentItem)
    // 向右补齐
    fillRight(layoutedItems, currentItem)
  })

  return { layoutedItems, layouted }
}

function useAutoHeight({
  items,
  autoHeight,
}: {
  items: AutoLayoutItemsType
  autoHeight: boolean
}) {
  const maxBottom = (() => {
    if (!autoHeight || !Array.isArray(items) || items.length === 0) {
      return 0
    }

    return items.reduce((max, item) => {
      const y = typeof item.y === 'number' ? item.y : 0
      const h = typeof item.h === 'number' ? item.h : 0

      const currentBottom = y + h

      return Math.max(max, currentBottom)
    }, 0)
  })()

  return maxBottom
}

export const AutoLayoutPC = (props: AutoLayoutProps) => {
  const {
    className,
    style = {},
    xStep = DEFAULT_XSTEP,
    autoHeight,
    onItemRender,
  } = props
  const [sizeInfo, setSizeInfo] = useState<SizeType>({ height: 0, width: 0 })
  const [value, setValue] = useControllable<AutoLayoutProps, 'value'>({
    props,
    value: [],
  })

  const { layoutedItems, layouted } = useLayoutedItems(
    calculationLayout({
      layout: value,
      xStep,
      yStep: 1,
    }),
    sizeInfo
  )

  const height = useAutoHeight({
    items: layoutedItems,
    autoHeight: !!autoHeight,
  })

  return (
    <div
      {...mergeTag('auto-layout-pc', props)}
      className={cn('w-full', !autoHeight && 'h-full', className)}
      style={{
        ...style,
        ...(autoHeight ? { height } : {}),
      }}
    >
      <RcResizeObserver onResize={setSizeInfo}>
        <div className='relative h-full'>
          {layoutedItems.map((item) => {
            const { id, x, y, w, h } = item
            return (
              <div
                className='absolute!'
                key={id}
                style={{
                  height: h,
                  left: `${x}%`,
                  top: y,
                  width: `${w}%`,
                }}
              >
                {layouted &&
                  onItemRender({
                    item,
                    onHeightChange: (height) => {
                      setValue((value) =>
                        value.map((_item) => {
                          if (item.id === _item.id) {
                            return {
                              ..._item,
                              h: height,
                            }
                          }
                          return _item
                        })
                      )
                    },
                  })}
              </div>
            )
          })}
        </div>
      </RcResizeObserver>
    </div>
  )
}
