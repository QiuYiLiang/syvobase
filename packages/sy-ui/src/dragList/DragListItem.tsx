import { useContext, useEffect, useRef } from 'react'
import { DragListDataItem, DragListContext, DragDropContext } from './shared'
import { DragDropDivider } from './DragDropDivider'
import { Button } from '@/button'
import { InsertCursorContext } from '@/insertCursor'

export const DragListItem = ({
  item,
  index,
}: {
  item: DragListDataItem
  index: number
}) => {
  const { onItemRender, removeItem } = useContext(DragListContext)
  const { dragState, setDragState } = useContext(DragDropContext)
  const { setInsertCursor } = useContext(InsertCursorContext)
  const itemRef = useRef<HTMLDivElement>(null)
  const isFromHandle = useRef(false)
  const isDragging = dragState?.item.id === item.id

  useEffect(() => {
    const handleMouseUp = () => {
      isFromHandle.current = false
    }
    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const handleDragStart = (e: React.DragEvent) => {
    if (!isFromHandle.current) {
      e.preventDefault()
      return
    }
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', item.id)
    setInsertCursor('')
    setDragState({
      item,
      sourceElement: itemRef.current,
      removeFromSource: () => removeItem(item.id),
    })
  }

  const handleDragEnd = () => {
    isFromHandle.current = false
    setDragState(null)
  }

  const dragHandleProps = {
    onMouseDown: () => {
      isFromHandle.current = true
    },
    style: { cursor: 'grab' as const },
  }

  const dragHandle = (
    <div {...dragHandleProps}>
      <Button icon='GripVertical' type='ghost' />
    </div>
  )

  return (
    <div
      ref={itemRef}
      data-drag-item-id={item.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {onItemRender({ item, dragHandle, dragHandleProps })}
      {!isDragging && <DragDropDivider index={index + 1} />}
    </div>
  )
}
