import { useEditorRef, useEditorSelection } from 'platejs/react'
import { cn } from '@/utils'
import { $t } from '@/utils/i18n'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Range, Element, Transforms, Node } from 'slate'
import { Toolbar } from '@/toolbar'
import { Icon } from '@/icon'
import { setLinkInsertHandler } from './linkInsertEvent'

/**
 * 链接浮动工具栏
 * 当光标位于链接上时显示，提供编辑、断开、打开链接功能
 * 也支持新增链接
 */
export const LinkFloatingToolbar = () => {
  const editor = useEditorRef()
  const selection = useEditorSelection()
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit' | 'insert'>('view')
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [editText, setEditText] = useState('')
  const [linkPath, setLinkPath] = useState<number[] | null>(null)
  const [insertSelection, setInsertSelection] = useState<Range | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  // 注册全局事件处理器
  useEffect(() => {
    setLinkInsertHandler((options) => {
      setEditUrl('')
      setEditText(options.text)
      setPosition(options.position)
      setInsertSelection(editor.selection ? { ...editor.selection } : null)
      setMode('insert')
      setVisible(true)
      setTimeout(() => {
        urlInputRef.current?.focus()
      }, 0)
    })
    return () => {
      setLinkInsertHandler(null)
    }
  }, [editor.selection])

  // 查找当前光标所在的链接节点
  const findLinkNode = () => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return null
    }

    try {
      const [match] = Editor.nodes(editor as any, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          (n as any).type === 'a',
      })

      if (match) {
        const [node, path] = match as [any, number[]]
        return { node, path }
      }
    } catch {
      // ignore
    }

    return null
  }

  // 更新浮动工具栏位置（仅编辑模式）
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePosition = () => {
    // 如果是插入模式，不更新位置
    if (mode === 'insert') return

    const linkInfo = findLinkNode()
    if (!linkInfo) {
      setVisible(false)
      setMode('view')
      return
    }

    const { node, path } = linkInfo
    setLinkUrl(node.url || '')
    setLinkText(Node.string(node))
    setLinkPath(path)

    // 获取链接元素的 DOM 位置
    try {
      const domNode = (editor as any).toDOMNode?.(node)
      if (domNode) {
        const rect = domNode.getBoundingClientRect()
        setPosition({
          top: rect.bottom + 4,
          left: rect.left,
        })
        setVisible(true)
        return
      }
    } catch {
      // fallback to selection position
    }

    // 使用选区位置作为后备
    const domSelection = window.getSelection()
    if (domSelection && domSelection.rangeCount > 0) {
      const domRange = domSelection.getRangeAt(0)
      const rect = domRange.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
      setVisible(true)
    }
  }

  // 监听选区变化
  useEffect(() => {
    if (mode !== 'insert') {
      updatePosition()
    }
  }, [selection, updatePosition, mode])

  // 进入编辑模式
  const handleStartEdit = () => {
    setEditUrl(linkUrl)
    setEditText(linkText)
    setMode('edit')
    setTimeout(() => {
      urlInputRef.current?.focus()
      urlInputRef.current?.select()
    }, 0)
  }

  // 保存编辑
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSaveEdit = () => {
    if (!linkPath || !editUrl.trim()) return

    // 更新链接 URL
    Transforms.setNodes(
      editor as any,
      { url: editUrl.trim() } as Partial<any>,
      { at: linkPath }
    )

    // 如果文本有变化，更新文本
    if (editText !== linkText) {
      // 删除原节点并插入新节点
      Transforms.delete(editor as any, { at: linkPath })
      Transforms.insertNodes(
        editor as any,
        {
          type: 'a',
          url: editUrl.trim(),
          children: [{ text: editText || editUrl.trim() }],
        } as any,
        { at: linkPath }
      )
    }

    setLinkUrl(editUrl.trim())
    setLinkText(editText)
    setMode('view')
  }

  // 保存新增
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSaveInsert = () => {
    if (!editUrl.trim()) return

    // 恢复选区
    if (insertSelection) {
      editor.tf.select(insertSelection)
    }

    const hasSelection =
      insertSelection && !Range.isCollapsed(insertSelection as any)

    if (hasSelection) {
      // 有选中文本，包裹成链接
      editor.tf.wrapNodes(
        { type: 'a', url: editUrl.trim(), children: [] } as any,
        { split: true }
      )
    } else {
      // 没有选中文本，插入新链接
      editor.tf.insertNodes({
        type: 'a',
        url: editUrl.trim(),
        children: [{ text: editText || editUrl.trim() }],
      } as any)
    }

    setVisible(false)
    setMode('view')
  }

  // 断开链接（取消链接格式，保留文本）
  const handleUnlink = () => {
    if (!linkPath) return

    Transforms.unwrapNodes(editor as any, {
      at: linkPath,
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && (n as any).type === 'a',
    })
    setVisible(false)
  }

  // 打开链接
  const handleOpen = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (mode === 'edit') {
        handleSaveEdit()
      } else if (mode === 'insert') {
        handleSaveInsert()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setVisible(false)
      setMode('view')
    }
  }

  // 点击外部时自动保存并关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as HTMLElement)
      ) {
        // 如果在编辑/插入模式，先保存
        if (mode === 'edit' && editUrl.trim()) {
          handleSaveEdit()
        } else if (mode === 'insert' && editUrl.trim()) {
          handleSaveInsert()
        }
        setVisible(false)
        setMode('view')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mode, editUrl, handleSaveEdit, handleSaveInsert])

  if (!visible) return null

  const isInputMode = mode === 'edit' || mode === 'insert'

  return createPortal(
    <div
      ref={toolbarRef}
      className={cn(
        'border-border bg-popover text-popover-foreground fixed z-9999 rounded-md border p-1 shadow-md',
        'animate-in fade-in-0 slide-in-from-top-2'
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {isInputMode ? (
        // 编辑/插入模式：显示输入框
        <div className='flex flex-col gap-1'>
          {/* 链接地址 */}
          <div className='flex items-center gap-1'>
            <div className='text-muted-foreground flex w-6 items-center justify-center'>
              <Icon name='Link' className='h-4 w-4' />
            </div>
            <input
              ref={urlInputRef}
              type='text'
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className='text-foreground placeholder:text-muted-foreground h-7 w-56 border-none bg-transparent px-2 text-sm outline-none'
              placeholder={$t('richtext.enterLinkUrl')}
            />
          </div>
          {/* 链接文本 */}
          <div className='flex items-center gap-1'>
            <div className='text-muted-foreground flex w-6 items-center justify-center'>
              <Icon name='Type' className='h-4 w-4' />
            </div>
            <input
              type='text'
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className='text-foreground placeholder:text-muted-foreground h-7 w-56 border-none bg-transparent px-2 text-sm outline-none'
              placeholder={$t('richtext.enterLinkText')}
            />
          </div>
        </div>
      ) : (
        // 预览模式：显示按钮
        <Toolbar
          inlineMode
          items={[
            {
              icon: 'Pencil',
              onClick: handleStartEdit,
              title: $t('richtext.editLink'),
            },
            {
              icon: 'ExternalLink',
              onClick: handleOpen,
              title: $t('richtext.openLink'),
            },
            {
              icon: 'Unlink',
              onClick: handleUnlink,
              title: $t('richtext.unlink'),
            },
          ]}
        />
      )}
    </div>,
    document.body
  )
}
