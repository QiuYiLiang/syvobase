import { Popover } from '@/popover'
import {
  FlowAddPanelState,
  FlowPoint,
  FlowProps,
  FlowValue,
  FlowOrientation,
  FlowNodeSize,
  DEFAULT_NODE_MIN_WIDTH,
  DEFAULT_NODE_MIN_HEIGHT,
  calculateNodePosition,
  getBezierPath,
} from './shared'

interface FlowAddPanelProps {
  addPanelState: FlowAddPanelState
  nodes: FlowValue['nodes']
  onCreateRender: NonNullable<FlowProps['onCreateRender']>
  addNode: (value: { id: string }) => void
  onClose: () => void
  getPortPosition: (nodeId: string, portId: string) => FlowPoint | null
  orientation: FlowOrientation
  nodeSizes: Map<string, FlowNodeSize>
}

/** 添加面板覆层 - 骨架屏 + Popover + 连接线 */
export const FlowAddPanel = ({
  addPanelState,
  nodes,
  onCreateRender,
  addNode,
  onClose,
  getPortPosition,
  orientation,
  nodeSizes,
}: FlowAddPanelProps) => {
  // 计算骨架屏位置
  let skeletonX: number
  let skeletonY: number

  if (addPanelState.useDragPosition) {
    skeletonX = addPanelState.position.x
    skeletonY = addPanelState.position.y - DEFAULT_NODE_MIN_HEIGHT / 2
  } else {
    const pos = calculateNodePosition(
      addPanelState.sourceNodeId,
      nodes,
      addPanelState.position,
      nodeSizes
    )
    skeletonX = pos.x
    skeletonY = pos.y
  }

  // 计算连接线路径
  const sourcePosition = getPortPosition(
    addPanelState.sourceNodeId,
    addPanelState.sourcePortId
  )
  const targetPosition: FlowPoint = {
    x:
      orientation === 'vertical'
        ? skeletonX + DEFAULT_NODE_MIN_WIDTH / 2
        : skeletonX,
    y:
      orientation === 'vertical'
        ? skeletonY
        : skeletonY + DEFAULT_NODE_MIN_HEIGHT / 2,
  }

  const edgePath = sourcePosition
    ? getBezierPath(sourcePosition, targetPosition, orientation)
    : ''

  return (
    <>
      {/* 激活状态的连接线 */}
      {edgePath && (
        <svg
          className='pointer-events-none absolute overflow-visible'
          style={{ left: 0, top: 0, width: 1, height: 1 }}
        >
          <defs>
            <marker
              id='skeleton-arrow'
              markerWidth={10}
              markerHeight={10}
              refX={9}
              refY={5}
              orient='auto'
              markerUnits='userSpaceOnUse'
            >
              <path
                d='M 0 1 L 8 5 L 0 9 Q 1.5 5 0 1'
                fill='var(--color-primary)'
              />
            </marker>
          </defs>
          {/* 白色底层 */}
          <path
            d={edgePath}
            fill='none'
            className='stroke-background'
            strokeWidth={6}
            strokeLinecap='round'
          />
          {/* 激活状态的连线 */}
          <path
            d={edgePath}
            fill='none'
            stroke='var(--color-primary)'
            strokeWidth={2}
            strokeLinecap='round'
            markerEnd='url(#skeleton-arrow)'
          />
        </svg>
      )}

      {/* 骨架屏 + Popover */}
      <Popover
        trigger='click'
        direction='right'
        align='center'
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
        content={onCreateRender({ addNode })}
      >
        <div
          className='bg-muted/50 border-primary absolute rounded-md border-2 border-dashed'
          style={{
            left: skeletonX,
            top: skeletonY,
            minWidth: DEFAULT_NODE_MIN_WIDTH,
            minHeight: DEFAULT_NODE_MIN_HEIGHT,
          }}
        />
      </Popover>
    </>
  )
}
