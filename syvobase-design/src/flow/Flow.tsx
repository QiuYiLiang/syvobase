import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import dagre from 'dagre'
import { cn, useControllable } from '@/utils'
import { FlowNodeComponent } from './FlowNode'
import { FlowEdgeComponent, FlowPendingEdge } from './FlowEdge'
import { FlowAddPanel } from './FlowAddPanel'
import { FlowToolbar } from './FlowToolbar'
import {
  FlowContext,
  FlowProps,
  FlowValue,
  FlowTransform,
  FlowPendingConnection,
  FlowPoint,
  FlowContextValue,
  FlowAddPanelState,
  FlowNodeSize,
  MIN_ZOOM,
  MAX_ZOOM,
  DEFAULT_NODE_MIN_WIDTH,
  DEFAULT_NODE_MIN_HEIGHT,
  calculateNodePosition,
  getNodesBounds,
} from './shared'

const DEFAULT_VALUE: FlowValue = { nodes: [], edges: [] }

/** Flow 主组件 */
export const Flow = (props: FlowProps) => {
  const {
    ref,
    onNodeRender,
    onCreateRender,
    className,
    style,
    orientation = 'horizontal',
    readMode = false,
  } = props

  // ==================== 状态管理 ====================

  // 使用 useControllable 管理 value
  const [value, setValue] = useControllable<FlowProps, 'value'>({
    value: DEFAULT_VALUE,
    props,
    valueKey: 'value',
    onChangeKey: 'onChange',
    defaultValueKey: 'defaultValue',
  })

  // 选中状态
  const [internalSelectNodeId, setInternalSelectNodeId] = useState<
    string | null
  >(props.defaultSelectNodeId ?? props.selectNodeId ?? null)
  const [internalSelectEdgeId, setInternalSelectEdgeId] = useState<
    string | null
  >(props.defaultSelectEdgeId ?? props.selectEdgeId ?? null)

  const selectNodeId =
    props.selectNodeId !== undefined ? props.selectNodeId : internalSelectNodeId
  const selectEdgeId =
    props.selectEdgeId !== undefined ? props.selectEdgeId : internalSelectEdgeId

  const setSelectNodeId = useCallback(
    (id: string | null) => {
      if (props.selectNodeId !== undefined) {
        props.onSelectNodeIdChange?.(id)
      } else {
        setInternalSelectNodeId(id)
        props.onSelectNodeIdChange?.(id)
      }
    },
    [props]
  )

  const setSelectEdgeId = useCallback(
    (id: string | null) => {
      if (props.selectEdgeId !== undefined) {
        props.onSelectEdgeIdChange?.(id)
      } else {
        setInternalSelectEdgeId(id)
        props.onSelectEdgeIdChange?.(id)
      }
    },
    [props]
  )

  // 画布变换状态
  const [transform, setTransform] = useState<FlowTransform>({
    x: 0,
    y: 0,
    zoom: 1,
  })

  // 画布拖拽状态
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef<{
    x: number
    y: number
    tx: number
    ty: number
  } | null>(null)

  // 正在创建的连接
  const [pendingConnection, setPendingConnection] =
    useState<FlowPendingConnection | null>(null)

  // 添加面板状态
  const [addPanelState, setAddPanelState] = useState<FlowAddPanelState | null>(
    null
  )

  // 悬停的边
  const [hoverEdgeId, setHoverEdgeId] = useState<string | null>(null)

  // 节点尺寸映射
  const nodeSizesRef = useRef<Map<string, FlowNodeSize>>(new Map())
  const [nodeSizesVersion, setNodeSizesVersion] = useState(0)

  const nodeSizes = nodeSizesRef.current

  const setNodeSize = useCallback((nodeId: string, size: FlowNodeSize) => {
    const current = nodeSizesRef.current.get(nodeId)
    if (current?.width !== size.width || current?.height !== size.height) {
      nodeSizesRef.current.set(nodeId, size)
      setNodeSizesVersion((v) => v + 1)
    }
  }, [])

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const justSetAddPanelRef = useRef(false)

  // ==================== 工具函数 ====================

  // 屏幕坐标转画布坐标
  const screenToCanvas = useCallback(
    (screenPoint: FlowPoint): FlowPoint => ({
      x: (screenPoint.x - transform.x) / transform.zoom,
      y: (screenPoint.y - transform.y) / transform.zoom,
    }),
    [transform]
  )

  // 获取端口绝对位置
  const getPortPosition = useCallback(
    (nodeId: string, portId: string): FlowPoint | null => {
      const node = value.nodes.find((n) => n.id === nodeId)
      if (!node) return null

      const port = node.port.find((p) => p.id === portId)
      if (!port) return null

      const portsOfType = node.port.filter((p) => p.type === port.type)
      const portIndex = portsOfType.findIndex((p) => p.id === portId)
      const totalPorts = portsOfType.length

      // 获取节点实际尺寸
      const size = nodeSizes.get(nodeId)
      const w = size?.width ?? DEFAULT_NODE_MIN_WIDTH
      const h = size?.height ?? DEFAULT_NODE_MIN_HEIGHT

      if (orientation === 'vertical') {
        // 竖向：input 在顶部，output 在底部
        const y = port.type === 'input' ? node.position.y : node.position.y + h

        const slotWidth = w / totalPorts
        const x = node.position.x + slotWidth * portIndex + slotWidth / 2

        return { x, y }
      }

      // 横向：input 在左边，output 在右边
      const x = port.type === 'input' ? node.position.x : node.position.x + w

      const slotHeight = h / totalPorts
      const y = node.position.y + slotHeight * portIndex + slotHeight / 2

      return { x, y }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value.nodes, orientation, nodeSizesVersion]
  )

  // ==================== 事件处理 ====================

  // 处理画布点击
  const handleCanvasClick = useCallback(() => {
    if (justSetAddPanelRef.current) {
      justSetAddPanelRef.current = false
      return
    }
    setSelectNodeId(null)
    setSelectEdgeId(null)
    setPendingConnection(null)
    setAddPanelState(null)
  }, [setSelectNodeId, setSelectEdgeId])

  // 处理画布拖拽开始
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 && e.button !== 1) return
      if ((e.target as HTMLElement).closest('[data-node]')) return

      e.preventDefault()
      setIsPanning(true)
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transform.x,
        ty: transform.y,
      }
    },
    [transform.x, transform.y]
  )

  // 处理鼠标移动
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning && panStartRef.current) {
        const dx = e.clientX - panStartRef.current.x
        const dy = e.clientY - panStartRef.current.y
        setTransform((prev) => ({
          ...prev,
          x: panStartRef.current!.tx + dx,
          y: panStartRef.current!.ty + dy,
        }))
        return
      }

      if (!pendingConnection || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const mousePosition = screenToCanvas({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })

      setPendingConnection({ ...pendingConnection, mousePosition })
    },
    [isPanning, pendingConnection, screenToCanvas]
  )

  // 处理鼠标抬起
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      setIsPanning(false)
      panStartRef.current = null

      if (pendingConnection && onCreateRender) {
        const sourceNode = value.nodes.find(
          (n) => n.id === pendingConnection.sourceNodeId
        )
        const sourcePort = sourceNode?.port.find(
          (p) => p.id === pendingConnection.sourcePortId
        )

        if (sourcePort?.type === 'output') {
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const canvasPosition = screenToCanvas({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            })
            setAddPanelState({
              position: canvasPosition,
              sourceNodeId: pendingConnection.sourceNodeId,
              sourcePortId: pendingConnection.sourcePortId,
              useDragPosition: true,
            })
            justSetAddPanelRef.current = true
          }
        }
      }

      setPendingConnection(null)
    },
    [pendingConnection, onCreateRender, value.nodes, screenToCanvas]
  )

  // 处理滚轮缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, transform.zoom * zoomFactor)
      )

      const newX = mouseX - (mouseX - transform.x) * (newZoom / transform.zoom)
      const newY = mouseY - (mouseY - transform.y) * (newZoom / transform.zoom)

      setTransform({ x: newX, y: newY, zoom: newZoom })
    },
    [transform]
  )

  // 处理键盘删除
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (readMode) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return
        }

        e.preventDefault()

        if (selectEdgeId) {
          setValue({
            ...value,
            edges: value.edges.filter((ed) => ed.id !== selectEdgeId),
          })
          setSelectEdgeId(null)
          return
        }

        if (selectNodeId) {
          setValue({
            ...value,
            nodes: value.nodes.filter((n) => n.id !== selectNodeId),
            edges: value.edges.filter(
              (e) =>
                e.source.id !== selectNodeId && e.target.id !== selectNodeId
            ),
          })
          setSelectNodeId(null)
        }
      }
    },
    [
      readMode,
      selectEdgeId,
      selectNodeId,
      value,
      setValue,
      setSelectEdgeId,
      setSelectNodeId,
    ]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ==================== 工具栏操作 ====================

  const zoomIn = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const newZoom = Math.min(MAX_ZOOM, transform.zoom * 1.2)
    const newX = centerX - (centerX - transform.x) * (newZoom / transform.zoom)
    const newY = centerY - (centerY - transform.y) * (newZoom / transform.zoom)
    setTransform({ x: newX, y: newY, zoom: newZoom })
  }, [transform])

  const zoomOut = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const newZoom = Math.max(MIN_ZOOM, transform.zoom / 1.2)
    const newX = centerX - (centerX - transform.x) * (newZoom / transform.zoom)
    const newY = centerY - (centerY - transform.y) * (newZoom / transform.zoom)
    setTransform({ x: newX, y: newY, zoom: newZoom })
  }, [transform])

  const fitToView = useCallback(() => {
    const container = containerRef.current
    if (!container || value.nodes.length === 0) return

    const rect = container.getBoundingClientRect()
    const { minX, minY, maxX, maxY } = getNodesBounds(value.nodes, nodeSizes)

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const padding = 50

    const scaleX = (rect.width - padding * 2) / contentWidth
    const scaleY = (rect.height - padding * 2) / contentHeight
    const newZoom = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, Math.min(scaleX, scaleY, 1))
    )

    const contentCenterX = (minX + maxX) / 2
    const contentCenterY = (minY + maxY) / 2
    const newX = rect.width / 2 - contentCenterX * newZoom
    const newY = rect.height / 2 - contentCenterY * newZoom

    setTransform({ x: newX, y: newY, zoom: newZoom })
  }, [value.nodes, nodeSizes])

  const autoLayout = useCallback(() => {
    if (value.nodes.length === 0) return

    const nodes = value.nodes
    const edges = value.edges

    // 创建 dagre 图
    const g = new dagre.graphlib.Graph()
    g.setGraph({
      rankdir: orientation === 'vertical' ? 'TB' : 'LR', // 根据方向设置布局
      nodesep: 60, // 同层节点间距
      ranksep: 80, // 层间距
      marginx: 0,
      marginy: 0,
    })
    g.setDefaultEdgeLabel(() => ({}))

    // 添加节点（使用实际尺寸）
    for (const node of nodes) {
      const size = nodeSizes.get(node.id)
      const width = size?.width ?? DEFAULT_NODE_MIN_WIDTH
      const height = size?.height ?? DEFAULT_NODE_MIN_HEIGHT
      g.setNode(node.id, { width, height })
    }

    // 添加边
    for (const edge of edges) {
      g.setEdge(edge.source.id, edge.target.id)
    }

    // 执行布局
    dagre.layout(g)

    // 获取新位置（dagre 返回的是中心点，需要转换为左上角）
    const newNodes = nodes.map((node) => {
      const dagreNode = g.node(node.id)
      if (!dagreNode) return node
      return {
        ...node,
        position: {
          ...node.position,
          x: dagreNode.x - dagreNode.width / 2,
          y: dagreNode.y - dagreNode.height / 2,
        },
      }
    })

    setValue({ ...value, nodes: newNodes })

    // 布局后居中
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = containerRef.current
        if (!container || newNodes.length === 0) return

        const rect = container.getBoundingClientRect()
        const { minX, minY, maxX, maxY } = getNodesBounds(newNodes, nodeSizes)

        const contentWidth = maxX - minX
        const contentHeight = maxY - minY
        const padding = 50

        const scaleX = (rect.width - padding * 2) / contentWidth
        const scaleY = (rect.height - padding * 2) / contentHeight
        const newZoom = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, Math.min(scaleX, scaleY, 1))
        )

        const contentCenterX = (minX + maxX) / 2
        const contentCenterY = (minY + maxY) / 2
        const newX = rect.width / 2 - contentCenterX * newZoom
        const newY = rect.height / 2 - contentCenterY * newZoom

        setTransform({ x: newX, y: newY, zoom: newZoom })
      })
    })
  }, [value, setValue, nodeSizes, orientation])

  // ==================== 暴露 ref ====================

  useImperativeHandle(
    ref,
    () => ({
      autoLayout,
      fitView: fitToView,
    }),
    [autoLayout, fitToView]
  )

  // ==================== 添加节点 ====================

  const addNode = useCallback(
    (nodeValue: { id: string }) => {
      const container = containerRef.current
      if (!container) return

      let nodeX: number
      let nodeY: number
      let newEdge: FlowValue['edges'][0] | null = null

      if (addPanelState) {
        if (addPanelState.useDragPosition) {
          nodeX = addPanelState.position.x
          nodeY = addPanelState.position.y - DEFAULT_NODE_MIN_HEIGHT / 2
        } else {
          const pos = calculateNodePosition(
            addPanelState.sourceNodeId,
            value.nodes,
            addPanelState.position,
            nodeSizes
          )
          nodeX = pos.x
          nodeY = pos.y
        }

        newEdge = {
          id: `edge-${Date.now()}`,
          source: {
            id: addPanelState.sourceNodeId,
            portId: addPanelState.sourcePortId,
          },
          target: { id: nodeValue.id, portId: 'in' },
        }
      } else {
        const rect = container.getBoundingClientRect()
        const centerCanvasX = (rect.width / 2 - transform.x) / transform.zoom
        const centerCanvasY = (rect.height / 2 - transform.y) / transform.zoom
        nodeX = centerCanvasX - DEFAULT_NODE_MIN_WIDTH / 2
        nodeY = centerCanvasY - DEFAULT_NODE_MIN_HEIGHT / 2
      }

      const newNode = {
        id: nodeValue.id,
        position: {
          x: nodeX,
          y: nodeY,
        },
        port: addPanelState
          ? [{ type: 'input' as const, id: 'in', name: '输入' }]
          : [],
      }

      setValue({
        ...value,
        nodes: [...value.nodes, newNode],
        edges: newEdge ? [...value.edges, newEdge] : value.edges,
      })

      setSelectNodeId(nodeValue.id)
      setAddPanelState(null)
    },
    [value, setValue, transform, setSelectNodeId, addPanelState, nodeSizes]
  )

  // ==================== Context ====================

  const contextValue: FlowContextValue = useMemo(
    () => ({
      value,
      setValue,
      transform,
      setTransform,
      selectNodeId,
      setSelectNodeId,
      selectEdgeId,
      setSelectEdgeId,
      hoverEdgeId,
      setHoverEdgeId,
      pendingConnection,
      setPendingConnection,
      getPortPosition,
      screenToCanvas,
      onNodeRender,
      addPanelState,
      setAddPanelState,
      onCreateRender,
      orientation,
      nodeSizes,
      setNodeSize,
      readMode,
    }),
    [
      value,
      setValue,
      transform,
      selectNodeId,
      setSelectNodeId,
      selectEdgeId,
      setSelectEdgeId,
      hoverEdgeId,
      pendingConnection,
      getPortPosition,
      screenToCanvas,
      onNodeRender,
      addPanelState,
      onCreateRender,
      orientation,
      nodeSizes,
      setNodeSize,
      readMode,
    ]
  )

  // SVG 视口大小
  const svgViewBox = useMemo(() => {
    const { minX, minY, maxX, maxY } = getNodesBounds(value.nodes, nodeSizes)
    const padding = 500
    return {
      minX: minX - padding,
      minY: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.nodes, nodeSizesVersion])

  // ==================== 渲染 ====================

  return (
    <FlowContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          'relative h-full w-full overflow-hidden',
          isPanning ? 'cursor-grabbing' : 'cursor-grab',
          className
        )}
        style={style}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* 网格背景 */}
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
            backgroundSize: `${20 * transform.zoom}px ${20 * transform.zoom}px`,
            backgroundPosition: `${transform.x}px ${transform.y}px`,
          }}
        />

        {/* 画布内容 */}
        <div
          className='absolute origin-top-left'
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          }}
        >
          {/* SVG 层 - 边 */}
          <svg
            className='absolute overflow-visible'
            style={{
              left: svgViewBox.minX,
              top: svgViewBox.minY,
              width: svgViewBox.width,
              height: svgViewBox.height,
              pointerEvents: 'none',
            }}
            viewBox={`${svgViewBox.minX} ${svgViewBox.minY} ${svgViewBox.width} ${svgViewBox.height}`}
          >
            {value.edges.map((edge) => (
              <FlowEdgeComponent key={edge.id} edge={edge} />
            ))}
            {pendingConnection && (
              <FlowPendingEdge pendingConnection={pendingConnection} />
            )}
          </svg>

          {/* 节点层 */}
          {value.nodes.map((node) => (
            <FlowNodeComponent key={node.id} node={node} />
          ))}

          {/* 添加面板（只读模式下不显示） */}
          {!readMode && addPanelState && onCreateRender && (
            <FlowAddPanel
              addPanelState={addPanelState}
              nodes={value.nodes}
              onCreateRender={onCreateRender}
              addNode={addNode}
              onClose={() => setAddPanelState(null)}
              getPortPosition={getPortPosition}
              orientation={orientation}
              nodeSizes={nodeSizes}
            />
          )}
        </div>

        {/* 工具栏 */}
        <FlowToolbar
          zoom={transform.zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitToView={fitToView}
          onAutoLayout={autoLayout}
          onCreateRender={readMode ? undefined : onCreateRender}
          addNode={addNode}
        />
      </div>
    </FlowContext.Provider>
  )
}
