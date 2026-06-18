import { BaseProps, cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { GripHorizontal, GripVertical } from 'lucide-react'
import { ReactNode, useCallback, useRef } from 'react'

export type SplitDirection = 'left' | 'right' | 'top' | 'bottom'

export interface SplitProps extends BaseProps {
  /** 固定面板所在方向 */
  direction?: SplitDirection
  /** 固定面板的宽度（水平方向）或高度（垂直方向），单位 px */
  fixedWidth?: number
  /** 固定面板的内容 */
  fixedContent?: ReactNode
  /** 弹性面板的内容（flex-1 自动填充剩余空间） */
  content?: ReactNode
  /** 拖动把手时的回调 */
  onFixedWidthChange?: (width: number) => void
  /** 固定面板的最小宽度/高度 */
  minFixedWidth?: number
  /** 固定面板的最大宽度/高度 */
  maxFixedWidth?: number
  /** 只读模式，不显示分割线且不可拖动 */
  readMode?: boolean
}

const isHorizontal = (dir: SplitDirection) => dir === 'left' || dir === 'right'

export const Split = (props: SplitProps) => {
  const {
    className,
    style,
    direction = 'left',
    fixedWidth = 200,
    fixedContent,
    content,
    onFixedWidthChange,
    minFixedWidth = 0,
    maxFixedWidth = Infinity,
    readMode = false,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const horizontal = isHorizontal(direction)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (readMode) return
      e.preventDefault()
      dragging.current = true

      const startPos = horizontal ? e.clientX : e.clientY
      const startWidth = fixedWidth

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return
        const currentPos = horizontal ? ev.clientX : ev.clientY
        let delta = currentPos - startPos

        // right/bottom 方向需要反转拖动方向
        if (direction === 'right' || direction === 'bottom') {
          delta = -delta
        }

        let newWidth = startWidth + delta
        newWidth = Math.max(minFixedWidth, Math.min(maxFixedWidth, newWidth))
        onFixedWidthChange?.(Math.round(newWidth))
      }

      const onMouseUp = () => {
        dragging.current = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = horizontal ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    },
    [
      readMode,
      horizontal,
      direction,
      fixedWidth,
      onFixedWidthChange,
      minFixedWidth,
      maxFixedWidth,
    ]
  )

  const fixedSizeStyle = horizontal
    ? { width: fixedWidth, minWidth: fixedWidth }
    : { height: fixedWidth, minHeight: fixedWidth }

  const GripIcon = horizontal ? GripVertical : GripHorizontal

  const handleEl = !readMode && (
    <div
      className={cn(
        'group relative flex shrink-0 items-center justify-center',
        horizontal
          ? '-mx-[7.5px] w-4 cursor-col-resize'
          : '-my-[7.5px] h-4 cursor-row-resize'
      )}
      onMouseDown={handleMouseDown}
    >
      {/* 分割线 */}
      <div
        className={cn(
          'bg-border absolute',
          horizontal
            ? 'inset-y-0 w-px group-hover:w-1'
            : 'inset-x-0 h-px group-hover:h-1'
        )}
      />
      {/* 把手 */}
      <div
        className={cn(
          'border-border bg-background group-hover:bg-accent z-10 flex items-center justify-center rounded-md border shadow-sm',
          horizontal ? 'h-8 w-3' : 'h-3 w-8'
        )}
      >
        <GripIcon className='text-muted-foreground h-2.5 w-2.5' />
      </div>
    </div>
  )

  const fixedPanel = (
    <div className='overflow-auto' style={fixedSizeStyle}>
      {fixedContent}
    </div>
  )

  const flexPanel = (
    <div className='min-h-0 min-w-0 flex-1 overflow-auto'>{content}</div>
  )

  // 根据方向决定固定面板和弹性面板的排列顺序
  const isFixedFirst = direction === 'left' || direction === 'top'

  return (
    <div
      {...mergeTag('split', props)}
      ref={containerRef}
      className={cn(
        'flex h-full w-full',
        horizontal ? 'flex-row' : 'flex-col',
        className
      )}
      style={style}
    >
      {isFixedFirst ? (
        <>
          {fixedPanel}
          {handleEl}
          {flexPanel}
        </>
      ) : (
        <>
          {flexPanel}
          {handleEl}
          {fixedPanel}
        </>
      )}
    </div>
  )
}
