import { useContext, useEffect } from 'react'
import { DragListContext, DragDropContext, DragListDataItem } from './shared'
import { cn } from '../utils'
import { useInsertCursor } from '../insertCursor'

export const DragDropDivider = ({ index }: { index: number }) => {
  const { insert, onDividerRender } = useContext(DragListContext)
  const {
    insertCursor,
    activeInsertCursorMap,
    dropTargetIndex,
    onIsCurrentInsertCursorChange,
  } = useContext(DragListContext)
  const { dragState } = useContext(DragDropContext)
  const isDropTarget = dragState != null && dropTargetIndex === index

  const { isCurrentInsertCursor, activeInsertCursor } = useInsertCursor(
    (item: DragListDataItem) => {
      insert(index, item)
      setTimeout(() => {
        activeInsertCursorMap[index + 1]?.()
      })
    }
  )
  useEffect(() => {
    activeInsertCursorMap[index] = activeInsertCursor
    return () => {
      delete activeInsertCursor[index]
    }
  }, [activeInsertCursor, activeInsertCursorMap, index])

  useEffect(() => {
    onIsCurrentInsertCursorChange?.(isCurrentInsertCursor)
  }, [isCurrentInsertCursor, onIsCurrentInsertCursorChange])

  const createDivider = () => (
    <div
      className={cn(
        'hover:[&>div]:bg-secondary p-1',
        insertCursor && 'cursor-pointer'
      )}
      onClick={() => insertCursor && activeInsertCursor()}
    >
      <div
        className={cn([
          'h-[6px] rounded bg-transparent',
          (isCurrentInsertCursor || isDropTarget) && 'bg-secondary',
        ])}
      ></div>
    </div>
  )

  return onDividerRender ? onDividerRender({ createDivider }) : createDivider()
}
