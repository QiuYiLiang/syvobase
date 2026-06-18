import { useState } from 'react'
import {
  FlowEdgeValue,
  FlowPoint,
  FlowPendingConnection,
  FlowOrientation,
  useFlowContext,
} from './shared'

// 颜色配置 - 使用 CSS 变量
const STROKE_COLOR = {
  default: 'var(--color-muted-foreground)',
  hover: 'var(--color-primary)',
  selected: 'var(--color-foreground)', // 选中时使用字体色
}

/** 计算贝塞尔曲线路径 */
const getBezierPath = (
  source: FlowPoint,
  target: FlowPoint,
  orientation: FlowOrientation = 'horizontal'
): { path: string; centerPoint: FlowPoint } => {
  let path: string

  if (orientation === 'vertical') {
    const dy = Math.abs(target.y - source.y)
    const controlOffset = Math.max(80, dy * 0.4)
    path = `M ${source.x} ${source.y} C ${source.x} ${source.y + controlOffset}, ${target.x} ${target.y - controlOffset}, ${target.x} ${target.y}`
  } else {
    const dx = Math.abs(target.x - source.x)
    const controlOffset = Math.max(80, dx * 0.4)
    path = `M ${source.x} ${source.y} C ${source.x + controlOffset} ${source.y}, ${target.x - controlOffset} ${target.y}, ${target.x} ${target.y}`
  }

  const centerPoint = {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2,
  }

  return { path, centerPoint }
}

/** 连线组件 */
interface FlowEdgeComponentProps {
  edge: FlowEdgeValue
}

export const FlowEdgeComponent = ({ edge }: FlowEdgeComponentProps) => {
  const {
    selectEdgeId,
    setSelectEdgeId,
    getPortPosition,
    setHoverEdgeId,
    orientation,
  } = useFlowContext()

  const [isHovered, setIsHovered] = useState(false)

  const selected = selectEdgeId === edge.id

  // 获取源端口和目标端口位置
  const sourcePosition = getPortPosition(edge.source.id, edge.source.portId)
  const targetPosition = getPortPosition(edge.target.id, edge.target.portId)

  if (!sourcePosition || !targetPosition) {
    return null
  }

  const { path } = getBezierPath(sourcePosition, targetPosition, orientation)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectEdgeId(edge.id)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setHoverEdgeId(edge.id)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setHoverEdgeId(null)
  }

  const markerId = `arrow-${edge.id}`
  const strokeColor = selected
    ? STROKE_COLOR.selected
    : isHovered
      ? STROKE_COLOR.hover
      : STROKE_COLOR.default

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className='cursor-pointer'
      style={{ pointerEvents: 'all' }}
    >
      {/* 定义 */}
      <defs>
        {/* 箭头 */}
        <marker
          id={markerId}
          markerWidth={10}
          markerHeight={10}
          refX={9}
          refY={5}
          orient='auto'
          markerUnits='userSpaceOnUse'
        >
          <path d='M 0 1 L 8 5 L 0 9 Q 1.5 5 0 1' fill={strokeColor} />
        </marker>
      </defs>

      {/* 不可见的宽路径用于更容易的交互 */}
      <path
        d={path}
        fill='none'
        stroke='transparent'
        strokeWidth={16}
        strokeLinecap='round'
        className='cursor-pointer'
      />

      {/* 白色底层，用于交叉处层级区分 */}
      <path
        d={path}
        fill='none'
        className='stroke-background'
        strokeWidth={6}
        strokeLinecap='round'
      />

      {/* 可见的连线 */}
      <path
        d={path}
        fill='none'
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap='round'
        markerEnd={`url(#${markerId})`}
        className='cursor-pointer'
      />
    </g>
  )
}

/** 正在创建的连线 */
interface FlowPendingEdgeProps {
  pendingConnection: FlowPendingConnection
}

export const FlowPendingEdge = ({
  pendingConnection,
}: FlowPendingEdgeProps) => {
  const { orientation } = useFlowContext()
  const { path } = getBezierPath(
    pendingConnection.sourcePosition,
    pendingConnection.mousePosition,
    orientation
  )

  return (
    <g>
      <defs>
        <marker
          id='pending-arrow'
          markerWidth={10}
          markerHeight={10}
          refX={8}
          refY={5}
          orient='auto'
          markerUnits='userSpaceOnUse'
        >
          <path d='M 0 1 L 8 5 L 0 9 Q 1.5 5 0 1' fill='var(--color-primary)' />
        </marker>
      </defs>
      <path
        d={path}
        fill='none'
        stroke='var(--color-primary)'
        strokeWidth={2}
        strokeLinecap='round'
        strokeDasharray='6,4'
        strokeOpacity={0.6}
        markerEnd='url(#pending-arrow)'
        className='pointer-events-none animate-pulse'
      />
    </g>
  )
}
