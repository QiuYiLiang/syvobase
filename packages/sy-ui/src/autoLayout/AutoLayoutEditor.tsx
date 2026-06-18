import { useContext, useEffect, useRef, useState } from 'react'
import {
  AutoLayoutEditorContext,
  AutoLayoutItemsType,
  AutoLayoutProps,
  calculationLayout,
  DEFAULT_XSTEP,
  DEFAULT_YSTEP,
  isSameLayout,
  type AutoLayoutItemType,
} from './shared'
import { cn, useControllable } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Icon } from '@/icon'

export const AutoLayoutEditor = (props: AutoLayoutProps) => {
  const {
    xStep = DEFAULT_XSTEP,
    yStep = DEFAULT_YSTEP,
    padding = 5,
    canDrop,
    className,
    style = {},
    onItemRender,
  } = props
  const { draggingInfo, setDraggingInfo } = useContext(AutoLayoutEditorContext)
  const [value, _setValue] = useControllable<AutoLayoutProps, 'value'>({
    props,
    value: [],
  })

  const setValue = (layout: AutoLayoutItemType[]) => {
    if (!isSameLayout(layout, value)) {
      _setValue(layout)
    }
  }

  const dropElRef = useRef<HTMLDivElement>(null)
  const computedLayout = calculationLayout({
    layout: value,
    xStep,
    yStep,
  })

  const [fixedItem, setFixedItem] = useState<{
    type: 'resize' | 'drag'
    el: HTMLElement
    id: string
    dropRect: DOMRect
    x: number
    y: number
    w: number
    h: number
    scrollTop: number
    scrollLeft: number
  } | null>(null)

  const { displayLayout, appendItems } = (() => {
    if (draggingInfo) {
      // 拖动中

      if (fixedItem?.type === 'drag') {
        if (draggingInfo.dropEl === dropElRef.current) {
          // 单布局拖动
          const displayLayout = calculationLayout({
            layout: computedLayout.map((item) => {
              if (item.id === draggingInfo.item.id) {
                return draggingInfo.item
              } else {
                return item
              }
            }),
            xStep,
            yStep,
          })
          return {
            appendItems: [
              {
                ...displayLayout.find(({ id }) => id === draggingInfo.item.id),
                id: '__autoLayoutEditorShadowItem__',
              },
            ] as AutoLayoutItemsType,
            displayLayout: calculationLayout({
              layout: computedLayout.map((item) => {
                if (item.id === draggingInfo.item.id) {
                  return draggingInfo.item
                } else {
                  return item
                }
              }),
              xStep,
              yStep,
            }),
          }
        } else {
          // 从当前布局拖走
          return {
            appendItems: [draggingInfo.item],
            displayLayout: calculationLayout({
              layout: computedLayout.filter(
                (item) => item.id !== draggingInfo.item.id
              ),
              xStep,
              yStep,
            }),
          }
        }
      }

      if (draggingInfo.dropEl === dropElRef.current) {
        // 跨布局拖动，拖到该布局
        return {
          appendItems: [],
          displayLayout: calculationLayout({
            layout: [...computedLayout, draggingInfo.item],
            xStep,
            yStep,
          }),
        }
      }
    }

    if (fixedItem?.type === 'resize') {
      const dropEl = dropElRef.current!
      const rect = dropEl.getBoundingClientRect()
      const unitWidth = rect.width * (xStep / 100)
      const width =
        Math.ceil(Math.floor(fixedItem.w / (unitWidth / 2)) / 2) * xStep

      const height =
        Math.ceil(Math.floor(fixedItem.h / (yStep / 2)) / 2) * yStep

      const displayLayout = calculationLayout({
        layout: computedLayout.map((item) =>
          item.id === fixedItem.id
            ? {
                ...item,
                w: width,
                h: height,
              }
            : item
        ),
        xStep,
        yStep,
      })

      return {
        appendItems: [
          {
            ...displayLayout.find((item) => item.id === fixedItem.id),
            id: `__autoLayoutEditorShadowItem__`,
          },
        ] as AutoLayoutItemType[],
        displayLayout,
      }
    }
    return {
      appendItems: [],
      displayLayout: computedLayout,
    }
  })()

  if (dropElRef.current) {
    ;(dropElRef.current as any).displayLayout = displayLayout
    ;(dropElRef.current as any).setLayoutValue = setValue
  }

  const height =
    displayLayout.map(({ y, h }) => y + h).sort((a, b) => b - a)?.[0] || 0

  const onDropElMove = (e: any, dropEl: any) => {
    if (!draggingInfo || !dropEl) {
      return
    }

    if (
      draggingInfo.dropEl !== dropEl &&
      (typeof canDrop === 'function' ? canDrop(draggingInfo.item) : true)
    ) {
      setDraggingInfo({
        ...draggingInfo!,
        dropEl,
      })
    }
    if (!dropEl || !draggingInfo) {
      return
    }
    const rect = dropEl.getBoundingClientRect()
    const unitWidth = rect.width * (xStep / 100)

    const left =
      Math.floor(
        (e.clientX - rect.left + dropEl.scrollLeft - draggingInfo.offsetLeft) /
          unitWidth
      ) * xStep
    const top =
      Math.floor(
        (e.clientY - rect.top + dropEl.scrollTop - draggingInfo.offsetTop) /
          yStep
      ) * yStep
    if (draggingInfo.item.x === left && draggingInfo.item.y === top) {
      return
    }
    draggingInfo.item.x = left
    draggingInfo.item.y = top
    const displayLayout: AutoLayoutItemType[] = dropEl.displayLayout

    let oldX, oldY
    const newDisplayLayout = displayLayout.filter((item) => {
      if (item.id === draggingInfo.item.id) {
        oldX = item.x
        oldY = item.y
        return false
      }
      return true
    })

    const { x, y } = calculationLayout({
      layout: [...newDisplayLayout, draggingInfo.item],
      xStep,
      yStep,
    }).find(({ id }) => id === draggingInfo.item.id) as AutoLayoutItemType
    if (!(oldX === x && oldY === y)) {
      setDraggingInfo({ ...draggingInfo })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMouseMove = (e: any) => {
    e.stopPropagation()
    if (fixedItem?.type === 'resize') {
      const { clientX, clientY } = e
      let width = clientX - fixedItem.dropRect.x - fixedItem.x + padding + 12
      let height = clientY - fixedItem.dropRect.y - fixedItem.y + padding + 12
      if (width < 50) {
        width = 50
      } else if (width > fixedItem.dropRect.width - fixedItem.x) {
        width = fixedItem.dropRect.width - fixedItem.x
      }
      if (height < 50) {
        height = 50
      }
      const style = {
        left: fixedItem.x + fixedItem.scrollLeft,
        top: fixedItem.y + fixedItem.scrollTop,
        width,
        height,
        zIndex: 99999999,
        userSelect: 'none',
      }
      for (const key in style) {
        ;(fixedItem.el.style as any)[key] = style[key]
      }
      setFixedItem((value) => ({
        ...value!,
        w: width,
        h: height,
      }))
    } else if (draggingInfo && fixedItem?.type === 'drag') {
      const { clientX, clientY } = e

      const style = {
        left: clientX - draggingInfo.offsetLeft,
        top: clientY - draggingInfo.offsetTop,
      }
      for (const key in style) {
        ;(fixedItem.el.style as any)[key] = style[key]
      }
      setFixedItem((value) => ({
        ...value!,
        x: style.left,
        y: style.top,
      }))

      const dropEl = Array.from(
        document.querySelectorAll('div[data-auto-layout]')
      )
        .toReversed()
        .find((el) => {
          // 不允许拖入正在拖动的元素内部的布局
          if (fixedItem?.el.contains(el)) return false
          const rect = el.getBoundingClientRect()
          return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          )
        }) as any
      onDropElMove(e, dropEl)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMouseUp = (e) => {
    e.stopPropagation()
    if (fixedItem?.type === 'resize') {
      setValue(displayLayout)
      setFixedItem(null)
    } else if (draggingInfo && fixedItem?.type === 'drag') {
      const sourceDropEl = dropElRef.current as any
      const targetDropEl = draggingInfo.dropEl as any
      const sourceSetLayoutValue = sourceDropEl.setLayoutValue
      const targetSetLayoutValue = targetDropEl.setLayoutValue
      sourceSetLayoutValue(sourceDropEl.displayLayout)
      if (sourceSetLayoutValue !== targetSetLayoutValue) {
        targetSetLayoutValue!(targetDropEl.displayLayout)
      }
      setDraggingInfo(null)
      setFixedItem(null)
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      ref={dropElRef}
      {...mergeTag('auto-layout-editor', props)}
      className={cn('relative min-h-9 w-full overflow-auto', className)}
      data-auto-layout
      style={{
        height: height + padding / 2,
        padding: padding / 2,
        ...style,
      }}
      onDragOver={(e) => {
        e.stopPropagation()
        onDropElMove(e, dropElRef.current)
      }}
    >
      {[...displayLayout, ...appendItems].map((item) => {
        const { id, x, y, w, h } = item
        const itemRef = {
          current: null,
        }
        const isShadowItem =
          id === '__autoLayoutEditorShadowItem__' ||
          (draggingInfo?.dropEl === dropElRef.current &&
            !fixedItem &&
            draggingInfo.item.id === id)
        const isFixedItem = !isShadowItem && fixedItem?.id === id
        return (
          <div
            key={id}
            ref={itemRef}
            className={cn('bg-background absolute transition-all duration-100')}
            style={{
              willChange: 'top, left, width, height',
              padding: padding / 2,
              ...(isFixedItem
                ? {
                    position:
                      draggingInfo && fixedItem.type === 'drag'
                        ? 'fixed'
                        : 'absolute',
                    transition: 'none',
                    left:
                      fixedItem.type === 'drag'
                        ? fixedItem.x
                        : fixedItem.x + fixedItem.scrollLeft,
                    top:
                      fixedItem.type === 'drag'
                        ? fixedItem.y
                        : fixedItem.y + fixedItem.scrollTop,
                    width: fixedItem.w,
                    height: fixedItem.h,
                    zIndex: 99999999,
                    userSelect: 'none',
                  }
                : {
                    left: `${x}%`,
                    top: `${y}px`,
                    width: `${w}%`,
                    height: `${h}px`,
                  }),
            }}
          >
            {isShadowItem ? (
              <div className={cn('bg-muted/50 h-full w-full rounded-lg')}></div>
            ) : (
              <>
                <div
                  className={cn(
                    'absolute top-2 left-2 z-999 size-6 cursor-pointer'
                  )}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    const el = itemRef.current as any as HTMLElement
                    const elRect = el.getBoundingClientRect()
                    const offsetLeft = e.clientX - elRect.left
                    const offsetTop = e.clientY - elRect.top
                    const dropEl = dropElRef.current as any
                    setFixedItem({
                      el,
                      type: 'drag',
                      id,
                      dropRect: dropEl.getBoundingClientRect(),
                      x: elRect.x,
                      y: elRect.y,
                      h: elRect.height,
                      w: elRect.width,
                      scrollTop: dropEl.scrollTop ?? 0,
                      scrollLeft: dropEl.scrollLeft ?? 0,
                    })

                    setDraggingInfo({
                      dropEl: dropElRef.current!,
                      item,
                      offsetLeft,
                      offsetTop,
                    })
                  }}
                >
                  <div className='border-border bg-background flex size-6 items-center justify-center rounded-md border text-sm font-medium'>
                    <Icon name='GripVertical' />
                  </div>
                </div>
                <div
                  className={cn(
                    'border-border absolute right-1 bottom-1 z-999 size-4 cursor-nwse-resize rounded-br-lg border-r-2 border-b-2 bg-none'
                  )}
                  style={{
                    right: padding / 2,
                    bottom: padding / 2,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    const el = itemRef.current as any as HTMLElement
                    const elRect = el.getBoundingClientRect()
                    const dropEl = dropElRef.current as any
                    const dropRect = dropEl.getBoundingClientRect()
                    setFixedItem({
                      el,
                      type: 'resize',
                      id,
                      dropRect,
                      x: elRect.x - dropRect.x,
                      y: elRect.y - dropRect.y,
                      h: elRect.height,
                      w: elRect.width,
                      scrollTop: dropEl.scrollTop ?? 0,
                      scrollLeft: dropEl.scrollLeft ?? 0,
                    })
                  }}
                ></div>

                <div
                  className={cn(
                    'border-border h-full w-full overflow-auto rounded-lg border border-dashed'
                  )}
                >
                  {onItemRender
                    ? onItemRender({
                        item,
                        onDelete: () => {
                          setValue(
                            calculationLayout({
                              layout: computedLayout.filter(
                                (item) => item.id !== id
                              ),
                              xStep,
                              yStep,
                            })
                          )
                        },
                      })
                    : id}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
