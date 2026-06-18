import { createContext, ReactNode, RefAttributes, useContext } from 'react'
import { BaseOrientationProps, BaseValueProps } from '@/utils'

// ==================== 常量 ====================

/** 最小缩放 */
export const MIN_ZOOM = 0.1
/** 最大缩放 */
export const MAX_ZOOM = 2
/** 默认节点最小宽度 */
export const DEFAULT_NODE_MIN_WIDTH = 120
/** 默认节点最小高度 */
export const DEFAULT_NODE_MIN_HEIGHT = 40
/** 节点间水平间距 */
export const HORIZONTAL_GAP = 80
/** 节点间垂直间距 */
export const VERTICAL_GAP = 20

// ==================== FlowModel ====================

/** Flow 组件暴露的方法 */
export interface FlowModel {
  /** 执行自动布局 */
  autoLayout: () => void
  /** 适应视图（居中显示所有节点） */
  fitView: () => void
}

// ==================== 端口(Port)相关类型 ====================

export interface FlowPortValue {
  type: 'input' | 'output'
  id: string
  name: string
}

// ==================== 节点(Node)相关类型 ====================

export interface FlowNodeValue {
  id: string
  position: {
    x: number
    y: number
  }
  port: FlowPortValue[]
}

/** 节点尺寸信息 */
export interface FlowNodeSize {
  width: number
  height: number
}

// ==================== 连线(Edge)相关类型 ====================

export interface FlowEdgeValue {
  id: string
  source: {
    id: string
    portId: string
  }
  target: {
    id: string
    portId: string
  }
}

// ==================== Flow数据类型 ====================

export interface FlowValue {
  nodes: FlowNodeValue[]
  edges: FlowEdgeValue[]
}

// ==================== Flow组件Props ====================

export interface FlowProps
  extends
    BaseValueProps<FlowValue>,
    BaseOrientationProps,
    RefAttributes<FlowModel> {
  onNodeRender: (value: FlowNodeValue) => ReactNode
  defaultSelectNodeId?: string | null
  selectNodeId?: string | null
  onSelectNodeIdChange?: (value: string | null) => void
  defaultSelectEdgeId?: string | null
  selectEdgeId?: string | null
  onSelectEdgeIdChange?: (value: string | null) => void
  onCreateRender?: ({
    addNode,
  }: {
    addNode: (value: { id: string }) => void
  }) => ReactNode
  /** 只读模式，禁止编辑 */
  readMode?: boolean
}

// ==================== 内部使用的类型 ====================

/** 二维坐标点 */
export interface FlowPoint {
  x: number
  y: number
}

/** 画布变换状态 */
export interface FlowTransform {
  x: number
  y: number
  zoom: number
}

/** 正在创建的连接 */
export interface FlowPendingConnection {
  sourceNodeId: string
  sourcePortId: string
  sourcePosition: FlowPoint
  mousePosition: FlowPoint
}

/** 添加面板状态 */
export interface FlowAddPanelState {
  /** 面板显示的画布坐标 */
  position: FlowPoint
  /** 来源节点ID */
  sourceNodeId: string
  /** 来源端口ID */
  sourcePortId: string
  /** 是否使用拖拽位置（而非智能计算位置） */
  useDragPosition?: boolean
}

/** Flow 方向类型 */
export type FlowOrientation = 'horizontal' | 'vertical'

/** Flow Context */
export interface FlowContextValue {
  value: FlowValue
  setValue: (value: FlowValue) => void
  transform: FlowTransform
  setTransform: (transform: FlowTransform) => void
  selectNodeId: string | null
  setSelectNodeId: (id: string | null) => void
  selectEdgeId: string | null
  setSelectEdgeId: (id: string | null) => void
  hoverEdgeId: string | null
  setHoverEdgeId: (id: string | null) => void
  pendingConnection: FlowPendingConnection | null
  setPendingConnection: (conn: FlowPendingConnection | null) => void
  addPanelState: FlowAddPanelState | null
  setAddPanelState: (state: FlowAddPanelState | null) => void
  getPortPosition: (nodeId: string, portId: string) => FlowPoint | null
  screenToCanvas: (screenPoint: FlowPoint) => FlowPoint
  onNodeRender: (value: FlowNodeValue) => ReactNode
  onCreateRender?: FlowProps['onCreateRender']
  orientation: FlowOrientation
  nodeSizes: Map<string, FlowNodeSize>
  setNodeSize: (nodeId: string, size: FlowNodeSize) => void
  readMode: boolean
}

