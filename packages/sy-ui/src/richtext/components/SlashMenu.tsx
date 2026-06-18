import { useEditorRef } from 'platejs/react'
import { Icon } from '@/icon'
import { cn } from '@/utils'
import { $t } from '@/utils/i18n'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Range, Editor } from 'slate'
import { createCommands, ToolbarKey, CommandItem } from './commands'
import { triggerLinkInsert } from './linkInsertEvent'
import { confirm } from '@/confirm'

// SlashMenu 默认显示的命令
const DEFAULT_SLASH_KEYS: ToolbarKey[] = [
  'paragraph',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'orderedList',
  'unorderedList',
  'todoList',
  'blockquote',
  'codeBlock',
  'hr',
  'table',
  'link',
  'image',
  'imageUrl',
  'video',
  'videoUrl',
  'audio',
  'audioUrl',
  'file',
  'fileUrl',
  'alignLeft',
  'alignCenter',
  'alignRight',
]

export interface SlashMenuProps {
  className?: string
  /** 要显示的命令 keys */
  keys?: ToolbarKey[]
}

export const SlashMenu = ({
  className,
  keys = DEFAULT_SLASH_KEYS,
}: SlashMenuProps) => {
  const editor = useEditorRef()
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const targetRangeRef = useRef<Range | null>(null)

  // 图片 - 本地上传
  const handleImageLocalUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        if (base64) {
          editor.tf.insertNodes({
            type: 'img',
            url: base64,
            children: [{ text: '' }],
          })
        }
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  // 图片 - 插入URL
  const handleImageUrlInsert = () => {
    confirm({
      header: $t('richtext.insertImageUrl'),
      items: [
        {
          id: 'url',
          name: 'URL',
          control: {
            type: 'text',
            placeholder: $t('richtext.enterImageUrl'),
          },
        },
      ],
      onConfirm: (value) => {
        if (value.url) {
          editor.tf.insertNodes({
            type: 'img',
            url: value.url,
            children: [{ text: '' }],
          })
        }
      },
    })
  }

  // 视频 - 本地上传
  const handleVideoLocalUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        if (base64) {
          editor.tf.insertNodes({
            type: 'video',
            url: base64,
            name: file.name,
            children: [{ text: '' }],
          })
        }
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  // 视频 - 插入URL
  const handleVideoUrlInsert = () => {
    confirm({
      header: $t('richtext.insertVideoUrl'),
      items: [
        {
          id: 'url',
          name: 'URL',
          control: {
            type: 'text',
            placeholder: $t('richtext.enterVideoUrl'),
          },
        },
      ],
      onConfirm: (value) => {
        if (value.url) {
          editor.tf.insertNodes({
            type: 'video',
            url: value.url,
            children: [{ text: '' }],
          })
        }
      },
    })
  }

  // 音频 - 本地上传
  const handleAudioLocalUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'audio/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        if (base64) {
          editor.tf.insertNodes({
            type: 'audio',
            url: base64,
            name: file.name,
            children: [{ text: '' }],
          })
        }
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  // 音频 - 插入URL
  const handleAudioUrlInsert = () => {
    confirm({
      header: $t('richtext.insertAudioUrl'),
      items: [
        {
          id: 'url',
          name: 'URL',
          control: {
            type: 'text',
            placeholder: $t('richtext.enterAudioUrl'),
          },
        },
      ],
      onConfirm: (value) => {
        if (value.url) {
          editor.tf.insertNodes({
            type: 'audio',
            url: value.url,
            children: [{ text: '' }],
          })
        }
      },
    })
  }

  // 文件 - 本地上传
  const handleFileLocalUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        if (base64) {
          editor.tf.insertNodes({
            type: 'file',
            url: base64,
            name: file.name,
            size: file.size,
            fileType: file.type,
            children: [{ text: '' }],
          })
        }
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  // 文件 - 插入URL
  const handleFileUrlInsert = () => {
    confirm({
      header: $t('richtext.insertFileUrl'),
      items: [
        {
          id: 'url',
          name: 'URL',
          control: {
            type: 'text',
            placeholder: $t('richtext.enterFileUrl'),
          },
        },
      ],
      onConfirm: (value) => {
        if (value.url) {
          const name =
            value.url.split('/').pop() || $t('richtext.defaultFileName')
          editor.tf.insertNodes({
            type: 'file',
            url: value.url,
            name,
            children: [{ text: '' }],
          })
        }
      },
    })
  }

  const handleBlock = (type: string) => {
    if (type === 'link') {
      // 获取当前选中的文本作为默认链接文本
      const selectedText = editor.selection
        ? Editor.string(editor as any, editor.selection)
        : ''

      // 获取选区位置，用于定位浮动工具栏
      let position = { top: 100, left: 100 }
      try {
        const domRange = (editor as any).toDOMRange?.(editor.selection)
        if (domRange) {
          const rect = domRange.getBoundingClientRect()
          position = {
            top: rect.bottom + 4,
            left: rect.left,
          }
        } else {
          const domSelection = window.getSelection()
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            position = {
              top: rect.bottom + 4,
              left: rect.left,
            }
          }
        }
      } catch {
        // ignore
      }

      triggerLinkInsert({
        text: selectedText,
        position,
      })
    } else if (type === 'img') {
      handleImageLocalUpload()
    } else if (type === 'img_url') {
      handleImageUrlInsert()
    } else if (type === 'video') {
      handleVideoLocalUpload()
    } else if (type === 'video_url') {
      handleVideoUrlInsert()
    } else if (type === 'audio') {
      handleAudioLocalUpload()
    } else if (type === 'audio_url') {
      handleAudioUrlInsert()
    } else if (type === 'file') {
      handleFileLocalUpload()
    } else if (type === 'file_url') {
      handleFileUrlInsert()
    } else if (type === 'table') {
      editor.tf.insertNodes({
        type: 'table',
        children: [
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: '' }] },
              { type: 'td', children: [{ text: '' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: '' }] },
              { type: 'td', children: [{ text: '' }] },
            ],
          },
        ],
      })
    } else if (type === 'code_block') {
      editor.tf.insertNodes({
        type: 'code_block',
        children: [{ type: 'code_line', children: [{ text: '' }] }],
      })
    } else if (type === 'hr') {
      editor.tf.insertNodes({ type: 'hr', children: [{ text: '' }] })
    } else {
      editor.tf.toggleBlock(type)
    }
  }

  // 模糊匹配函数：支持字符序列匹配
  const fuzzyMatch = (text: string, search: string): boolean => {
    const textLower = text.toLowerCase()
    const searchLower = search.toLowerCase()

    // 如果搜索词为空，返回 true
    if (!searchLower) return true

    // 精确包含匹配（优先）
    if (textLower.includes(searchLower)) return true

    // 模糊匹配：按顺序匹配字符
    let searchIndex = 0
    for (
      let i = 0;
      i < textLower.length && searchIndex < searchLower.length;
      i++
    ) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++
      }
    }

    return searchIndex === searchLower.length
  }

  // 获取所有命令并根据 keys 过滤
  const commands = (() => {
    const allCommands = createCommands()
    const keySet = new Set(keys)
    return allCommands.filter((cmd) => keySet.has(cmd.key))
  })()

  const filteredCommands = (() => {
    if (!search) return commands

    return commands.filter(
      (cmd) =>
        fuzzyMatch(cmd.key, search) ||
        fuzzyMatch(cmd.title, search) ||
        (cmd.description && fuzzyMatch(cmd.description, search)) ||
        cmd.keywords?.some((k) => fuzzyMatch(k, search))
    )
  })()

  const executeCommand = (command: CommandItem) => {
    if (targetRangeRef.current) {
      // 删除斜杠和搜索文本
      editor.tf.select(targetRangeRef.current)
      editor.tf.delete()
    }
    command.action(editor, handleBlock)
    setVisible(false)
    setSearch('')
    targetRangeRef.current = null
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => (i < filteredCommands.length - 1 ? i + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => (i > 0 ? i - 1 : filteredCommands.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setVisible(false)
          setSearch('')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible, filteredCommands, selectedIndex, executeCommand])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    const checkSlashCommand = () => {
      const { selection } = editor
      if (!selection || !Range.isCollapsed(selection)) {
        setVisible(false)
        return
      }

      try {
        const [start] = Range.edges(selection)
        const beforeRange = {
          anchor: { ...start, offset: 0 },
          focus: start,
        }
        const beforeText = Editor.string(editor as any, beforeRange)

        // 支持中文和其他 Unicode 字符的模糊搜索
        const slashMatch = beforeText.match(/\/([^\s/]*)$/)

        if (slashMatch) {
          const slashOffset = slashMatch.index!
          targetRangeRef.current = {
            anchor: { ...start, offset: slashOffset },
            focus: start,
          }
          setSearch(slashMatch[1])

          // 计算位置（相对于视口，用于 fixed 定位）
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
        } else {
          setVisible(false)
          setSearch('')
          targetRangeRef.current = null
        }
      } catch {
        setVisible(false)
      }
    }

    // 监听编辑器变化
    const originalOnChange = editor.onChange
    editor.onChange = (...args: any[]) => {
      ;(originalOnChange as any)?.(...args)
      checkSlashCommand()
    }

    return () => {
      editor.onChange = originalOnChange
    }
  }, [editor])

  if (!visible || filteredCommands.length === 0) return null

  return createPortal(
    <div
      ref={menuRef}
      className={cn(
        'border-border bg-popover fixed z-9999 max-h-64 w-56 overflow-y-auto rounded-md border p-1 shadow-md',
        'animate-in fade-in-0 slide-in-from-top-2',
        className
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {filteredCommands.map((command, index) => (
        <div
          key={command.key}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 transition-colors',
            index === selectedIndex
              ? 'bg-secondary text-secondary-foreground'
              : 'hover:bg-secondary/50'
          )}
          onClick={() => executeCommand(command)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <Icon
            name={command.icon}
            className='text-muted-foreground h-4 w-4 shrink-0'
          />
          <div className='flex flex-col'>
            <span className='truncate text-sm'>{command.title}</span>
            {command.description && (
              <span className='text-muted-foreground truncate text-xs'>
                {command.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>,
    document.body
  )
}
