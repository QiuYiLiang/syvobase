import React from 'react'
import { GripVertical, Plus } from 'lucide-react'
import { isType, KEYS } from 'platejs'
import {
  type PlateElementProps,
  type RenderNodeWrapper,
  MemoizedChildren,
  useEditorRef,
} from 'platejs/react'
import { cn } from '@/utils'
import { Path as SlatePath, Transforms } from 'slate'

const UNDRAGGABLE_KEYS = [KEYS.column, KEYS.tr, KEYS.td, KEYS.th]

// 全局拖拽状态
let globalDragData: { id: string; path: number[] } | null = null

export const BlockDraggable: RenderNodeWrapper = (props) => {
  const { editor, element, path } = props

  const enabled = (() => {
    if (editor.dom.readOnly) return false

    // 只对顶层块启用拖拽
    if (path.length === 1 && !isType(editor, element, UNDRAGGABLE_KEYS)) {
      return true
    }

    return false
  })()

  if (!enabled) return

  return (props) => <Draggable {...props} />
}

function Draggable(props: PlateElementProps) {
  const { children, element, path } = props
  const editor = useEditorRef()
  const [isDragging, setIsDragging] = React.useState(false)
  const [dropPosition, setDropPosition] = React.useState<
    'top' | 'bottom' | null
  >(null)
  const nodeRef = React.useRef<HTMLDivElement>(null)

  // 添加新块并触发命令面板
  const handleAddBlock = () => {
    const newPath = SlatePath.next(path)
    editor.tf.insertNodes(
      { type: 'p', id: crypto.randomUUID(), children: [{ text: '/' }] } as any,
      { at: newPath }
    )
    // 选中新插入的段落末尾（/ 字符之后）
    editor.tf.select({
      anchor: { path: [...newPath, 0], offset: 1 },
      focus: { path: [...newPath, 0], offset: 1 },
    })
  }

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData(
      'application/x-plate-block',
      JSON.stringify({ id: element.id })
    )
    globalDragData = { id: element.id as string, path: [...path] }
    setIsDragging(true)

    // 设置拖拽预览
    if (nodeRef.current) {
      e.dataTransfer.setDragImage(nodeRef.current, 0, 0)
    }
  }

  // 拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false)
    globalDragData = null
  }

  // 拖拽经过
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (!globalDragData || globalDragData.id === element.id) {
      setDropPosition(null)
      return
    }

    // 计算放置位置
    const rect = nodeRef.current?.getBoundingClientRect()
    if (rect) {
      const mouseY = e.clientY
      const middle = rect.top + rect.height / 2
      setDropPosition(mouseY < middle ? 'top' : 'bottom')
    }
  }

  // 拖拽离开
  const handleDragLeave = () => {
    setDropPosition(null)
  }

  // 放置
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDropPosition(null)

    if (!globalDragData || globalDragData.id === element.id) return

    const dragId = globalDragData.id

    try {
      // 找到拖拽元素的当前路径
      const dragEntry = editor.api.node({ id: dragId, at: [] })
      if (!dragEntry) return

      const [, currentDragPath] = dragEntry

      // 计算目标位置
      const rect = nodeRef.current?.getBoundingClientRect()
      const mouseY = e.clientY
      const middle = rect ? rect.top + rect.height / 2 : 0

      let targetPath: number[]
      if (mouseY < middle) {
        // 放在上方
        targetPath = [...path]
      } else {
        // 放在下方
        targetPath = SlatePath.next(path)
      }

      // 如果拖拽元素在目标之前，调整目标路径
      if (SlatePath.isBefore(currentDragPath, targetPath)) {
        targetPath = SlatePath.previous(targetPath)
      }

      // 移动节点
      Transforms.moveNodes(editor as any, {
        at: currentDragPath,
        to: targetPath,
      })
    } catch (err) {
      console.error('Drop error:', err)
    }
  }

  return (
    <div
      className={cn('group relative', isDragging && 'opacity-50')}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 左侧操作区 - Gutter */}
      <Gutter>
        <div className='pointer-events-auto relative flex items-center gap-1 px-1'>
          {/* 添加按钮 */}
          <button
            type='button'
            className='text-muted-foreground hover:bg-secondary flex h-6 w-6 items-center justify-center rounded'
            onClick={handleAddBlock}
          >
            <Plus className='h-4 w-4' />
          </button>

          {/* 拖拽手柄 */}
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className='text-muted-foreground hover:bg-secondary flex h-6 w-6 cursor-grab items-center justify-center rounded active:cursor-grabbing'
            role='button'
            data-plate-prevent-deselect
          >
            <GripVertical className='h-4 w-4' />
          </div>
        </div>
      </Gutter>
      {/* 放置指示线 */}
      {dropPosition && (
        <div
          className={cn(
            'bg-primary pointer-events-none absolute right-0 left-0 z-10 h-0.5',
            dropPosition === 'top'
              ? 'top-0 -translate-y-1/2'
              : 'bottom-0 translate-y-1/2'
          )}
        />
      )}
      {/* 内容区域 */}
      <div ref={nodeRef} className='flow-root'>
        <MemoizedChildren>{children}</MemoizedChildren>
      </div>
    </div>
  )
}

function Gutter({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'absolute top-1/2 -left-16 z-50 flex h-7 -translate-y-1/2 cursor-text items-center opacity-0 transition-opacity',
        'group-hover:opacity-100',
        className
      )}
      contentEditable={false}
    >
      {children}
    </div>
  )
}
