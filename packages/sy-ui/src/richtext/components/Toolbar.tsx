import {
  useEditorRef,
  useEditorSelection,
  useEditorSelector,
} from 'platejs/react'
import { Button } from '@/button'
import { Popover } from '@/popover'
import { Icon, IconName } from '@/icon'
import { Toolbar, ToolbarItem } from '@/toolbar'
import { cn } from '@/utils'
import { $t } from '@/utils/i18n'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Range, Editor } from 'slate'
import { DropdownMenuType } from '@/dropdown'
import { KEYS } from 'platejs'
import { triggerLinkInsert } from './linkInsertEvent'
import { ToolbarKey } from './commands'
import { ColorPicker } from '@/colorPicker'
import { confirm } from '@/confirm'

// 字体大小
const FONT_SIZES = [
  '8',
  '9',
  '10',
  '12',
  '14',
  '16',
  '18',
  '24',
  '30',
  '36',
  '48',
  '60',
  '72',
  '96',
]
const FONT_SIZE_MAP: Record<string, string> = { h1: '36', h2: '24', h3: '20' }
const toUnitLess = (s: string) => s.replace(/px|pt|em|rem/gi, '')

const useFontSize = () => {
  const editor = useEditorRef()
  const fontSize = useEditorSelector((ed) => {
    const mark = (Editor.marks(ed as any) as any)?.[KEYS.fontSize]
    if (mark) return toUnitLess(mark)
    const [b] = Editor.nodes(ed as any, { match: (n) => 'type' in n }) || []
    const t = (b?.[0] as any)?.type
    return t && t in FONT_SIZE_MAP ? FONT_SIZE_MAP[t] : '16'
  }, [])
  const apply = (s: string) =>
    editor.selection && editor.tf.addMark(KEYS.fontSize, `${s}px`)
  const change = (d: number) =>
    apply(String(Math.max(1, Math.min(400, (parseInt(fontSize) || 16) + d))))
  return { fontSize, apply, change }
}

const FontSizeButton = () => {
  const { fontSize, apply, change } = useFontSize()
  const [input, setInput] = useState('')
  const [editing, setEditing] = useState(false)

  const inputEl = (
    <Popover
      content={
        <div className='grid grid-cols-4 gap-1 p-1'>
          {FONT_SIZES.map((s) => (
            <button
              key={s}
              className={cn(
                'hover:bg-accent rounded-lg px-2 py-1 text-sm',
                s === fontSize && 'bg-accent'
              )}
              onClick={() => {
                apply(s)
                setEditing(false)
              }}
              type='button'
            >
              {s}
            </button>
          ))}
        </div>
      }
      trigger='click'
      direction='bottom'
    >
      <input
        className='hover:bg-muted h-6 w-8 rounded-lg bg-transparent text-center text-sm outline-none'
        value={editing ? input : fontSize}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => {
          setEditing(true)
          setInput(fontSize)
        }}
        onBlur={() => {
          setEditing(false)
          const n = parseInt(input)
          if (n > 0 && n <= 400) apply(String(n))
        }}
        onKeyDown={(e) =>
          e.key === 'Enter' && (e.target as HTMLInputElement).blur()
        }
      />
    </Popover>
  )

  return (
    <Toolbar
      inlineMode
      emptySpacing
      items={[
        { icon: 'Minus', onClick: () => change(-1) },
        inputEl,
        { icon: 'Plus', onClick: () => change(1) },
      ]}
    />
  )
}

// 颜色按钮
const ColorButton = ({
  markKey,
  iconName,
  defaultColor,
}: {
  markKey: string
  iconName: IconName
  defaultColor: string
}) => {
  const editor = useEditorRef()
  const current = useEditorSelector(
    (ed) => (Editor.marks(ed as any) as any)?.[markKey] as string | undefined,
    [markKey]
  )

  return (
    <ColorPicker
      value={current || ''}
      onChange={(c) => {
        if (editor.selection) {
          if (!c || c === 'rgba(0,0,0,0)' || c === 'transparent') {
            editor.tf.removeMark(markKey)
          } else {
            editor.tf.addMark(markKey, c)
          }
        }
      }}
    >
      <Button type='ghost' size='sm' className='h-8 w-8 p-0'>
        <div className='flex flex-col items-center'>
          <Icon name={iconName} className='h-4 w-4' />
          <div
            className='mt-0.5 h-1 w-4 rounded-sm'
            style={{ backgroundColor: current || defaultColor }}
          />
        </div>
      </Button>
    </ColorPicker>
  )
}

