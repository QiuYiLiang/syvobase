import { useRef } from 'react'
import { useDrag, useDrop, ConnectableElement } from 'react-dnd'
import { cn } from '@/utils'
import { Cell } from './Cell'
import { DragTo, TableNode, useTableContext } from './shared'
import { Portal } from '@/portal'
import { get } from '@syvobase/utils'
import { mergeTag } from '@/utils/tag'
import { GanttRowCells } from './GanttColumns'

export interface RowProps {
  node: TableNode
}

export const Row = (props: RowProps) => {
  const { node } = props
  const {
    tableKey,
    columns,
    hover,
    dragTo,
    checkboxPlacement,
    draggable,
    multiple,
    levelWidth,
    selectsMap,
    ganttMode,
    setDragTo,
    setNodeOpen,
    moveTo,
    getNode,
    canDrop,
    onRowClick,
  } = useTableContext()
  const dragKey = `${tableKey}Drag`
  const id = node.id
  const selected = !!selectsMap[id]
  const firstTdContent = useRef(null)
  const trRef = useRef<HTMLTableRowElement>(null)

  const getFirstContontLeft = () =>
    (firstTdContent as any).current.getBoundingClientRect().left
  const [, drop] = useDrop<any>({
    accept: dragKey,
    async hover({ id: hoverId }, monitor) {
      if (!draggable) {
        return
      }
      const currentOffset = monitor.getClientOffset()
      if (!currentOffset || typeof trRef === 'function' || !trRef?.current) {
        return
      }
      const toRect = trRef.current.getBoundingClientRect()
      setNodeOpen(hoverId, false)
      const position =
        currentOffset.y - toRect.y < toRect.y + toRect.height - currentOffset.y
          ? 'before'
          : currentOffset.x < getFirstContontLeft()
            ? 'after'
            : 'children'
      const dragTo: DragTo = {
        id,
        position,
        trRef,
      }
      if (
        typeof canDrop === 'function' &&
        (await canDrop({
          fromNode: getNode(hoverId),
          toNode: node,
          dragTo,
        }))
      ) {
        setDragTo(dragTo)
      }
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dragRef] = useDrag<any, unknown, { isDragging: boolean }>({
    type: dragKey,
    item: {
      id,
    },
    async end({ id }) {
      if (!draggable) {
        return
      }
      setDragTo(null)
      await moveTo(id)
      setDragTo(null)
    },
  })

  if (draggable) {
    drop(trRef as ConnectableElement)
  }

  const placementRow = checkboxPlacement === 'row'

  return (
    <tr
      {...mergeTag('table-row', props)}
      ref={trRef}
      className={cn(
        'relative',
        hover && placementRow && '[&:hover>td]:bg-secondary',
        placementRow && !multiple && selected && 'bg-secondary'
      )}
      data-key={node.id}
      onClick={() => onRowClick?.(node)}
    >
      {columns.map(({ id }: any, index: number) => {
        return (
          <Cell
            key={id}
            isFrist={index === 0}
            contentRef={firstTdContent}
            dragRef={dragRef}
            node={node}
            columnId={id}
            value={get(node.data, id)}
          />
        )
      })}
      {/* 甘特图列 */}
      {ganttMode && <GanttRowCells node={node} />}
      {dragTo && dragTo.id === id && trRef.current && (
        <Portal>
          <div
            className={'border-foreground absolute z-999999 border-t-2'}
            style={(() => {
              const trRect = trRef.current.getBoundingClientRect()
              const left =
                getFirstContontLeft() +
                (dragTo.position === 'children' ? levelWidth : 0)
              return {
                top: dragTo.position === 'before' ? trRect.top : trRect.bottom,
                left,
                width: trRect.right - left,
              }
            })()}
          >
            <div className='bg-foreground absolute top-[-5px] left-0 size-2 rounded-full'></div>
          </div>
        </Portal>
      )}
    </tr>
  )
}
