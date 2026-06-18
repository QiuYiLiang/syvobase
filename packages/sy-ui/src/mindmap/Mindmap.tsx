import { cn, useControllable, BaseInputProps, useKeydown } from '@/utils'
import {
  useEffect,
  useRef,
  useState,
  WheelEvent,
  MouseEvent as ReactMouseEvent,
  DragEvent as ReactDragEvent,
} from 'react'
import { mergeTag } from '@/utils/tag'
import {
  MindmapData,
  MindmapDirection,
  DragPreviewState,
  MindmapNodeData,
} from './types'
import { useMindmap, createEmptyMindmap } from './useMindmap'
import { MindmapTree } from './MindmapNode'
import { MindmapToolbar } from './MindmapToolbar'
import { MindmapConnections } from './MindmapConnections'
import { getCurrentDraggedNodeIds } from './shared'

export interface MindmapProps extends BaseInputProps<MindmapData | null> {
  direction?: MindmapDirection
  showToolbar?: boolean
}

export const Mindmap = (props: MindmapProps) => {
  const {
    readMode = false,
    disabled = false,
    direction = 'right',
    showToolbar = true,
    className,
    style,
  } = props

  const [value, setValue] = useControllable<MindmapProps, 'value'>({
    props,
    value: null,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const treeWrapperRef = useRef<HTMLDivElement>(null)
  const justFinishedSelectingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<{
    startX: number
    startY: number
    endX: number
    endY: number
  } | null>(null)
  const [dragPreview, setDragPreview] = useState<DragPreviewState | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [currentDirection, setCurrentDirection] =
    useState<MindmapDirection>(direction)

  const editable = !(readMode || disabled)

  const mindmap = useMindmap({
    data: value || createEmptyMindmap(),
    direction,
    readMode: !editable,
    onChange: (data) => {
      if (readMode || disabled) {
        return
      }
      setValue(data)
    },
  })

  useKeydown('Escape', () => {
    if (mindmap.selection.isEditing) {
      mindmap.stopEditing()
    } else {
      mindmap.selectNode(null)
    }
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mindmap.selection.isEditing) return

      const isCmdKey = e.ctrlKey || e.metaKey

      if (isCmdKey) {
        const actions: Record<string, () => void> = {
          c: mindmap.copyNodes,
          ...(editable
            ? {
                z: mindmap.undo,
                y: mindmap.redo,
                x: mindmap.cutNodes,
                v: () =>
                  mindmap.selection.nodeId &&
                  mindmap.pasteNodes(mindmap.selection.nodeId),
              }
            : {}),
        }
        const action = actions[e.key]
        if (action) {
          e.preventDefault()
          action()
          return
        }
      }

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
        return

      e.preventDefault()
      const currentNodeId = mindmap.selection.nodeId || mindmap.data.nodeData.id
      const currentNode = mindmap.getNodeById(currentNodeId)
      const parentNode = mindmap.getParentNode(currentNodeId)

      const selectSibling = (offset: number) => {
        if (!parentNode?.children) return
        const siblings = parentNode.children
        const currentIndex = siblings.findIndex((n) => n.id === currentNodeId)
        const nextIndex = currentIndex + offset
        if (nextIndex >= 0 && nextIndex < siblings.length) {
          mindmap.selectNode(siblings[nextIndex].id)
        }
      }

      const selectFirstChild = () => {
        if (currentNode?.children?.length && currentNode.expanded !== false) {
          mindmap.selectNode(currentNode.children[0].id)
        }
      }

      switch (e.key) {
        case 'ArrowUp':
          selectSibling(-1)
          break
        case 'ArrowDown':
          selectSibling(1)
          break
        case 'ArrowLeft':
          if (currentDirection === 'right' || currentDirection === 'both') {
            if (parentNode) mindmap.selectNode(parentNode.id)
          } else {
            selectFirstChild()
          }
          break
        case 'ArrowRight':
          if (currentDirection === 'right' || currentDirection === 'both') {
            selectFirstChild()
          } else if (parentNode) {
            mindmap.selectNode(parentNode.id)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mindmap, currentDirection, editable])

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (e.button === 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - mindmap.viewport.x,
        y: e.clientY - mindmap.viewport.y,
      })
      return
    }

    if (e.button !== 0) return

    const target = e.target as HTMLElement

    // 如果点击的是按钮，不触发框选
    if (target.closest('button')) return

    // 如果点击的是根节点，启用画布拖动模式
    const rootNode = target.closest('[data-is-root="true"]')
    if (rootNode) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - mindmap.viewport.x,
        y: e.clientY - mindmap.viewport.y,
      })
      return
    }

    // 如果点击的是节点内容区域，不触发框选
    if (target.closest('.mindmap-node-content')) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setIsSelecting(true)
      setSelectionBox({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (isSelecting && selectionBox) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setSelectionBox((prev) =>
          prev
            ? {
                ...prev,
                endX: e.clientX - rect.left,
                endY: e.clientY - rect.top,
              }
            : null
        )
      }
      return
    }

    if (!isDragging) return

    mindmap.setViewport({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    if (isSelecting && selectionBox && containerRef.current) {
      const minX = Math.min(selectionBox.startX, selectionBox.endX)
      const maxX = Math.max(selectionBox.startX, selectionBox.endX)
      const minY = Math.min(selectionBox.startY, selectionBox.endY)
      const maxY = Math.max(selectionBox.startY, selectionBox.endY)

      const boxWidth = maxX - minX
      const boxHeight = maxY - minY

      if (boxWidth > 5 && boxHeight > 5) {
        const nodeElements =
          containerRef.current.querySelectorAll('[data-node-id]')
        const selectedIds: string[] = []
        const containerRect = containerRef.current.getBoundingClientRect()

        nodeElements.forEach((el) => {
          const nodeId = el.getAttribute('data-node-id')
          if (!nodeId) return

          const rect = el.getBoundingClientRect()
          const nodeX = rect.left - containerRect.left
          const nodeY = rect.top - containerRect.top
          const nodeRight = nodeX + rect.width
          const nodeBottom = nodeY + rect.height

          if (
            nodeX < maxX &&
            nodeRight > minX &&
            nodeY < maxY &&
            nodeBottom > minY
          ) {
            selectedIds.push(nodeId)
          }
        })

        if (selectedIds.length > 0) {
          mindmap.selectNodes(selectedIds)
          justFinishedSelectingRef.current = true
          requestAnimationFrame(() => {
            justFinishedSelectingRef.current = false
          })
        }
      }
    }

    setIsSelecting(false)
    setSelectionBox(null)
    setIsDragging(false)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newScale = Math.max(
        0.3,
        Math.min(2, mindmap.viewport.scale + delta)
      )
      mindmap.setViewport({ scale: newScale })
    } else {
      mindmap.setViewport({
        x: mindmap.viewport.x - e.deltaX,
        y: mindmap.viewport.y - e.deltaY,
      })
    }
  }

  // 根据父节点ID获取子节点
  const getChildrenOfNode = (nodeId: string): MindmapNodeData[] => {
    const findNode = (node: MindmapNodeData): MindmapNodeData | null => {
      if (node.id === nodeId) return node
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child)
          if (found) return found
        }
      }
      return null
    }
    return findNode(mindmap.data.nodeData)?.children || []
  }

  const getPointerInfo = (e: ReactDragEvent, container: HTMLDivElement) => {
    const containerRect = container.getBoundingClientRect()
    const scale = mindmap.viewport.scale
    return {
      scale,
      containerRect,
      mouseX: (e.clientX - containerRect.left) / scale,
      mouseY: (e.clientY - containerRect.top) / scale,
      rootCenterX: (() => {
        const rootEl = container.querySelector('[data-node-id]')
        const rootRect = rootEl?.getBoundingClientRect()
        return rootRect
          ? (rootRect.left + rootRect.width / 2 - containerRect.left) / scale
          : 0
      })(),
    }
  }

  const estimateDraggedEdges = (
    container: HTMLDivElement,
    draggedNodeId: string,
    mouseX: number,
    mouseY: number,
    scale: number
  ) => {
    const draggedEl = container.querySelector(
      `[data-node-id="${draggedNodeId}"]`
    )
    if (!draggedEl) return null
    const rect = draggedEl.getBoundingClientRect()
    const width = rect.width / scale
    return {
      left: mouseX - width / 2,
      right: mouseX + width / 2,
      centerY: mouseY,
    }
  }

  const pickTargetParent = (
    container: HTMLDivElement,
    draggedNodeIds: string[],
    draggedEdges: { left: number; right: number; centerY: number },
    mouseX: number,
    containerRect: DOMRect,
    scale: number
  ) => {
    let minDistance = Infinity
    let targetParentId: string | null = null

    // 获取根节点信息用于特殊处理
    const rootEl = container.querySelector('[data-is-root="true"]')
    const rootRect = rootEl?.getBoundingClientRect()
    const rootCenterXActual = rootRect
      ? (rootRect.left + rootRect.width / 2 - containerRect.left) / scale
      : 0

    // 使用鼠标位置判定左右
    const layoutSide: MindmapDirection =
      currentDirection === 'both'
        ? mouseX >= rootCenterXActual
          ? 'right'
          : 'left'
        : currentDirection

    container.querySelectorAll('[data-node-id]').forEach((el) => {
      const nodeId = el.getAttribute('data-node-id')
      if (!nodeId || draggedNodeIds.includes(nodeId)) return

      const rect = el.getBoundingClientRect()
      const nodeRightX = (rect.right - containerRect.left) / scale
      const nodeLeftX = (rect.left - containerRect.left) / scale
      const nodeCenterX = (nodeLeftX + nodeRightX) / 2
      const nodeCenterY =
        (rect.top + rect.height / 2 - containerRect.top) / scale

      const isRightLayout = layoutSide === 'right'
      const isRootNode = el.getAttribute('data-is-root') === 'true'

      // 在 both 布局中，非根节点只能选择同侧的节点作为父节点
      if (currentDirection === 'both' && !isRootNode) {
        // 判断节点属于哪一侧（通过位置判断）
        const nodeIsOnRightSide = nodeCenterX > rootCenterXActual
        const nodeIsOnLeftSide = nodeCenterX < rootCenterXActual

        // 如果拖到右侧，只能选择右侧的节点；如果拖到左侧，只能选择左侧的节点
        if (isRightLayout && !nodeIsOnRightSide) return
        if (!isRightLayout && !nodeIsOnLeftSide) return
      }

      // 根节点总是可以作为目标父节点（用于跨左右侧移动）
      // 右侧布局：父节点在拖动节点左边（父节点右边缘 < 拖动节点左边缘）
      // 左侧布局：父节点在拖动节点右边（父节点左边缘 > 拖动节点右边缘）
      const isOnCorrectSide = isRootNode
        ? true
        : isRightLayout
          ? nodeRightX < draggedEdges.left
          : nodeLeftX > draggedEdges.right

      if (!isOnCorrectSide) return

      // 计算距离时，根节点使用对应侧的边缘
      const parentEdgeX = isRightLayout ? nodeRightX : nodeLeftX
      const draggedEdgeX = isRightLayout
        ? draggedEdges.left
        : draggedEdges.right

      const distance = Math.hypot(
        Math.abs(draggedEdgeX - parentEdgeX),
        Math.abs(draggedEdges.centerY - nodeCenterY)
      )

      if (distance < minDistance) {
        minDistance = distance
        targetParentId = nodeId
      }
    })

    return targetParentId
  }

  const computeInsertIndex = (
    container: HTMLDivElement,
    children: MindmapNodeData[],
    draggedNodeIds: string[],
    mouseY: number,
    containerRect: DOMRect,
    scale: number
  ) => {
    if (!children.length) return 0

    // 收集可见子节点（排除被拖拽的节点）及其位置
    const visibleChildren = children.filter(
      (child) => !draggedNodeIds.includes(child.id)
    )
    const positions = visibleChildren
      .map((child) => {
        const childEl = container.querySelector(`[data-node-id="${child.id}"]`)
        if (!childEl) return null
        const rect = childEl.getBoundingClientRect()
        return {
          child,
          centerY: (rect.top + rect.height / 2 - containerRect.top) / scale,
        }
      })
      .filter(Boolean) as { child: MindmapNodeData; centerY: number }[]

    if (!positions.length) return children.length

    // 按 Y 坐标排序
    positions.sort((a, b) => a.centerY - b.centerY)

    // 找到鼠标应该插入的位置（在 visibleChildren 中）
    let insertPosition = positions.length
    for (let i = 0; i < positions.length; i++) {
      if (mouseY < positions[i].centerY) {
        insertPosition = i
        break
      }
    }

    // 转换回原始 children 中的索引
    if (insertPosition === 0) {
      // 在第一个可见元素前面
      return children.indexOf(positions[0].child)
    } else if (insertPosition >= positions.length) {
      // 在最后一个可见元素后面
      return children.length
    } else {
      // 在某个可见元素前面
      return children.indexOf(positions[insertPosition].child)
    }
  }

  const resolveDraggedNodeIds = (e: ReactDragEvent) => {
    const idsText = e.dataTransfer.getData('mindmap-node-ids')
    if (idsText) {
      try {
        const parsed = JSON.parse(idsText)
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.filter((id): id is string => typeof id === 'string')
        }
      } catch {
        // ignore malformed payloads
      }
    }
    return getCurrentDraggedNodeIds()
  }

  // 全局拖拽处理 - 根据布局方向找最近的父节点和插入位置
  const handleGlobalDragOver = (e: ReactDragEvent) => {
    if (!treeWrapperRef.current || !editable) return
    if (!e.dataTransfer.types.includes('mindmap-node-id')) return

    e.preventDefault()

    const container = treeWrapperRef.current
    const { scale, containerRect, mouseX, mouseY } = getPointerInfo(
      e,
      container
    )

    const draggedNodeIds = resolveDraggedNodeIds(e)
    const draggedNodeId = draggedNodeIds[0]
    if (!draggedNodeId) return

    const draggedEdges = estimateDraggedEdges(
      container,
      draggedNodeId,
      mouseX,
      mouseY,
      scale
    )
    if (!draggedEdges) return

    const targetParentId = pickTargetParent(
      container,
      draggedNodeIds,
      draggedEdges,
      mouseX,
      containerRect,
      scale
    )

    if (!targetParentId) return

    // 计算布局侧（用于 both 布局下根节点子节点的正确插入位置）
    // 获取根节点实际中心位置
    const rootEl = container.querySelector('[data-is-root="true"]')
    const rootRect = rootEl?.getBoundingClientRect()
    const rootCenterXActual = rootRect
      ? (rootRect.left + rootRect.width / 2 - containerRect.left) / scale
      : 0
    const layoutSide: 'left' | 'right' =
      currentDirection === 'both'
        ? mouseX >= rootCenterXActual
          ? 'right'
          : 'left'
        : currentDirection === 'left'
          ? 'left'
          : 'right'

    // 在 both 布局且目标为根节点时，只取对应侧的子节点用于计算插入位置
    let children = getChildrenOfNode(targetParentId)
    if (
      currentDirection === 'both' &&
      targetParentId === mindmap.data.nodeData.id
    ) {
      const rootChildren = mindmap.data.nodeData.children || []
      children =
        layoutSide === 'left'
          ? rootChildren.filter((c) => c.side === 'left')
          : rootChildren.filter(
              (c) => c.side === 'right' || c.side === undefined
            )
    }

    const insertIndex = computeInsertIndex(
      container,
      children,
      draggedNodeIds,
      mouseY,
      containerRect,
      scale
    )

    setDragPreview({
      draggedNodeId,
      targetParentId,
      insertIndex,
      mouseX,
      mouseY,
      layoutSide,
    })
  }

  // 全局拖拽释放处理
  const handleGlobalDrop = (e: ReactDragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!dragPreview) return

    const { draggedNodeId, targetParentId, insertIndex, layoutSide } =
      dragPreview
    const draggedNodeIds = resolveDraggedNodeIds(e)

    // 判断是否移动到根节点（需要设置 side 属性）
    const isMovingToRoot = targetParentId === mindmap.data.nodeData.id
    const sideToSet =
      currentDirection === 'both' && isMovingToRoot ? layoutSide : undefined

    // 执行移动
    if (draggedNodeIds.length === 1) {
      mindmap.moveNode(draggedNodeId, targetParentId, insertIndex, sideToSet)
    } else if (draggedNodeIds.length > 1) {
      // 多选：按顺序逐个插入，保持相对顺序
      draggedNodeIds.forEach((nodeId, i) => {
        mindmap.moveNode(
          nodeId,
          targetParentId,
          insertIndex !== undefined ? insertIndex + i : undefined,
          sideToSet
        )
      })
    }

    setDragPreview(null)
  }

  const handleGlobalDragLeave = (e: ReactDragEvent) => {
    // 只有当离开整个容器时才清除预览
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (!relatedTarget || !treeWrapperRef.current?.contains(relatedTarget)) {
      setDragPreview(null)
    }
  }

  const handleContainerClick = (e: ReactMouseEvent) => {
    if (justFinishedSelectingRef.current) return
    if ((e.target as HTMLElement).closest('.mindmap-node')) return
    mindmap.selectNode(null)
  }

  const handleAddChild = () => {
    if (mindmap.selection.nodeId) {
      mindmap.addChild(mindmap.selection.nodeId)
    }
  }

  const handleAddSibling = () => {
    if (mindmap.selection.nodeId) {
      mindmap.addSibling(mindmap.selection.nodeId)
    }
  }

  const handleDelete = () => {
    if (mindmap.selection.nodeId) {
      mindmap.deleteNode(mindmap.selection.nodeId)
    }
  }

  const selectedNode = mindmap.selection.nodeId
    ? mindmap.getNodeById(mindmap.selection.nodeId)
    : null
  const isRootSelected = selectedNode?.id === mindmap.data.nodeData.id

  return (
    <div
      {...mergeTag('mindmap', props)}
      ref={containerRef}
      className={cn(
        'bg-background relative h-full w-full overflow-hidden select-none',
        isDragging && 'cursor-grabbing',
        !isDragging && 'cursor-grab',
        className
      )}
      style={style}
      onClick={handleContainerClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {showToolbar && (
        <div className='absolute top-3 left-1/2 z-20 -translate-x-1/2'>
          <MindmapToolbar
            editable={editable}
            canUndo={mindmap.canUndo}
            canRedo={mindmap.canRedo}
            scale={mindmap.viewport.scale}
            hasSelection={!!mindmap.selection.nodeId}
            isRootSelected={isRootSelected}
            direction={currentDirection}
            onDirectionChange={(newDirection) => {
              setCurrentDirection(newDirection)
              // 切换到 both 布局时，平均分配子节点到左右两侧
              if (newDirection === 'both') {
                mindmap.distributeChildrenSides()
              }
            }}
            onUndo={mindmap.undo}
            onRedo={mindmap.redo}
            onZoomIn={mindmap.zoomIn}
            onZoomOut={mindmap.zoomOut}
            onResetZoom={mindmap.resetZoom}
            onCenterView={mindmap.centerView}
            onExpandAll={mindmap.expandAll}
            onCollapseAll={mindmap.collapseAll}
            onAddChild={handleAddChild}
            onAddSibling={handleAddSibling}
            onDelete={handleDelete}
          />
        </div>
      )}

      <div
        className='absolute inset-0 flex items-center justify-center'
        style={{
          transform: `translate(${mindmap.viewport.x}px, ${mindmap.viewport.y}px) scale(${mindmap.viewport.scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        onDragOver={handleGlobalDragOver}
        onDragLeave={handleGlobalDragLeave}
        onDrop={handleGlobalDrop}
      >
        <div ref={treeWrapperRef} className='mindmap-container relative'>
          <MindmapTree
            data={mindmap.data.nodeData}
            selectedNodeId={mindmap.selection.nodeId}
            selectedNodeIds={mindmap.selection.nodeIds}
            isEditing={mindmap.selection.isEditing}
            direction={currentDirection}
            editable={editable}
            dragPreview={dragPreview}
            onSelect={mindmap.selectNode}
            onStartEditing={mindmap.startEditing}
            onStopEditing={mindmap.stopEditing}
            onUpdateTopic={mindmap.updateNodeTopic}
            onAddChild={mindmap.addChild}
            onAddSibling={mindmap.addSibling}
            onDelete={mindmap.deleteNode}
            onDeleteNodes={mindmap.deleteNodes}
            onMoveNode={mindmap.moveNode}
            onMoveNodes={mindmap.moveNodes}
            onMoveNodeAsSibling={mindmap.moveNodeAsSibling}
            onMoveNodesAsSibling={mindmap.moveNodesAsSibling}
            onToggleExpand={mindmap.toggleExpand}
            onDragPreviewChange={setDragPreview}
            onHoverNode={setHoveredNodeId}
          />

          <MindmapConnections
            data={mindmap.data.nodeData}
            direction={currentDirection}
            containerRef={treeWrapperRef}
            dragPreview={dragPreview}
            hoveredNodeId={hoveredNodeId}
            onHoverNode={setHoveredNodeId}
            onToggleExpand={mindmap.toggleExpand}
          />
        </div>
      </div>

      {isSelecting && selectionBox && (
        <div
          className='border-primary bg-primary/10 pointer-events-none absolute border-2'
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}
    </div>
  )
}