const Sep = <div className='bg-border mx-1 h-5 w-px' />

// 共享的工具栏逻辑 Hook
const useToolbarState = () => {
  const editor = useEditorRef()

  // 使用 useEditorSelector 订阅状态，实时更新
  const activeMarksStr = useEditorSelector((ed) => {
    try {
      const marks = Editor.marks(ed as any) as any
      return JSON.stringify({
        bold: !!marks?.bold,
        italic: !!marks?.italic,
        underline: !!marks?.underline,
        strikethrough: !!marks?.strikethrough,
        code: !!marks?.code,
      })
    } catch {
      return '{}'
    }
  }, [])
  const activeMarks = JSON.parse(activeMarksStr || '{}')

  const activeBlocksStr = useEditorSelector((ed) => {
    try {
      const check = (t: string) =>
        !!Editor.nodes(ed as any, {
          match: (n) => (n as any).type === t,
        }).next().value
      return JSON.stringify({
        blockquote: check('blockquote'),
        h1: check('h1'),
        h2: check('h2'),
        h3: check('h3'),
        h4: check('h4'),
        h5: check('h5'),
        h6: check('h6'),
        ul: check('ul'),
        ol: check('ol'),
        todo: check('action_item') || check('todo_li'),
      })
    } catch {
      return '{}'
    }
  }, [])
  const activeBlocks = JSON.parse(activeBlocksStr || '{}')

  // 获取当前对齐状态
  const align = useEditorSelector((ed) => {
    const [b] = Editor.nodes(ed as any, { match: (n) => 'align' in n }) || []
    return (b?.[0] as any)?.align || 'left'
  }, [])

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
        // 尝试从编辑器获取选区的 DOM 范围
        const domRange = (editor as any).toDOMRange?.(editor.selection)
        if (domRange) {
          const rect = domRange.getBoundingClientRect()
          position = {
            top: rect.bottom + 4,
            left: rect.left,
          }
        } else {
          // fallback 到 window.getSelection
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

      // 触发浮动工具栏的插入模式
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

  const alignIcon =
    align === 'center'
      ? 'TextAlignCenter'
      : align === 'right'
        ? 'TextAlignEnd'
        : align === 'justify'
          ? 'TextAlignJustify'
          : 'TextAlignStart'

  const alignMenu: DropdownMenuType = [
    {
      icon: 'TextAlignStart',
      name: $t('richtext.alignLeft'),
      onClick: () => editor.tf.setNodes({ align: 'left' } as any),
    },
    {
      icon: 'TextAlignCenter',
      name: $t('richtext.alignCenter'),
      onClick: () => editor.tf.setNodes({ align: 'center' } as any),
    },
    {
      icon: 'TextAlignEnd',
      name: $t('richtext.alignRight'),
      onClick: () => editor.tf.setNodes({ align: 'right' } as any),
    },
    {
      icon: 'TextAlignJustify',
      name: $t('richtext.alignJustify'),
      onClick: () => editor.tf.setNodes({ align: 'justify' } as any),
    },
  ]

  const headingIcon = activeBlocks.h1
    ? 'Heading1'
    : activeBlocks.h2
      ? 'Heading2'
      : activeBlocks.h3
        ? 'Heading3'
        : activeBlocks.h4
          ? 'Heading4'
          : activeBlocks.h5
            ? 'Heading5'
            : activeBlocks.h6
              ? 'Heading6'
              : 'Heading'

  const headingMenu: DropdownMenuType = [
    {
      icon: 'Pilcrow',
      name: $t('richtext.paragraph'),
      onClick: () => editor.tf.toggleBlock('p'),
    },
    { type: 'separator' },
    {
      icon: 'Heading1',
      name: $t('richtext.h1'),
      onClick: () => editor.tf.toggleBlock('h1'),
    },
    {
      icon: 'Heading2',
      name: $t('richtext.h2'),
      onClick: () => editor.tf.toggleBlock('h2'),
    },
    {
      icon: 'Heading3',
      name: $t('richtext.h3'),
      onClick: () => editor.tf.toggleBlock('h3'),
    },
    {
      icon: 'Heading4',
      name: $t('richtext.h4'),
      onClick: () => editor.tf.toggleBlock('h4'),
    },
    {
      icon: 'Heading5',
      name: $t('richtext.h5'),
      onClick: () => editor.tf.toggleBlock('h5'),
    },
    {
      icon: 'Heading6',
      name: $t('richtext.h6'),
      onClick: () => editor.tf.toggleBlock('h6'),
    },
  ]

  const marks: ToolbarItem[] = [
    {
      icon: 'Bold',
      type: activeMarks.bold ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('bold'),
    },
    {
      icon: 'Italic',
      type: activeMarks.italic ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('italic'),
    },
    {
      icon: 'Underline',
      type: activeMarks.underline ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('underline'),
    },
    {
      icon: 'Strikethrough',
      type: activeMarks.strikethrough ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('strikethrough'),
    },
    {
      icon: 'Code',
      type: activeMarks.code ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('code'),
    },
  ]

  const blocks: ToolbarItem[] = [
    {
      icon: 'Quote',
      type: activeBlocks.blockquote ? 'secondary' : 'ghost',
      onClick: () => handleBlock('blockquote'),
    },
    { icon: 'CodeXml', onClick: () => handleBlock('code_block') },
    { icon: 'Minus', onClick: () => handleBlock('hr') },
    { icon: 'Table', onClick: () => handleBlock('table') },
    { icon: 'Link', onClick: () => handleBlock('link') },
    { icon: 'Image', onClick: () => handleBlock('img') },
  ]

  const lists: ToolbarItem[] = [
    {
      icon: 'ListOrdered',
      type: activeBlocks.ol ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleBlock('ol'),
    },
    {
      icon: 'List',
      type: activeBlocks.ul ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleBlock('ul'),
    },
    {
      icon: 'ListTodo',
      type: activeBlocks.todo ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleBlock('action_item'),
    },
  ]

  return {
    editor,
    activeMarks,
    activeBlocks,
    align,
    alignIcon,
    alignMenu,
    headingIcon,
    headingMenu,
    marks,
    blocks,
    lists,
    handleBlock,
  }
}

// 默认显示所有按钮
const ALL_KEYS: ToolbarKey[] = [
  'heading',
  'fontSize',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'color',
  'backgroundColor',
  'blockquote',
  'codeBlock',
  'hr',
  'table',
  'link',
  'image',
  'video',
  'audio',
  'file',
  'align',
  'orderedList',
  'unorderedList',
  'todoList',
  'undo',
  'redo',
]

// 浮动工具栏默认显示的按钮
const FLOATING_KEYS: ToolbarKey[] = [
  'heading',
  'fontSize',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'color',
  'backgroundColor',
  'blockquote',
  'link',
]

// 统一工具栏组件
export interface UnifiedToolbarProps {
  /** 要显示的按钮 keys */
  keys?: ToolbarKey[]
}

export const UnifiedToolbar = ({ keys = ALL_KEYS }: UnifiedToolbarProps) => {
  const {
    editor,
    activeMarks,
    activeBlocks,
    alignIcon,
    alignMenu,
    headingIcon,
    headingMenu,
    handleBlock,
  } = useToolbarState()

  const keySet = new Set(keys)

  const items: (ToolbarItem | React.ReactElement)[] = []

  // 标题
  if (keySet.has('heading')) {
    items.push({
      icon: headingIcon,
      name: $t('richtext.heading'),
      items: headingMenu,
      dropdownTrigger: 'click',
    })
  }

  // 字体大小
  if (keySet.has('fontSize')) {
    items.push(<FontSizeButton key='fs' />)
  }

  // 分隔符 - 标题/字体大小后
  if (
    (keySet.has('heading') || keySet.has('fontSize')) &&
    (keySet.has('bold') ||
      keySet.has('italic') ||
      keySet.has('underline') ||
      keySet.has('strikethrough') ||
      keySet.has('code'))
  ) {
    items.push(Sep)
  }

  // 文本格式标记
  if (keySet.has('bold')) {
    items.push({
      icon: 'Bold',
      type: activeMarks.bold ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('bold'),
    })
  }
  if (keySet.has('italic')) {
    items.push({
      icon: 'Italic',
      type: activeMarks.italic ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('italic'),
    })
  }
  if (keySet.has('underline')) {
    items.push({
      icon: 'Underline',
      type: activeMarks.underline ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('underline'),
    })
  }
  if (keySet.has('strikethrough')) {
    items.push({
      icon: 'Strikethrough',
      type: activeMarks.strikethrough ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('strikethrough'),
    })
  }
  if (keySet.has('code')) {
    items.push({
      icon: 'Code',
      type: activeMarks.code ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleMark('code'),
    })
  }

  // 颜色
  if (keySet.has('color')) {
    items.push(
      <ColorButton
        key='fc'
        markKey='color'
        iconName='Baseline'
        defaultColor='#000000'
      />
    )
  }
  if (keySet.has('backgroundColor')) {
    items.push(
      <ColorButton
        key='bc'
        markKey='backgroundColor'
        iconName='PaintBucket'
        defaultColor='#FEFF00'
      />
    )
  }

  // 分隔符 - 颜色后
  const hasColorOrMark =
    keySet.has('color') ||
    keySet.has('backgroundColor') ||
    keySet.has('bold') ||
    keySet.has('italic') ||
    keySet.has('underline') ||
    keySet.has('strikethrough') ||
    keySet.has('code')
  const hasBlock =
    keySet.has('blockquote') ||
    keySet.has('codeBlock') ||
    keySet.has('hr') ||
    keySet.has('table') ||
    keySet.has('link') ||
    keySet.has('image') ||
    keySet.has('video') ||
    keySet.has('audio') ||
    keySet.has('file')
  if (hasColorOrMark && hasBlock) {
    items.push(Sep)
  }

  // 块元素
  if (keySet.has('blockquote')) {
    items.push({
      icon: 'Quote',
      type: activeBlocks.blockquote ? 'secondary' : 'ghost',
      onClick: () => handleBlock('blockquote'),
    })
  }
  if (keySet.has('codeBlock')) {
    items.push({ icon: 'CodeXml', onClick: () => handleBlock('code_block') })
  }
  if (keySet.has('hr')) {
    items.push({ icon: 'Minus', onClick: () => handleBlock('hr') })
  }
  if (keySet.has('table')) {
    items.push({ icon: 'Table', onClick: () => handleBlock('table') })
  }
  if (keySet.has('link')) {
    items.push({ icon: 'Link', onClick: () => handleBlock('link') })
  }

  // 分隔符 - 链接和媒体之间
  const hasMedia =
    keySet.has('image') ||
    keySet.has('video') ||
    keySet.has('audio') ||
    keySet.has('file')
  if (keySet.has('link') && hasMedia) {
    items.push(Sep)
  }

  if (keySet.has('image')) {
    items.push({
      icon: 'Image',
      items: [
        {
          icon: 'Upload',
          name: $t('richtext.localUpload'),
          onClick: () => handleBlock('img'),
        },
        {
          icon: 'Link',
          name: $t('richtext.insertUrl'),
          onClick: () => handleBlock('img_url'),
        },
      ],
      disabledDropdownIcon: true,
      dropdownTrigger: 'click',
    })
  }
  if (keySet.has('video')) {
    items.push({
      icon: 'Film',
      items: [
        {
          icon: 'Upload',
          name: $t('richtext.localUpload'),
          onClick: () => handleBlock('video'),
        },
        {
          icon: 'Link',
          name: $t('richtext.insertUrl'),
          onClick: () => handleBlock('video_url'),
        },
      ],
      disabledDropdownIcon: true,
      dropdownTrigger: 'click',
    })
  }
  if (keySet.has('audio')) {
    items.push({
      icon: 'AudioLines',
      items: [
        {
          icon: 'Upload',
          name: $t('richtext.localUpload'),
          onClick: () => handleBlock('audio'),
        },
        {
          icon: 'Link',
          name: $t('richtext.insertUrl'),
          onClick: () => handleBlock('audio_url'),
        },
      ],
      disabledDropdownIcon: true,
      dropdownTrigger: 'click',
    })
  }
  if (keySet.has('file')) {
    items.push({
      icon: 'FileUp',
      items: [
        {
          icon: 'Upload',
          name: $t('richtext.localUpload'),
          onClick: () => handleBlock('file'),
        },
        {
          icon: 'Link',
          name: $t('richtext.insertUrl'),
          onClick: () => handleBlock('file_url'),
        },
      ],
      disabledDropdownIcon: true,
      dropdownTrigger: 'click',
    })
  }

  // 分隔符 - 块元素后
  const hasAlign = keySet.has('align')
  const hasList =
    keySet.has('orderedList') ||
    keySet.has('unorderedList') ||
    keySet.has('todoList')
  if (hasBlock && (hasAlign || hasList)) {
    items.push(Sep)
  }

  // 对齐
  if (keySet.has('align')) {
    items.push({
      icon: alignIcon,
      items: alignMenu,
      disabledDropdownIcon: true,
      dropdownTrigger: 'click',
      dropdownProps: {
        disabledIcon: false,
      },
    })
  }

  // 列表
  if (keySet.has('orderedList')) {
    items.push({
      icon: 'ListOrdered',
      type: activeBlocks.ol ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleBlock('ol'),
    })
  }
  if (keySet.has('unorderedList')) {
    items.push({
      icon: 'List',
      type: activeBlocks.ul ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleBlock('ul'),
    })
  }
  if (keySet.has('todoList')) {
    items.push({
      icon: 'ListTodo',
      type: activeBlocks.todo ? 'secondary' : 'ghost',
      onClick: () => editor.tf.toggleBlock('action_item'),
    })
  }

  // 分隔符 - 列表后
  const hasUndoRedo = keySet.has('undo') || keySet.has('redo')
  if ((hasAlign || hasList) && hasUndoRedo) {
    items.push(Sep)
  }

  // 撤销重做
  if (keySet.has('undo')) {
    items.push({ icon: 'Undo', onClick: () => editor.undo() })
  }
  if (keySet.has('redo')) {
    items.push({ icon: 'Redo', onClick: () => editor.redo() })
  }

  return <Toolbar className='[&>.flex]:flex-wrap' inlineMode left={items} />
}

// 固定工具栏
export interface RichtextToolbarProps {
  className?: string
  keys?: ToolbarKey[]
}

export const RichtextToolbar = ({ className, keys }: RichtextToolbarProps) => {
  return (
    <div
      className={cn(
        'border-border bg-background/95 supports-backdrop-blur:bg-background/60 sticky top-0 z-50 flex-wrap overflow-x-auto rounded-t-lg border-b p-1 backdrop-blur-sm',
        className
      )}
    >
      <UnifiedToolbar keys={keys} />
    </div>
  )
}

// 浮动工具栏
export interface FloatingToolbarProps {
  className?: string
  keys?: ToolbarKey[]
}

export const FloatingToolbar = ({
  className,
  keys = FLOATING_KEYS,
}: FloatingToolbarProps) => {
  const selection = useEditorSelection()
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const updatePos = () => {
    if (!selection || Range.isCollapsed(selection)) {
      setVisible(false)
      return
    }
    try {
      const sel = window.getSelection()
      if (!sel?.rangeCount) {
        setVisible(false)
        return
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect()
      if (!rect.width) {
        setVisible(false)
        return
      }
      // 放在选区下方，左对齐
      setPos({ top: rect.bottom + 8, left: rect.left })
      setVisible(true)
    } catch {
      setVisible(false)
    }
  }

  useEffect(() => {
    updatePos()
  }, [updatePos])

  if (!visible) return null

  return createPortal(
    <div
      className={cn(
        'border-border bg-popover animate-in fade-in-0 zoom-in-95 fixed z-9999 rounded-lg border p-1 shadow-lg',
        className
      )}
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <UnifiedToolbar keys={keys} />
    </div>,
    document.body
  )
}
