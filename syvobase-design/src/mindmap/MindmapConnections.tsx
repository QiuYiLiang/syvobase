import { useEffect, useRef, useState } from 'react'
import { MindmapNodeData, MindmapDirection, DragPreviewState } from './types'
import { cn } from '@/utils'

interface NodePosition {
  id: string
  x: number
  y: number
  width: number
  height: number
}

// 折叠/展开按钮信息
interface ExpandCollapseButton {
  nodeId: string
  x: number
  y: number
  childCount: number
  direction: 'left' | 'right'
  isExpanded: boolean // true = 当前展开（显示折叠按钮），false = 当前折叠（显示展开按钮）
}

interface Connection {
  id: string
  from: NodePosition
  to: NodePosition
  direction: 'left' | 'right'
  isPreview?: boolean
  // 父节点信息，用于展开按钮
  parentNodeId?: string
  parentHasChildren?: boolean
  parentIsExpanded?: boolean
  parentChildCount?: number
}

export interface MindmapConnectionsProps {
  data: MindmapNodeData
  direction: MindmapDirection
  containerRef: React.RefObject<HTMLDivElement | null>
  dragPreview?: DragPreviewState | null
  hoveredNodeId?: string | null
  onHoverNode?: (nodeId: string | null) => void
  onToggleExpand?: (nodeId: string) => void
}

