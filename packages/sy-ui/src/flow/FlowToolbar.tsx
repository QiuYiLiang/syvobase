import { Minus, Plus, Maximize, Workflow, PlusCircle } from 'lucide-react'
import { Popover } from '@/popover'
import { FlowProps } from './shared'

interface FlowToolbarProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitToView: () => void
  onAutoLayout: () => void
  onCreateRender?: FlowProps['onCreateRender']
  addNode: (value: { id: string }) => void
}

/** 工具栏组件 */
export const FlowToolbar = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToView,
  onAutoLayout,
  onCreateRender,
  addNode,
}: FlowToolbarProps) => {
  return (
    <div className='border-border bg-card absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border p-1 shadow-md'>
      {onCreateRender && (
        <>
          <Popover
            trigger='hover'
            direction='top'
            content={onCreateRender({ addNode })}
          >
            <button
              type='button'
              className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors'
              title='添加节点'
            >
              <PlusCircle className='h-4 w-4' />
            </button>
          </Popover>
          <div className='bg-border mx-1 h-4 w-px' />
        </>
      )}

      <button
        type='button'
        onClick={onZoomOut}
        className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors'
        title='缩小'
      >
        <Minus className='h-4 w-4' />
      </button>

      <div className='text-muted-foreground flex h-8 min-w-[3.5rem] items-center justify-center text-xs'>
        {Math.round(zoom * 100)}%
      </div>

      <button
        type='button'
        onClick={onZoomIn}
        className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors'
        title='放大'
      >
        <Plus className='h-4 w-4' />
      </button>

      <div className='bg-border mx-1 h-4 w-px' />

      <button
        type='button'
        onClick={onFitToView}
        className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors'
        title='适应视图'
      >
        <Maximize className='h-4 w-4' />
      </button>

      <button
        type='button'
        onClick={onAutoLayout}
        className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors'
        title='优化布局'
      >
        <Workflow className='h-4 w-4' />
      </button>
    </div>
  )
}
