import { KeyboardEvent, memo, useEffect, useRef, useState } from 'react'
import { MindmapNodeData, MindmapDirection, DragPreviewState } from './types'
import { cn } from '@/utils'
import { IconName } from '@/icon'
import { ContextMenu } from '@/contextMenu'
import { DropdownMenuType } from '@/dropdown'
import { setCurrentDraggedNodeIds } from './shared'

export interface MindmapNodeProps {
  node: MindmapNodeData
  depth: number
  isRoot: boolean
  selectedNodeId: string | null
  selectedNodeIds?: string[]
  isEditingMode: boolean
  direction: MindmapDirection
  editable: boolean
  dragPreview?: DragPreviewState | null
  /** 覆盖 hasChildren 判断，用于根节点（因为根节点传入的 children 被清空） */
  actualHasChildren?: boolean
  onSelect: (nodeId: string, addToSelection?: boolean) => void
  onStartEditing: () => void
  onStopEditing: () => void
  onUpdateTopic: (nodeId: string, topic: string) => void
  onAddChild: (parentId: string) => void
  onAddSibling: (nodeId: string) => void
  onDelete: (nodeId: string) => void
  onDeleteNodes?: (nodeIds: string[]) => void
  onMoveNode?: (nodeId: string, newParentId: string, index?: number) => void
  onMoveNodes?: (nodeIds: string[], newParentId: string) => void
  onMoveNodeAsSibling?: (
    nodeId: string,
    targetId: string,
    position: 'before' | 'after'
  ) => void
  onMoveNodesAsSibling?: (
    nodeIds: string[],
    targetId: string,
    position: 'before' | 'after'
  ) => void
  onToggleExpand: (nodeId: string) => void
  onDragPreviewChange?: (preview: DragPreviewState | null) => void
  onHoverNode?: (nodeId: string | null) => void
}

const NODE_COLORS = [
  'bg-primary text-primary-foreground',
  'bg-blue-500 text-white',
  'bg-green-500 text-white',
  'bg-purple-500 text-white',
  'bg-orange-500 text-white',
  'bg-pink-500 text-white',
  'bg-cyan-500 text-white',
]

const getNodeColor = (depth: number, isRoot: boolean) => {
  if (isRoot) return NODE_COLORS[0]
  return (
    NODE_COLORS[Math.min(depth, NODE_COLORS.length - 1)] ||
    'bg-secondary text-secondary-foreground'
  )
}