export const MindmapConnections = ({
  data,
  direction,
  containerRef,
  dragPreview,
  hoveredNodeId,
  onHoverNode,
  onToggleExpand,
}: MindmapConnectionsProps) => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [expandCollapseButtons, setExpandCollapseButtons] = useState<
    ExpandCollapseButton[]
  >([])
  const rafRef = useRef<number | null>(null)

  const handleHoverNode = (nodeId: string | null) => {
    onHoverNode?.(nodeId)
  }

  useEffect(() => {
    const calculateConnections = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()

      const nodeElements = container.querySelectorAll('[data-node-id]')
      const nodePositions = new Map<string, NodePosition>()

      nodeElements.forEach((el) => {
        const nodeId = el.getAttribute('data-node-id')
        if (!nodeId) return

        const rect = el.getBoundingClientRect()
        const x = rect.left - containerRect.left
        const y = rect.top - containerRect.top

        nodePositions.set(nodeId, {
          id: nodeId,
          x,
          y,
          width: rect.width,
          height: rect.height,
        })
      })

      // 计算节点的所有后代数量
      const countDescendants = (node: MindmapNodeData): number => {
        if (!node.children || node.children.length === 0) return 0
        return node.children.reduce(
          (sum, child) => sum + 1 + countDescendants(child),
          0
        )
      }

      const newConnections: Connection[] = []
      const newExpandCollapseButtons: ExpandCollapseButton[] = []

      const traverse = (
        node: MindmapNodeData,
        parentNode: MindmapNodeData | null,
        nodeDirection: 'left' | 'right'
      ) => {
        const nodePos = nodePositions.get(node.id)
        if (!nodePos) return

        if (parentNode) {
          const parentPos = nodePositions.get(parentNode.id)
          if (parentPos) {
            const parentHasChildren =
              parentNode.children && parentNode.children.length > 0
            const parentIsExpanded = parentNode.expanded !== false
            const parentChildCount = parentHasChildren
              ? countDescendants(parentNode)
              : 0

            newConnections.push({
              id: `${parentNode.id}-${node.id}`,
              from: parentPos,
              to: nodePos,
              direction: nodeDirection,
              parentNodeId: parentNode.id,
              parentHasChildren,
              parentIsExpanded,
              parentChildCount,
            })
          }
        }

        // 收集有子节点的节点的折叠/展开按钮
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = node.expanded !== false
        if (hasChildren) {
          const childCount = countDescendants(node)
          const buttonX =
            nodeDirection === 'right'
              ? nodePos.x + nodePos.width + 12
              : nodePos.x - 12
          const buttonY = nodePos.y + nodePos.height / 2

          newExpandCollapseButtons.push({
            nodeId: node.id,
            x: buttonX,
            y: buttonY,
            childCount,
            direction: nodeDirection,
            isExpanded,
          })
        }

        if (isExpanded && hasChildren) {
          node.children!.forEach((child) => {
            traverse(child, node, nodeDirection)
          })
        }
      }

      // 处理根节点的折叠/展开按钮
      const rootPos = nodePositions.get(data.id)
      const rootHasChildren = data.children && data.children.length > 0
      const rootIsExpanded = data.expanded !== false
      if (rootPos && rootHasChildren) {
        const rootChildCount = countDescendants(data)
        // 根据 direction 决定按钮位置
        if (direction === 'right' || direction === 'both') {
          newExpandCollapseButtons.push({
            nodeId: data.id,
            x: rootPos.x + rootPos.width + 12,
            y: rootPos.y + rootPos.height / 2,
            childCount: rootChildCount,
            direction: 'right',
            isExpanded: rootIsExpanded,
          })
        }
        if (direction === 'left') {
          newExpandCollapseButtons.push({
            nodeId: data.id,
            x: rootPos.x - 12,
            y: rootPos.y + rootPos.height / 2,
            childCount: rootChildCount,
            direction: 'left',
            isExpanded: rootIsExpanded,
          })
        }
      }

      // 只有当根节点展开时才遍历子节点
      if (rootIsExpanded && data.children && data.children.length > 0) {
        if (direction === 'both') {
          const leftChildren = data.children.filter(
            (child) => child.side === 'left'
          )
          const rightChildren = data.children.filter(
            (child) => child.side === 'right' || child.side === undefined
          )

          leftChildren.forEach((child) => traverse(child, data, 'left'))
          rightChildren.forEach((child) => traverse(child, data, 'right'))
        } else if (direction === 'left') {
          data.children.forEach((child) => traverse(child, data, 'left'))
        } else {
          data.children.forEach((child) => traverse(child, data, 'right'))
        }
      }

      setConnections(newConnections)
      setExpandCollapseButtons(newExpandCollapseButtons)
    }

    const updateConnections = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          calculateConnections()
        })
      })
    }

    const timeoutId = setTimeout(updateConnections, 50)

    const resizeObserver = new ResizeObserver(() => {
      updateConnections()
    })

    const mutationObserver = new MutationObserver(() => {
      updateConnections()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      })
    }

    return () => {
      clearTimeout(timeoutId)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [containerRef, data, direction])

  const generatePath = (connection: Connection): string => {
    const { from, to, direction: connDirection } = connection

    let fromX: number, fromY: number, toX: number, toY: number

    if (connDirection === 'right') {
      fromX = from.x + from.width
      fromY = from.y + from.height / 2
      toX = to.x
      toY = to.y + to.height / 2
    } else {
      fromX = from.x
      fromY = from.y + from.height / 2
      toX = to.x + to.width
      toY = to.y + to.height / 2
    }

    const dx = Math.abs(toX - fromX)
    const dy = Math.abs(toY - fromY)

    const controlOffset = Math.max(dx * 0.6, 40)

    const verticalOffset = dy * 0.15

    let c1x: number, c1y: number, c2x: number, c2y: number

    if (connDirection === 'right') {
      c1x = fromX + controlOffset
      c1y = fromY + (toY > fromY ? verticalOffset : -verticalOffset)
      c2x = toX - controlOffset
      c2y = toY - (toY > fromY ? verticalOffset : -verticalOffset)
    } else {
      c1x = fromX - controlOffset
      c1y = fromY + (toY > fromY ? verticalOffset : -verticalOffset)
      c2x = toX + controlOffset
      c2y = toY - (toY > fromY ? verticalOffset : -verticalOffset)
    }

    return `M ${fromX} ${fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toX} ${toY}`
  }

  // 根据拖拽预览状态过滤和修改连接线
  const getDisplayConnections = () => {
    if (!dragPreview) return connections

    const { draggedNodeId, targetParentId, mouseX, mouseY } = dragPreview

    // 过滤掉指向被拖拽节点的原始连接线
    const filteredConnections = connections.filter(
      (conn) => conn.to.id !== draggedNodeId
    )

    // 如果无法获取节点位置，返回过滤后的连接线
    if (!containerRef.current) return filteredConnections

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

    const targetEl = container.querySelector(
      `[data-node-id="${targetParentId}"]`
    )

    if (!targetEl) return filteredConnections

    const targetRect = targetEl.getBoundingClientRect()

    const targetPos: NodePosition = {
      id: targetParentId,
      x: targetRect.left - containerRect.left,
      y: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height,
    }

    // 使用鼠标位置作为预览线的终点
    let previewEndPos: NodePosition | null = null

    if (mouseX !== undefined && mouseY !== undefined) {
      previewEndPos = {
        id: 'preview-end',
        x: mouseX - 20,
        y: mouseY - 10,
        width: 40,
        height: 20,
      }
    } else {
      const draggedEl = container.querySelector(
        `[data-node-id="${draggedNodeId}"]`
      )
      if (draggedEl) {
        const draggedRect = draggedEl.getBoundingClientRect()
        previewEndPos = {
          id: draggedNodeId,
          x: draggedRect.left - containerRect.left,
          y: draggedRect.top - containerRect.top,
          width: draggedRect.width,
          height: draggedRect.height,
        }
      }
    }

    if (!previewEndPos) return filteredConnections

    // 使用 dragPreview 中的 layoutSide 来确定连接线方向
    // layoutSide 是在拖拽时根据目标位置计算出的方向
    let targetDirection: 'left' | 'right'
    if (direction === 'both') {
      // 使用 dragPreview 中的 layoutSide
      targetDirection = dragPreview.layoutSide || 'right'
    } else if (direction === 'left') {
      targetDirection = 'left'
    } else {
      targetDirection = 'right'
    }

    // 从目标父节点连到鼠标位置
    filteredConnections.push({
      id: `preview-${targetParentId}-${draggedNodeId}`,
      from: targetPos,
      to: previewEndPos,
      direction: targetDirection,
      isPreview: true,
    })

    return filteredConnections
  }

  const displayConnections = getDisplayConnections()

  // 如果没有连接线也没有按钮，则不渲染
  if (displayConnections.length === 0 && expandCollapseButtons.length === 0)
    return null

  return (
    <>
      {/* 可见的连接线和悬浮检测合并在一个 SVG 中 */}
      <svg
        className='pointer-events-none absolute inset-0'
        style={{ overflow: 'visible' }}
      >
        <g>
          {displayConnections.map((connection) => (
            <g key={connection.id}>
              {/* 悬浮检测区域 - 只有 path 本身接收事件 */}
              <path
                d={generatePath(connection)}
                fill='none'
                stroke='transparent'
                strokeWidth={20}
                strokeLinecap='round'
                style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                onMouseEnter={() =>
                  handleHoverNode(connection.parentNodeId || null)
                }
                onMouseLeave={() => handleHoverNode(null)}
              />
              {/* 可见的连接线 */}
              <path
                d={generatePath(connection)}
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                className={
                  connection.isPreview
                    ? 'text-blue-500'
                    : 'text-muted-foreground/50'
                }
                strokeDasharray={connection.isPreview ? '5,5' : undefined}
              />
            </g>
          ))}
        </g>
      </svg>
      {/* 折叠/展开按钮 */}
      {onToggleExpand &&
        expandCollapseButtons.map((btn) => {
          // 折叠状态的节点始终显示展开按钮
          // 展开状态的节点只在悬浮时显示折叠按钮
          const shouldShow = !btn.isExpanded || hoveredNodeId === btn.nodeId
          if (!shouldShow) return null

          return (
            <button
              key={`expand-${btn.nodeId}`}
              className={cn(
                'absolute z-10 flex items-center justify-center rounded-full border shadow-sm transition-all',
                btn.isExpanded
                  ? 'bg-background border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  : 'bg-primary text-primary-foreground border-primary'
              )}
              style={{
                left: btn.x - 8,
                top: btn.y - 8,
                width: 16,
                height: 16,
              }}
              onMouseEnter={() => handleHoverNode(btn.nodeId)}
              onMouseLeave={() => handleHoverNode(null)}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onToggleExpand(btn.nodeId)
              }}
              title={btn.isExpanded ? '收起' : `展开 (${btn.childCount})`}
            >
              <span className='text-[10px] font-medium'>
                {btn.isExpanded ? '−' : btn.childCount}
              </span>
            </button>
          )
        })}
    </>
  )
}