// ==================== Context ====================

export const FlowContext = createContext<FlowContextValue | null>(null)

export const useFlowContext = () => {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowProvider')
  }
  return context
}

// ==================== 工具函数 ====================

/** 计算新节点的智能位置 */
export const calculateNodePosition = (
  sourceNodeId: string,
  nodes: FlowValue['nodes'],
  fallbackPosition: FlowPoint,
  nodeSizes?: Map<string, FlowNodeSize>
): { x: number; y: number } => {
  const sourceNode = nodes.find((n) => n.id === sourceNodeId)
  const getNodeSize = (node: FlowNodeValue) => {
    const size = nodeSizes?.get(node.id)
    return {
      w: size?.width ?? DEFAULT_NODE_MIN_WIDTH,
      h: size?.height ?? DEFAULT_NODE_MIN_HEIGHT,
    }
  }

  if (!sourceNode) {
    return {
      x: fallbackPosition.x,
      y: fallbackPosition.y - DEFAULT_NODE_MIN_HEIGHT / 2,
    }
  }

  const sourceSize = getNodeSize(sourceNode)

  // 计算新节点的 X 位置：源节点右边缘 + 间距
  const nodeX = sourceNode.position.x + sourceSize.w + HORIZONTAL_GAP

  // 找到所有可能与新节点重叠的节点（X 范围有交集的节点）
  const overlappingNodes = nodes.filter((n) => {
    const nSize = getNodeSize(n)
    const nLeft = n.position.x
    const nRight = n.position.x + nSize.w
    const newLeft = nodeX
    const newRight = nodeX + DEFAULT_NODE_MIN_WIDTH
    return nLeft < newRight && nRight > newLeft
  })

  let nodeY: number
  if (overlappingNodes.length === 0) {
    // 没有重叠节点，与源节点垂直居中对齐
    nodeY =
      sourceNode.position.y + sourceSize.h / 2 - DEFAULT_NODE_MIN_HEIGHT / 2
  } else {
    // 有重叠节点，找到最下面的节点，在其下方插入
    const bottomMostNode = overlappingNodes.reduce((prev, curr) => {
      const prevSize = getNodeSize(prev)
      const currSize = getNodeSize(curr)
      return prev.position.y + prevSize.h > curr.position.y + currSize.h
        ? prev
        : curr
    })
    const bottomSize = getNodeSize(bottomMostNode)
    nodeY = bottomMostNode.position.y + bottomSize.h + VERTICAL_GAP
  }

  return { x: nodeX, y: nodeY }
}

/** 计算贝塞尔曲线路径 */
export const getBezierPath = (
  source: FlowPoint,
  target: FlowPoint,
  orientation: FlowOrientation = 'horizontal'
): string => {
  if (orientation === 'vertical') {
    const dy = Math.abs(target.y - source.y)
    const controlOffset = Math.max(80, dy * 0.4)
    return `M ${source.x} ${source.y} C ${source.x} ${source.y + controlOffset}, ${target.x} ${target.y - controlOffset}, ${target.x} ${target.y}`
  }
  const dx = Math.abs(target.x - source.x)
  const controlOffset = Math.max(80, dx * 0.4)
  return `M ${source.x} ${source.y} C ${source.x + controlOffset} ${source.y}, ${target.x - controlOffset} ${target.y}, ${target.x} ${target.y}`
}

/** 计算节点的边界框 */
export const getNodesBounds = (
  nodes: FlowValue['nodes'],
  nodeSizes?: Map<string, FlowNodeSize>
) => {
  if (nodes.length === 0) {
    return { minX: -1000, minY: -1000, maxX: 1000, maxY: 1000 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const node of nodes) {
    const size = nodeSizes?.get(node.id)
    const w = size?.width ?? DEFAULT_NODE_MIN_WIDTH
    const h = size?.height ?? DEFAULT_NODE_MIN_HEIGHT
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + w)
    maxY = Math.max(maxY, node.position.y + h)
  }

  return { minX, minY, maxX, maxY }
}