export const MindmapNode = memo(
  function MindmapNode({
    node,
    depth,
    isRoot,
    selectedNodeId,
    selectedNodeIds = [],
    isEditingMode,
    direction,
    editable,
    dragPreview,
    actualHasChildren,
    onSelect,
    onStartEditing,
    onStopEditing,
    onUpdateTopic,
    onAddChild,
    onAddSibling,
    onDelete,
    onDeleteNodes,
    onMoveNode,
    onMoveNodes,
    onMoveNodeAsSibling,
    onMoveNodesAsSibling,
    onToggleExpand,
    onDragPreviewChange,
    onHoverNode,
  }: MindmapNodeProps) {
    const isSelected =
      selectedNodeId === node.id || selectedNodeIds.includes(node.id)
    const isEditing = selectedNodeId === node.id && isEditingMode
    const nodeRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [editValue, setEditValue] = useState(node.topic)
    const hasChildren =
      actualHasChildren ?? (node.children && node.children.length > 0)
    const isExpanded = node.expanded !== false

    const maxWidth = isRoot ? 800 : 700

    useEffect(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.select()
      }
    }, [isEditing])

    useEffect(() => {
      if (isSelected && !isEditing && nodeRef.current) {
        requestAnimationFrame(() => {
          nodeRef.current?.focus()
        })
      }
    }, [isSelected, isEditing])

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      const addToSelection = e.ctrlKey || e.metaKey
      onSelect(node.id, addToSelection)
      requestAnimationFrame(() => {
        nodeRef.current?.focus()
      })
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (editable) {
        setEditValue(node.topic)
        onSelect(node.id)
        setTimeout(() => {
          onStartEditing()
        }, 0)
      }
    }

    const handleInputBlur = () => {
      onUpdateTopic(node.id, editValue)
      onStopEditing()
    }

    const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleInputBlur()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setEditValue(node.topic)
        onStopEditing()
      }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) return

      switch (e.key) {
        case 'Tab':
          e.preventDefault()
          e.stopPropagation()
          if (editable) onAddChild(node.id)
          break
        case 'Enter':
          e.preventDefault()
          e.stopPropagation()
          if (editable) {
            if (e.shiftKey) {
              setEditValue(node.topic)
              onStartEditing()
            } else if (isRoot) {
              onAddChild(node.id)
            } else {
              onAddSibling(node.id)
            }
          }
          break
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          e.stopPropagation()
          if (editable) {
            if (selectedNodeIds.length > 1 && onDeleteNodes) {
              onDeleteNodes(selectedNodeIds)
            } else if (!isRoot) {
              onDelete(node.id)
            }
          }
          break
        case ' ':
          e.preventDefault()
          e.stopPropagation()
          if (hasChildren) {
            onToggleExpand(node.id)
          }
          break
        case 'F2':
          e.preventDefault()
          e.stopPropagation()
          if (editable) {
            setEditValue(node.topic)
            onStartEditing()
          }
          break
        default:
          if (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey &&
            editable
          ) {
            e.preventDefault()
            e.stopPropagation()
            setEditValue(e.key)
            onStartEditing()
          }
          break
      }
    }

    const handleDragStart = (e: React.DragEvent) => {
      if (isRoot || isEditing || !editable) {
        e.preventDefault()
        return
      }
      // 如果当前节点在选中列表中，拖拽所有选中的节点（排除根节点）
      if (selectedNodeIds.includes(node.id) && selectedNodeIds.length > 1) {
        const nodesToDrag = selectedNodeIds.filter((id) => id !== node.id)
        const dragIds = [node.id, ...nodesToDrag]
        setCurrentDraggedNodeIds(dragIds)
        e.dataTransfer.setData('mindmap-node-ids', JSON.stringify(dragIds))
      } else {
        setCurrentDraggedNodeIds([node.id])
        e.dataTransfer.setData('mindmap-node-ids', JSON.stringify([node.id]))
      }
      e.dataTransfer.setData('mindmap-node-id', node.id)
      e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragEnd = () => {
      setCurrentDraggedNodeIds([])
      if (onDragPreviewChange) {
        onDragPreviewChange(null)
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      // 不阻止冒泡，让全局 handleGlobalDragOver 处理
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      // 不阻止冒泡
    }

    // 节点级 drop 处理 - 由全局 handleGlobalDrop 处理，这里只需阻止默认行为
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      // 不阻止冒泡，让全局 handleGlobalDrop 处理
    }

    const contextMenuItems: DropdownMenuType = editable
      ? [
          {
            name: '添加子节点',
            icon: 'Plus' as IconName,
            onClick: () => onAddChild(node.id),
          },
          ...(!isRoot
            ? [
                {
                  name: '添加同级节点',
                  icon: 'ListPlus' as IconName,
                  onClick: () => onAddSibling(node.id),
                },
              ]
            : []),
          { type: 'separator' as const },
          {
            name: '编辑',
            icon: 'Pencil' as IconName,
            onClick: () => {
              setEditValue(node.topic)
              onStartEditing()
            },
          },
          ...(!isRoot
            ? [
                {
                  name: '删除',
                  icon: 'Trash2' as IconName,
                  onClick: () => onDelete(node.id),
                },
              ]
            : []),
          ...(hasChildren
            ? [
                { type: 'separator' as const },
                {
                  name: isExpanded ? '收起' : '展开',
                  icon: (isExpanded ? 'ChevronUp' : 'ChevronDown') as IconName,
                  onClick: () => onToggleExpand(node.id),
                },
              ]
            : []),
        ]
      : []

    const nodeContent = (
      <div
        className='relative'
        style={{ margin: '-12px 0', padding: '12px 0' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          ref={nodeRef}
          className={cn(
            'mindmap-node mindmap-node-content relative flex items-start gap-1 rounded-lg px-3 py-1.5 transition-all duration-200',
            isRoot
              ? 'cursor-grab px-4 py-2 text-base font-semibold'
              : 'cursor-pointer text-sm',
            isRoot
              ? getNodeColor(depth, true)
              : depth === 1
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground',
            isSelected &&
              'ring-ring ring-offset-background ring-2 ring-offset-2',
            // 拖拽时的目标父节点高亮（蓝色）
            dragPreview?.targetParentId === node.id &&
              'shadow-lg! ring-2! ring-blue-500! ring-offset-2!',
            'hover:shadow-md',
            'focus-visible:ring-ring focus:outline-none focus-visible:ring-2'
          )}
          style={{
            ...node.style,
            maxWidth,
            wordBreak: 'break-word',
          }}
          tabIndex={0}
          draggable={editable && !isRoot && !isEditing}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMouseEnter={() => onHoverNode?.(node.id)}
          onMouseLeave={() => onHoverNode?.(null)}
          data-node-id={node.id}
          data-is-root={isRoot ? 'true' : undefined}
        >
          {isEditing ? (
            <div className='relative inline-block'>
              <span
                className={cn(
                  'invisible whitespace-pre-wrap',
                  isRoot ? 'text-base font-semibold' : 'text-sm'
                )}
                style={{
                  display: 'block',
                  minWidth: '1em',
                  minHeight: isRoot ? '1.5em' : '1.25em',
                  maxWidth: maxWidth - (isRoot ? 32 : 24),
                  wordBreak: 'break-word',
                }}
              >
                {editValue || ' '}
              </span>
              <textarea
                ref={textareaRef}
                className={cn(
                  'absolute inset-0 resize-none border-none bg-transparent outline-none',
                  'font-inherit text-inherit'
                )}
                style={{
                  overflow: 'hidden',
                }}
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value)
                }}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <span
              style={{
                wordBreak: 'break-word',
                minHeight: isRoot ? '1.5em' : '1.25em',
                display: 'inline-block',
              }}
            >
              {node.topic || '\u00A0'}
            </span>
          )}
        </div>
      </div>
    )

    const renderChildren = () => {
      if (!hasChildren || !isExpanded) return null

      return (
        <div
          className={cn(
            'flex flex-col gap-1',
            direction === 'left' ? 'items-end' : 'items-start'
          )}
        >
          {node.children!.map((child) => (
            <MindmapNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isRoot={false}
              selectedNodeId={selectedNodeId}
              selectedNodeIds={selectedNodeIds}
              isEditingMode={isEditingMode}
              direction={direction}
              editable={editable}
              dragPreview={dragPreview}
              onSelect={onSelect}
              onStartEditing={onStartEditing}
              onStopEditing={onStopEditing}
              onUpdateTopic={onUpdateTopic}
              onAddChild={onAddChild}
              onAddSibling={onAddSibling}
              onDelete={onDelete}
              onDeleteNodes={onDeleteNodes}
              onMoveNode={onMoveNode}
              onMoveNodes={onMoveNodes}
              onMoveNodeAsSibling={onMoveNodeAsSibling}
              onMoveNodesAsSibling={onMoveNodesAsSibling}
              onToggleExpand={onToggleExpand}
              onDragPreviewChange={onDragPreviewChange}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        className={cn(
          'mindmap-branch group/branch flex items-center',
          direction === 'left' ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {editable ? (
          <ContextMenu items={contextMenuItems}>{nodeContent}</ContextMenu>
        ) : (
          nodeContent
        )}

        {hasChildren && isExpanded && <div className='w-6' />}

        {renderChildren()}
      </div>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.selectedNodeId !== nextProps.selectedNodeId) return false
    if (prevProps.isEditingMode !== nextProps.isEditingMode) return false
    if (prevProps.node !== nextProps.node) return false
    if (prevProps.direction !== nextProps.direction) return false
    if (prevProps.editable !== nextProps.editable) return false

    // 检查 dragPreview 是否变化（影响目标父节点高亮）
    const prevIsTarget =
      prevProps.dragPreview?.targetParentId === prevProps.node.id
    const nextIsTarget =
      nextProps.dragPreview?.targetParentId === nextProps.node.id
    if (prevIsTarget !== nextIsTarget) return false

    const prevIds = prevProps.selectedNodeIds || []
    const nextIds = nextProps.selectedNodeIds || []
    if (prevIds.length !== nextIds.length) return false
    const prevHas = prevIds.includes(prevProps.node.id)
    const nextHas = nextIds.includes(nextProps.node.id)
    if (prevHas !== nextHas) return false

    return true
  }
)

export interface MindmapTreeProps {
  data: MindmapNodeData
  selectedNodeId: string | null
  selectedNodeIds?: string[]
  isEditing: boolean
  direction: MindmapDirection
  editable: boolean
  dragPreview?: DragPreviewState | null
  onSelect: (nodeId: string, addToSelection?: boolean) => void
  onStartEditing: () => void
  onStopEditing: () => void
  onUpdateTopic: (nodeId: string, topic: string) => void
  onAddChild: (parentId: string) => void
  onAddSibling: (nodeId: string) => void
  onDelete: (nodeId: string) => void
  onDeleteNodes?: (nodeIds: string[]) => void
  onMoveNode?: (nodeId: string, newParentId: string, index?: number) => void
  onMoveNodes?: (nodeIds: string[], newParentId: string) => void
  onMoveNodeAsSibling?: (
    nodeId: string,
    targetId: string,
    position: 'before' | 'after'
  ) => void
  onMoveNodesAsSibling?: (
    nodeIds: string[],
    targetId: string,
    position: 'before' | 'after'
  ) => void
  onToggleExpand: (nodeId: string) => void
  onDragPreviewChange?: (preview: DragPreviewState | null) => void
  onHoverNode?: (nodeId: string | null) => void
}

export function MindmapTree({
  data,
  selectedNodeId,
  selectedNodeIds = [],
  isEditing,
  direction,
  editable,
  dragPreview,
  onSelect,
  onStartEditing,
  onStopEditing,
  onUpdateTopic,
  onAddChild,
  onAddSibling,
  onDelete,
  onDeleteNodes,
  onMoveNode,
  onMoveNodes,
  onMoveNodeAsSibling,
  onMoveNodesAsSibling,
  onToggleExpand,
  onDragPreviewChange,
  onHoverNode,
}: MindmapTreeProps) {
  const isRootExpanded = data.expanded !== false

  return (
    <div className='mindmap-branch flex items-center gap-12'>
      {(direction === 'both' || direction === 'left') &&
        isRootExpanded &&
        data.children &&
        data.children.length > 0 && (
          <div className='mindmap-branch flex flex-col items-end gap-1'>
            {(direction === 'both'
              ? data.children.filter((child) => child.side === 'left')
              : data.children
            ).map((child) => (
              <MindmapBranch
                key={child.id}
                node={child}
                depth={1}
                selectedNodeId={selectedNodeId}
                selectedNodeIds={selectedNodeIds}
                isEditing={isEditing}
                direction='left'
                editable={editable}
                dragPreview={dragPreview}
                onSelect={onSelect}
                onStartEditing={onStartEditing}
                onStopEditing={onStopEditing}
                onUpdateTopic={onUpdateTopic}
                onAddChild={onAddChild}
                onAddSibling={onAddSibling}
                onDelete={onDelete}
                onDeleteNodes={onDeleteNodes}
                onMoveNode={onMoveNode}
                onMoveNodes={onMoveNodes}
                onMoveNodeAsSibling={onMoveNodeAsSibling}
                onMoveNodesAsSibling={onMoveNodesAsSibling}
                onToggleExpand={onToggleExpand}
                onDragPreviewChange={onDragPreviewChange}
                onHoverNode={onHoverNode}
              />
            ))}
          </div>
        )}

      <MindmapNode
        node={{ ...data, children: [] }}
        depth={0}
        isRoot={true}
        selectedNodeId={selectedNodeId}
        selectedNodeIds={selectedNodeIds}
        isEditingMode={isEditing}
        direction={direction}
        editable={editable}
        dragPreview={dragPreview}
        actualHasChildren={data.children && data.children.length > 0}
        onSelect={onSelect}
        onStartEditing={onStartEditing}
        onStopEditing={onStopEditing}
        onUpdateTopic={onUpdateTopic}
        onAddChild={onAddChild}
        onAddSibling={onAddSibling}
        onDelete={onDelete}
        onDeleteNodes={onDeleteNodes}
        onMoveNode={onMoveNode}
        onMoveNodes={onMoveNodes}
        onMoveNodeAsSibling={onMoveNodeAsSibling}
        onMoveNodesAsSibling={onMoveNodesAsSibling}
        onToggleExpand={onToggleExpand}
        onDragPreviewChange={onDragPreviewChange}
        onHoverNode={onHoverNode}
      />

      {(direction === 'both' || direction === 'right') &&
        isRootExpanded &&
        data.children &&
        data.children.length > 0 && (
          <div className='mindmap-branch flex flex-col items-start gap-1'>
            {(direction === 'both'
              ? data.children.filter(
                  (child) => child.side === 'right' || child.side === undefined
                )
              : data.children
            ).map((child) => (
              <MindmapBranch
                key={child.id}
                node={child}
                depth={1}
                selectedNodeId={selectedNodeId}
                selectedNodeIds={selectedNodeIds}
                isEditing={isEditing}
                direction='right'
                editable={editable}
                dragPreview={dragPreview}
                onSelect={onSelect}
                onStartEditing={onStartEditing}
                onStopEditing={onStopEditing}
                onUpdateTopic={onUpdateTopic}
                onAddChild={onAddChild}
                onAddSibling={onAddSibling}
                onDelete={onDelete}
                onDeleteNodes={onDeleteNodes}
                onMoveNode={onMoveNode}
                onMoveNodes={onMoveNodes}
                onMoveNodeAsSibling={onMoveNodeAsSibling}
                onMoveNodesAsSibling={onMoveNodesAsSibling}
                onToggleExpand={onToggleExpand}
                onDragPreviewChange={onDragPreviewChange}
                onHoverNode={onHoverNode}
              />
            ))}
          </div>
        )}
    </div>
  )
}

interface MindmapBranchProps {
  node: MindmapNodeData
  depth: number
  selectedNodeId: string | null
  selectedNodeIds?: string[]
  isEditing: boolean
  direction: 'left' | 'right'
  editable: boolean
  dragPreview?: DragPreviewState | null
  onSelect: (nodeId: string, addToSelection?: boolean) => void
  onStartEditing: () => void
  onStopEditing: () => void
  onUpdateTopic: (nodeId: string, topic: string) => void
  onAddChild: (parentId: string) => void
  onAddSibling: (nodeId: string) => void
  onDelete: (nodeId: string) => void
  onDeleteNodes?: (nodeIds: string[]) => void
  onMoveNode?: (nodeId: string, newParentId: string, index?: number) => void
  onMoveNodes?: (nodeIds: string[], newParentId: string) => void
  onMoveNodeAsSibling?: (
    nodeId: string,
    targetId: string,
    position: 'before' | 'after'
  ) => void
  onMoveNodesAsSibling?: (
    nodeIds: string[],
    targetId: string,
    position: 'before' | 'after'
  ) => void
  onToggleExpand: (nodeId: string) => void
  onDragPreviewChange?: (preview: DragPreviewState | null) => void
  onHoverNode?: (nodeId: string | null) => void
}

function MindmapBranch({
  node,
  depth,
  selectedNodeId,
  selectedNodeIds = [],
  isEditing,
  direction,
  editable,
  dragPreview,
  onSelect,
  onStartEditing,
  onStopEditing,
  onUpdateTopic,
  onAddChild,
  onAddSibling,
  onDelete,
  onDeleteNodes,
  onMoveNode,
  onMoveNodes,
  onMoveNodeAsSibling,
  onMoveNodesAsSibling,
  onToggleExpand,
  onDragPreviewChange,
  onHoverNode,
}: MindmapBranchProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = node.expanded !== false

  return (
    <div
      className={cn(
        'mindmap-branch flex items-center gap-10',
        direction === 'left' ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <MindmapNode
        node={{ ...node, children: [] }}
        depth={depth}
        isRoot={false}
        selectedNodeId={selectedNodeId}
        selectedNodeIds={selectedNodeIds}
        isEditingMode={isEditing}
        direction={direction}
        editable={editable}
        dragPreview={dragPreview}
        actualHasChildren={hasChildren}
        onSelect={onSelect}
        onStartEditing={onStartEditing}
        onStopEditing={onStopEditing}
        onUpdateTopic={onUpdateTopic}
        onAddChild={onAddChild}
        onAddSibling={onAddSibling}
        onDelete={onDelete}
        onDeleteNodes={onDeleteNodes}
        onMoveNode={onMoveNode}
        onMoveNodes={onMoveNodes}
        onMoveNodeAsSibling={onMoveNodeAsSibling}
        onMoveNodesAsSibling={onMoveNodesAsSibling}
        onToggleExpand={onToggleExpand}
        onDragPreviewChange={onDragPreviewChange}
        onHoverNode={onHoverNode}
      />

      {hasChildren && isExpanded && (
        <div
          className={cn(
            'mindmap-branch flex flex-col gap-1',
            direction === 'left' ? 'items-end' : 'items-start'
          )}
        >
          {node.children!.map((child) => (
            <MindmapBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              selectedNodeIds={selectedNodeIds}
              isEditing={isEditing}
              direction={direction}
              editable={editable}
              dragPreview={dragPreview}
              onSelect={onSelect}
              onStartEditing={onStartEditing}
              onStopEditing={onStopEditing}
              onUpdateTopic={onUpdateTopic}
              onAddChild={onAddChild}
              onAddSibling={onAddSibling}
              onDelete={onDelete}
              onDeleteNodes={onDeleteNodes}
              onMoveNode={onMoveNode}
              onMoveNodes={onMoveNodes}
              onMoveNodeAsSibling={onMoveNodeAsSibling}
              onMoveNodesAsSibling={onMoveNodesAsSibling}
              onToggleExpand={onToggleExpand}
              onDragPreviewChange={onDragPreviewChange}
              onHoverNode={onHoverNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
