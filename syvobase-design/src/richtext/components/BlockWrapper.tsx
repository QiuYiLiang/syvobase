import { cn } from '@/utils'
import { Icon } from '@/icon'
import { ReactNode, useState, useRef } from 'react'
import { Dropdown, DropdownMenuType } from '@/dropdown'
import { useEditorRef, PlateElement, PlateElementProps } from 'platejs/react'
import { Path as SlatePath, Editor, Node } from 'slate'

interface BlockWrapperProps {
  children: ReactNode
  element: any
  className?: string
}

export const BlockWrapper = ({
  children,
  element,
  className,
}: BlockWrapperProps) => {
  const editor = useEditorRef()
  const [showHandle, setShowHandle] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const getPath = () => {
    try {
      const [entry] = Editor.nodes(editor as any, {
        match: (n: Node) => n === element,
        at: [],
      })
      return entry ? entry[1] : null
    } catch {
      return null
    }
  }

  const handleAddBlock = () => {
    const path = getPath()
    if (!path) return

    const newPath = SlatePath.next(path)
    editor.tf.insertNodes({ type: 'p', children: [{ text: '' }] } as any, {
      at: newPath,
    })
    editor.tf.select(newPath)
  }

  const handleDeleteBlock = () => {
    const path = getPath()
    if (!path) return
    editor.tf.removeNodes({ at: path })
  }

  const handleDuplicate = () => {
    const path = getPath()
    if (!path) return

    const newPath = SlatePath.next(path)
    editor.tf.insertNodes({ ...element } as any, { at: newPath })
  }

  const handleMoveUp = () => {
    const path = getPath()
    if (!path || path[0] === 0) return

    const prevPath = SlatePath.previous(path)
    editor.tf.moveNodes({ at: path, to: prevPath })
  }

  const handleMoveDown = () => {
    const path = getPath()
    if (!path) return

    const nextPath = SlatePath.next(path)
    try {
      editor.tf.moveNodes({
        at: path,
        to: SlatePath.next(nextPath),
      })
    } catch {
      // 已经是最后一个
    }
  }

  const menuItems: DropdownMenuType = [
    {
      icon: 'Trash2',
      name: '删除',
      onClick: handleDeleteBlock,
    },
    {
      icon: 'Copy',
      name: '复制块',
      onClick: handleDuplicate,
    },
    { type: 'separator' },
    {
      icon: 'ArrowUp',
      name: '上移',
      onClick: handleMoveUp,
    },
    {
      icon: 'ArrowDown',
      name: '下移',
      onClick: handleMoveDown,
    },
  ]

  return (
    <div
      ref={wrapperRef}
      className={cn('group relative', className)}
      onMouseEnter={() => setShowHandle(true)}
      onMouseLeave={() => setShowHandle(false)}
    >
      {/* 左侧操作区 */}
      <div
        className={cn(
          'absolute top-0 -left-12 flex h-full items-start gap-0.5 pt-1 opacity-0 transition-opacity',
          showHandle && 'opacity-100'
        )}
        contentEditable={false}
      >
        {/* 添加按钮 */}
        <button
          type='button'
          className='text-muted-foreground hover:bg-secondary flex h-6 w-6 items-center justify-center rounded'
          onClick={handleAddBlock}
        >
          <Icon name='Plus' className='h-4 w-4' />
        </button>

        {/* 拖拽手柄 */}
        <Dropdown items={menuItems} trigger='click' disabledIcon={false}>
          <button
            type='button'
            className='text-muted-foreground hover:bg-secondary flex h-6 w-6 cursor-grab items-center justify-center rounded active:cursor-grabbing'
          >
            <Icon name='GripVertical' className='h-4 w-4' />
          </button>
        </Dropdown>
      </div>

      {/* 内容区 */}
      {children}
    </div>
  )
}

// 带拖拽的段落元素
export const DraggableParagraphElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <BlockWrapper element={props.element}>
      <PlateElement
        as='p'
        className={cn('m-0 px-0 py-1 leading-7', className)}
        {...props}
      >
        {children}
      </PlateElement>
    </BlockWrapper>
  )
}
