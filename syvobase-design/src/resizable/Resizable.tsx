import { BaseDirectionProps, cn } from '@/utils'
import { CSSProperties, ReactNode } from 'react'
import { SplitPane as _SplitPane } from 'react-split-pane'
import './Resizable.css'
import { mergeTag } from '@/utils/tag'

export interface ResizableProps extends BaseDirectionProps {
  className?: string
  style?: CSSProperties
  size?: number
  allowResize?: boolean
  onSizeChange?: (size: number) => void
  children: [ReactNode, ReactNode]
}

const SplitPane = _SplitPane as any

export const Resizable = (props: ResizableProps) => {
  const {
    className,
    style,
    direction = 'left',
    size = 100,
    allowResize = true,
    onSizeChange,
    children,
  } = props
  return (
    <SplitPane
      {...mergeTag('resizable', props)}
      className={cn('nk-resizable', className)}
      allowResize={allowResize}
      defaultSize={size}
      split={['left', 'right'].includes(direction) ? 'vertical' : 'horizontal'}
      primary={['left', 'top'].includes(direction) ? 'first' : 'second'}
      onChange={(size: number) => {
        onSizeChange?.(size)
      }}
      style={style}
    >
      <div className='h-full w-full'>{children[0]}</div>
      <div className='h-full w-full'>{children[1]}</div>
    </SplitPane>
  )
}
