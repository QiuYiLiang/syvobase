import { cn } from '@/utils'
import { DragListItem } from './DragListItem'
import { DragListProps, DragListContext, DragDropContext } from './shared'
import { DragDropDivider } from './DragDropDivider'
import { useCallback, useContext, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Dict } from '@syvobase/utils'
import { mergeTag } from '@/utils/tag'

export const DragList = (props: DragListProps) => {
  const {
    className,
    data = [],
    insertCursor = false,
    onChange,
    onItemRender,
    onDividerRender,
    onIsCurrentInsertCursorChange,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const activeInsertCursorMap = useRef<Dict>({}).current
  const { dragState, setDragState } = useContext(DragDropContext)
  const parentDragListCtx = useContext(DragListContext)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const clearDropTarget = useCallback(() => setDropTargetIndex(null), [])

  // 使用 ref 避免闭包过期
  const dataRef = useRef(data)
  dataRef.current = data
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const insert = useCallback((index: number, item: any) => {
    const newData = [...dataRef.current]
    newData.splice(index, 0, item)
    onChangeRef.current?.(newData)
  }, [])

  const removeItem = useCallback((id: string) => {
    const newData = dataRef.current.filter((d) => d.id !== id)
    onChangeRef.current?.(newData)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!dragState || !ref.current) return

      // 禁止父元素拖入子元素内部的掉落区域
      if (dragState.sourceElement?.contains(ref.current)) return

      // 当前列表是有效目标，阻止冒泡到父级 DragList
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'move'

      // 清除父级列表的拖拽指示器
      parentDragListCtx?.clearDropTarget?.()

      const items = Array.from(
        ref.current.querySelectorAll(':scope > [data-drag-item-id]')
      )
      let targetIndex = data.length

      for (let i = 0; i < items.length; i++) {
        const rect = items[i].getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        if (e.clientY < midY) {
          targetIndex = i
          break
        }
      }

      // 同列表内拖到原位不显示指示器
      const isSameList = data.some((d) => d.id === dragState.item.id)
      if (isSameList) {
        const fromIndex = data.findIndex((d) => d.id === dragState.item.id)
        if (targetIndex === fromIndex || targetIndex === fromIndex + 1) {
          setDropTargetIndex(null)
          return
        }
      }

      setDropTargetIndex(targetIndex)
    },
    [dragState, data, parentDragListCtx]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!dragState || dropTargetIndex === null) return

      // 禁止父元素拖入子元素内部
      if (dragState.sourceElement?.contains(ref.current)) return

      const currentData = dataRef.current
      const isSameList = currentData.some((d) => d.id === dragState.item.id)

      if (isSameList) {
        const newData = [...currentData]
        const fromIndex = newData.findIndex((d) => d.id === dragState.item.id)
        if (
          fromIndex === dropTargetIndex ||
          fromIndex + 1 === dropTargetIndex
        ) {
          setDropTargetIndex(null)
          setDragState(null)
          return
        }
        newData.splice(fromIndex, 1)
        const adjustedIndex =
          dropTargetIndex > fromIndex ? dropTargetIndex - 1 : dropTargetIndex
        newData.splice(adjustedIndex, 0, dragState.item)
        onChangeRef.current?.(newData)
      } else {
        // flushSync 确保 removeFromSource 的状态更新先同步提交，
        // 这样 dataRef.current 才能反映移除后的最新数据，
        // 避免嵌套场景下两个 setState 批处理导致后者覆盖前者
        flushSync(() => {
          dragState.removeFromSource()
        })
        const newData = [...dataRef.current]
        newData.splice(dropTargetIndex, 0, dragState.item)
        onChangeRef.current?.(newData)
      }

      setDropTargetIndex(null)
      setDragState(null)
    },
    [dragState, dropTargetIndex, setDragState]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (!ref.current?.contains(e.relatedTarget as Node)) {
        setDropTargetIndex(null)
      }
      // 子列表离开事件不冒泡到父列表
      if (dragState && !dragState.sourceElement?.contains(ref.current)) {
        e.stopPropagation()
      }
    },
    [dragState]
  )

  return (
    <DragListContext
      value={{
        insertCursor,
        activeInsertCursorMap,
        dropTargetIndex,
        clearDropTarget,
        insert,
        removeItem,
        onItemRender,
        onIsCurrentInsertCursorChange,
        onDividerRender,
      }}
    >
      <div
        {...mergeTag('drag-list', props)}
        className={cn('px-2', className)}
        ref={ref}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        <DragDropDivider index={0} />
        {data.map((item, index) => (
          <DragListItem index={index} item={item} key={item.id} />
        ))}
      </div>
    </DragListContext>
  )
}
