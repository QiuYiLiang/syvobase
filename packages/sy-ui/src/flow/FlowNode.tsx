import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'
import {
  FlowNodeValue,
  FlowPortValue,
  useFlowContext,
  DEFAULT_NODE_MIN_WIDTH,
  DEFAULT_NODE_MIN_HEIGHT,
} from './shared'
import { Plus } from 'lucide-react'

/** 端口组件 */
interface FlowPortComponentProps {
  port: FlowPortValue
  nodeId: string
  portCount: number
}

const FlowPortComponent = ({
  port,
  nodeId,
  portCount,
}: FlowPortComponentProps) => {
  const {
    pendingConnection,
    setPendingConnection,
    getPortPosition,
    value,
    setValue,
    setAddPanelState,
    onCreateRender,
    hoverEdgeId,
    orientation,
    readMode,
  } = useFlowContext()

  const [isHovered, setIsHovered] = useState(false)

  // 端口大小
  const PORT_SIZE = 8

  // 计算端口相对于节点的位置
  const getPortStyle = (): React.CSSProperties => {
    if (orientation === 'vertical') {
      // 竖向：input 在顶部，output 在底部
      return {
        position: 'relative',
        width: PORT_SIZE,
        height: PORT_SIZE,
        borderRadius: '50%',
        cursor: 'crosshair',
        zIndex: 10,
        marginTop: port.type === 'input' ? -PORT_SIZE / 2 : 0,
        marginBottom: port.type === 'output' ? -PORT_SIZE / 2 : 0,
        transformOrigin: port.type === 'input' ? 'center top' : 'center bottom',
      }
    }
    // 横向：input 在左边，output 在右边
    return {
      position: 'relative',
      width: PORT_SIZE,
      height: PORT_SIZE,
      borderRadius: '50%',
      cursor: 'crosshair',
      zIndex: 10,
      marginLeft: port.type === 'input' ? -PORT_SIZE / 2 : 0,
      marginRight: port.type === 'output' ? -PORT_SIZE / 2 : 0,
      // 设置变换原点，使 scale 以正确的点为中心
      transformOrigin: port.type === 'input' ? 'left center' : 'right center',
    }
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (readMode) return

      e.stopPropagation()
      e.preventDefault()

      const position = getPortPosition(nodeId, port.id)
      if (position) {
        setPendingConnection({
          sourceNodeId: nodeId,
          sourcePortId: port.id,
          sourcePosition: position,
          mousePosition: position,
        })
      }
    },
    [readMode, nodeId, port.id, getPortPosition, setPendingConnection]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!pendingConnection) return

      // 检查是否可以创建连接
      const sourcePort = value.nodes
        .find((n) => n.id === pendingConnection.sourceNodeId)
        ?.port.find((p) => p.id === pendingConnection.sourcePortId)

      if (!sourcePort) {
        // 不阻止冒泡，让画布处理
        return
      }

      // 不能连接到同一个端口
      if (
        pendingConnection.sourceNodeId === nodeId &&
        pendingConnection.sourcePortId === port.id
      ) {
        // 不阻止冒泡，让画布处理
        return
      }

      // 确保是从output连接到input
      if (sourcePort.type === port.type) {
        // 不阻止冒泡，让画布处理
        return
      }

      // 可以创建连接，阻止冒泡
      e.stopPropagation()

      // 创建新连线
      const newEdge = {
        id: `edge-${Date.now()}`,
        source:
          sourcePort.type === 'output'
            ? {
                id: pendingConnection.sourceNodeId,
                portId: pendingConnection.sourcePortId,
              }
            : { id: nodeId, portId: port.id },
        target:
          sourcePort.type === 'output'
            ? { id: nodeId, portId: port.id }
            : {
                id: pendingConnection.sourceNodeId,
                portId: pendingConnection.sourcePortId,
              },
      }

      setValue({
        ...value,
        edges: [...value.edges, newEdge],
      })

      setPendingConnection(null)
    },
    [pendingConnection, value, setValue, nodeId, port, setPendingConnection]
  )

  // 判断是否可以作为连接目标
  const canConnect =
    pendingConnection &&
    !(
      pendingConnection.sourceNodeId === nodeId &&
      pendingConnection.sourcePortId === port.id
    )

  const sourcePort = pendingConnection
    ? value.nodes
        .find((n) => n.id === pendingConnection.sourceNodeId)
        ?.port.find((p) => p.id === pendingConnection.sourcePortId)
    : null

  const isValidTarget = canConnect && sourcePort?.type !== port.type

  // 点击添加按钮显示添加面板
  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      const position = getPortPosition(nodeId, port.id)
      if (position) {
        // 在端口右侧 40px 位置显示面板
        setAddPanelState({
          position: { x: position.x + 40, y: position.y },
          sourceNodeId: nodeId,
          sourcePortId: port.id,
        })
      }
    },
    [nodeId, port.id, getPortPosition, setAddPanelState]
  )

  // 检查是否有连线从这个端口出发且正在被 hover
  const isEdgeHovered =
    hoverEdgeId &&
    value.edges.some(
      (e) =>
        e.id === hoverEdgeId &&
        e.source.id === nodeId &&
        e.source.portId === port.id
    )

  // 是否显示添加按钮（仅 output 端口且有 onCreateRender，且端口被 hover 或连线被 hover）
  const showAddButton =
    port.type === 'output' &&
    (isHovered || isEdgeHovered) &&
    onCreateRender &&
    !pendingConnection

  return (
    <div
      className={cn(
        'flex items-center',
        orientation === 'vertical'
          ? port.type === 'input'
            ? 'flex-col'
            : 'flex-col-reverse'
          : port.type === 'input'
            ? 'flex-row'
            : 'flex-row-reverse'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 端口圆点 - 悬停时变成加号按钮 */}
      <div
        data-port
        style={getPortStyle()}
        className={cn(
          'relative shrink-0 transition-transform',
          isValidTarget ? 'bg-primary scale-150' : 'bg-muted-foreground',
          showAddButton && 'bg-primary scale-150'
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={showAddButton ? handleAddClick : undefined}
      >
        {/* 加号图标 - 显示在圆点内 */}
        {showAddButton && (
          <Plus
            className='text-primary-foreground pointer-events-none absolute inset-0 m-auto h-2 w-2'
            strokeWidth={4}
          />
        )}
      </div>
      {portCount > 1 && (
        <span
          className={cn(
            'text-muted-foreground text-xs whitespace-nowrap',
            port.type === 'input' ? 'pl-1' : 'pr-1'
          )}
        >
          {port.name}
        </span>
      )}
    </div>
  )
}

/** 节点组件Props */
interface FlowNodeComponentProps {
  node: FlowNodeValue
}

/** 节点组件 */
export const FlowNodeComponent = ({ node }: FlowNodeComponentProps) => {
  const {
    selectNodeId,
    setSelectNodeId,
    transform,
    value,
    setValue,
    onNodeRender,
    orientation,
    setNodeSize,
    readMode,
  } = useFlowContext()

  const nodeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{
    x: number
    y: number
    nodeX: number
    nodeY: number
  } | null>(null)

  const selected = selectNodeId === node.id

  // 监测节点尺寸变化
  useEffect(() => {
    const nodeEl = nodeRef.current
    if (!nodeEl) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setNodeSize(node.id, { width, height })
      }
    })

    observer.observe(nodeEl)
    return () => observer.disconnect()
  }, [node.id, setNodeSize])

  // 处理节点拖拽
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-port]')) return

      e.stopPropagation()
      setSelectNodeId(node.id)

      // 只读模式不允许拖拽
      if (readMode) return

      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        nodeX: node.position.x,
        nodeY: node.position.y,
      }

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragStartRef.current) return

        setIsDragging(true)

        const deltaX =
          (moveEvent.clientX - dragStartRef.current.x) / transform.zoom
        const deltaY =
          (moveEvent.clientY - dragStartRef.current.y) / transform.zoom

        const newX = dragStartRef.current.nodeX + deltaX
        const newY = dragStartRef.current.nodeY + deltaY

        setValue({
          ...value,
          nodes: value.nodes.map((n) =>
            n.id === node.id
              ? { ...n, position: { ...n.position, x: newX, y: newY } }
              : n
          ),
        })
      }

      const handleMouseUp = () => {
        dragStartRef.current = null
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [
      node.id,
      node.position,
      transform.zoom,
      setSelectNodeId,
      value,
      setValue,
      readMode,
    ]
  )

  // 分组端口
  const inputPorts = node.port.filter((p) => p.type === 'input')
  const outputPorts = node.port.filter((p) => p.type === 'output')

  return (
    <div
      ref={nodeRef}
      data-node
      className={cn(
        'absolute cursor-move select-none',
        isDragging && 'z-50',
        selected && 'z-40'
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        minWidth: DEFAULT_NODE_MIN_WIDTH,
        minHeight: DEFAULT_NODE_MIN_HEIGHT,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 输入端口 */}
      <div
        className={cn(
          'absolute z-10 flex justify-around',
          orientation === 'vertical'
            ? 'top-0 left-0 w-full flex-row items-start'
            : 'top-0 left-0 h-full flex-col items-start'
        )}
      >
        {inputPorts.map((port) => (
          <FlowPortComponent
            key={port.id}
            port={port}
            nodeId={node.id}
            portCount={inputPorts.length}
          />
        ))}
      </div>

      {/* 节点内容 - 用户自定义渲染 */}
      <div
        className={cn(
          'bg-card border-border hover:ring-ring relative h-full w-full rounded-md border shadow-sm transition-colors hover:ring-2',
          (selected || isDragging) && 'ring-ring ring-2'
        )}
      >
        {onNodeRender(node)}
      </div>

      {/* 输出端口 */}
      <div
        className={cn(
          'absolute z-10 flex justify-around',
          orientation === 'vertical'
            ? 'bottom-0 left-0 w-full flex-row items-end'
            : 'top-0 right-0 h-full flex-col items-end'
        )}
      >
        {outputPorts.map((port) => (
          <FlowPortComponent
            key={port.id}
            port={port}
            nodeId={node.id}
            portCount={outputPorts.length}
          />
        ))}
      </div>
    </div>
  )
}
