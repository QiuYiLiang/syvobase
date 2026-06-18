import { ReactNode, useState, useCallback, useRef, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  closestCenter,
  pointerWithin,
  CollisionDetection,
  getFirstCollision,
  UniqueIdentifier,
  MeasuringStrategy,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { Dict } from '@syvobase/utils'
import { mergeTag } from '@/utils/tag'

export interface KanbanProps extends BaseValueProps<Dict[]> {
  items: { id: string; name: ReactNode; color?: string }[]
  fieldNames?: { idKey?: string; groupKey?: string }
  onItemRender?: (data: Dict) => ReactNode
  onDrag?: (e: {
    data: Dict
    oldGroupId: string
    newGroupId: string
  }) => Promise<void> | void
}

export const Kanban = (props: KanbanProps) => {
  const {
    className,
    style,
    items,
    fieldNames = {},
    onDrag,
    onItemRender,
  } = props
  const { idKey = 'id', groupKey = 'group' } = fieldNames
  const [value, setValue] = useControllable({
    props,
    value: [] as Dict[],
  })
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [pendingGroup, setPendingGroup] = useState<string | null>(null)
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

  const activeData = activeId
    ? value.find((row) => row[idKey] === activeId)
    : null
  const originalGroup = activeData?.[groupKey] as string | undefined

  // 获取某个分组下的所有卡片 ID（考虑拖动中的临时分组和位置）
  const getItemIds = useCallback(
    (containerId: string) => {
      const containerItems = value
        .filter((row) => {
          const rowId = row[idKey]
          // 如果是当前拖动的卡片，根据临时分组判断
          if (activeId && rowId === activeId) {
            if (pendingGroup !== null) {
              return pendingGroup === containerId
            }
            return row[groupKey] === containerId
          }
          return row[groupKey] === containerId
        })
        .map((row) => row[idKey] as UniqueIdentifier)

      // 如果有 pendingIndex，调整拖动卡片的位置
      if (activeId && pendingIndex !== null && pendingGroup === containerId) {
        const activeIdIndex = containerItems.indexOf(activeId)
        if (activeIdIndex !== -1) {
          containerItems.splice(activeIdIndex, 1)
          containerItems.splice(pendingIndex, 0, activeId)
        }
      }

      return containerItems
    },
    [value, groupKey, idKey, activeId, pendingGroup, pendingIndex]
  )

  // 根据卡片 ID 找到所属的分组（考虑拖动中的临时分组）
  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      // 检查是否是分组 ID
      if (items.some((item) => item.id === id)) {
        return id as string
      }
      // 如果是当前拖动的卡片，使用临时分组
      if (activeId && id === activeId && pendingGroup !== null) {
        return pendingGroup
      }
      // 查找卡片所属的分组
      const card = value.find((row) => row[idKey] === id)
      return card ? (card[groupKey] as string) : null
    },
    [items, value, idKey, groupKey, activeId, pendingGroup]
  )

  // 自定义碰撞检测策略
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // 首先检查是否与任何 droppable 相交
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : closestCenter(args)

      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        // 如果悬停在分组上，检查分组内是否有卡片
        if (items.some((item) => item.id === overId)) {
          const containerItems = getItemIds(overId as string)
          if (containerItems.length > 0) {
            // 返回分组内最近的卡片
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id
          }
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, items, getItemIds]
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [value, pendingGroup])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (!over) return

    const overId = over.id
    const overContainer = findContainer(overId)
    if (!overContainer) return

    // 判断拖动卡片当前所在的分组（使用 pendingGroup 或原始分组）
    const currentGroup = pendingGroup ?? originalGroup

    if (overContainer !== currentGroup) {
      // 跨分组移动
      recentlyMovedToNewContainer.current = true
      setPendingGroup(overContainer)

      // 计算在新分组中的插入位置
      const overItems = value
        .filter((row) => row[groupKey] === overContainer)
        .map((row) => row[idKey])
      const overIndex = overItems.indexOf(overId)
      setPendingIndex(overIndex === -1 ? overItems.length : overIndex)
    } else {
      // 同分组内排序
      const currentItems = getItemIds(overContainer)
      const overIndex = currentItems.indexOf(overId)
      if (overIndex !== -1 && overIndex !== pendingIndex) {
        setPendingIndex(overIndex)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setPendingGroup(null)
      setPendingIndex(null)
      return
    }

    // 使用临时分组确定最终分组
    const finalGroup = pendingGroup ?? originalGroup
    const finalIndex = pendingIndex

    if (!originalGroup || !finalGroup) {
      setActiveId(null)
      setPendingGroup(null)
      setPendingIndex(null)
      return
    }

    // 判断是否有变更
    const hasGroupChanged = originalGroup !== finalGroup

    // 计算原始位置索引
    const originalItems = value.filter((row) => row[groupKey] === originalGroup)
    const activeIndex = originalItems.findIndex(
      (row) => row[idKey] === active.id
    )

    // 计算目标位置索引
    let targetIndex: number
    if (hasGroupChanged) {
      // 跨分组时，使用 pendingIndex 或放到末尾
      const targetGroupItems = value.filter(
        (row) => row[groupKey] === finalGroup
      )
      targetIndex = finalIndex ?? targetGroupItems.length
    } else {
      // 同分组时，使用 pendingIndex 或原位置
      targetIndex = finalIndex ?? activeIndex
    }

    const hasSortChanged = !hasGroupChanged && activeIndex !== targetIndex

    if (hasGroupChanged || hasSortChanged) {
      const data = value.find((row) => row[idKey] === active.id)!

      if (hasGroupChanged) {
        // 跨分组移动：更新卡片的分组并调整位置
        setValue((prev) => {
          // 先移除原位置的卡片
          const filtered = prev.filter((row) => row[idKey] !== active.id)
          const updatedData = { ...data, [groupKey]: finalGroup }

          // 找到目标分组的卡片并插入到正确位置
          const targetGroupItems = filtered.filter(
            (row) => row[groupKey] === finalGroup
          )
          const otherItems = filtered.filter(
            (row) => row[groupKey] !== finalGroup
          )

          const insertIndex = Math.min(targetIndex, targetGroupItems.length)
          targetGroupItems.splice(insertIndex, 0, updatedData)

          return [...otherItems, ...targetGroupItems]
        })
      } else if (hasSortChanged) {
        // 在同一分组内排序
        setValue((prev) => {
          const containerItems = prev.filter(
            (row) => row[groupKey] === originalGroup
          )
          const otherItems = prev.filter(
            (row) => row[groupKey] !== originalGroup
          )
          const sortedItems = arrayMove(
            containerItems,
            activeIndex,
            targetIndex
          )
          return [...otherItems, ...sortedItems]
        })
      }

      // 在拖放完成时触发回调
      onDrag?.({
        data,
        oldGroupId: originalGroup,
        newGroupId: finalGroup,
      })
    }

    setActiveId(null)
    setPendingGroup(null)
    setPendingIndex(null)
  }

  return (
    <DndContext
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: { strategy: MeasuringStrategy.Always },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        {...mergeTag('kanban', props)}
        className={cn('flex w-full gap-4 overflow-x-auto', className)}
        style={style}
      >
        {items.map(({ id, name, color }) => {
          const columnItems = getItemIds(id)
          return (
            <KanbanBoard key={id} id={id} items={columnItems}>
              <div className={cn('flex items-center gap-2')}>
                {color ? (
                  <div
                    className='h-2 w-2 rounded-full'
                    style={{ backgroundColor: color }}
                  />
                ) : (
                  <div></div>
                )}
                <p className='m-0 font-semibold'>{name}</p>
              </div>

              <div className={cn('flex flex-1 flex-col gap-2')}>
                {columnItems.map((itemId) => {
                  const row = value.find((r) => r[idKey] === itemId)
                  if (!row) return null
                  return (
                    <KanbanCard key={row[idKey]} id={row[idKey]}>
                      {onItemRender ? onItemRender(row) : row[idKey]}
                    </KanbanCard>
                  )
                })}
              </div>
            </KanbanBoard>
          )
        })}
      </div>
      <DragOverlay>
        {activeId && activeData ? (
          <div className='bg-background cursor-grabbing rounded-md p-3 shadow-lg'>
            {onItemRender ? onItemRender(activeData) : activeData[idKey]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export interface KanbanBoardProps {
  id: string
  items: UniqueIdentifier[]
  children: ReactNode
}

export const KanbanBoard = ({ id, items, children }: KanbanBoardProps) => {
  const { setNodeRef, isOver } = useSortable({
    id,
    data: { type: 'container', children: items },
  })

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div
        className={cn(
          'border-secondary bg-secondary flex h-full min-h-40 w-72 flex-col gap-2 rounded-md border-2 p-2 text-sm',
          isOver && 'border-primary border-2'
        )}
        ref={setNodeRef}
      >
        {children}
      </div>
    </SortableContext>
  )
}

export interface KanbanCardProps {
  id: string
  children?: ReactNode
  className?: string
}

export const KanbanCard = ({ id, children }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { type: 'card' } })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-background rounded-md p-3 transition-transform',
        isDragging && 'opacity-50'
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}
