import { Plate, PlateContent, usePlateEditor } from 'platejs/react'
import { BaseValueProps, cn } from '@/utils'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { createRichtextPlugins, createInitialValue } from './plugins'
import { serializeMd, deserializeMd } from '@platejs/markdown'
import { serializeHtml, deserializeHtml } from './htmlSerializer'
import { SlateEditor, Value } from 'platejs'
import {
  ParagraphElement,
  HeadingElement,
  BlockquoteElement,
  CodeBlockElement,
  CodeLineElement,
  HorizontalRuleElement,
  LinkElement,
  OrderedListElement,
  UnorderedListElement,
  ListItemElement,
  TodoListElement,
  ImageElement,
  VideoElement,
  AudioElement,
  FileElement,
  TableElement,
  TableRowElement,
  TableCellElement,
  ToggleElement,
  BoldLeaf,
  ItalicLeaf,
  UnderlineLeaf,
  StrikethroughLeaf,
  CodeLeaf,
  ColorLeaf,
  BackgroundColorLeaf,
  RichtextToolbar,
  FloatingToolbar,
  SlashMenu,
  LinkFloatingToolbar,
  TableMenu,
  Outline,
} from './components'
import { mergeTag } from '@/utils/tag'

/** 值类型 */
export type RichtextValueType = 'json' | 'html' | 'markdown'

export interface RichtextProps extends BaseValueProps<string> {
  /** 值的类型，默认为 json */
  valueType?: RichtextValueType
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 是否只读 */
  readMode?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 最小高度 */
  minHeight?: number | string
  /** 最大高度 */
  maxHeight?: number | string
  /** 是否自动聚焦 */
  autoFocus?: boolean
  /** 是否开启边框 */
  border?: boolean
  /** 是否显示大纲 */
  showOutline?: boolean
  /** 大纲最大标题级别，默认 3 (显示 h1-h3) */
  outlineMaxLevel?: number
}

// 序列化为指定格式的字符串
const serializeValue = (
  value: Value,
  valueType: RichtextValueType,
  editor: SlateEditor
): string => {
  try {
    switch (valueType) {
      case 'markdown':
        return serializeMd(editor, { value })
      case 'html':
        return serializeHtml(value)
      case 'json':
      default:
        return JSON.stringify(value)
    }
  } catch {
    return ''
  }
}

// 反序列化 JSON 字符串（用于初始化）
const deserializeJsonValue = (str: string | undefined): Value => {
  if (!str) return createInitialValue()
  try {
    const parsed = JSON.parse(str)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return createInitialValue()
  } catch {
    // 如果不是 JSON，则作为纯文本处理
    if (str.trim()) {
      return [
        {
          type: 'p',
          children: [{ text: str }],
        },
      ]
    }
    return createInitialValue()
  }
}

// 反序列化指定格式的字符串（需要 editor 实例）
const deserializeValue = (
  str: string | undefined,
  valueType: RichtextValueType,
  editor: SlateEditor
): Value => {
  if (!str) return createInitialValue()
  try {
    switch (valueType) {
      case 'markdown':
        return deserializeMd(editor, str)
      case 'html':
        return deserializeHtml(str)
      case 'json':
      default:
        return deserializeJsonValue(str)
    }
  } catch {
    // 如果解析失败，则作为纯文本处理
    if (str.trim()) {
      return [
        {
          type: 'p',
          children: [{ text: str }],
        },
      ]
    }
    return createInitialValue()
  }
}

export const Richtext = (props: RichtextProps) => {
  const {
    className,
    style,
    value,
    defaultValue,
    onChange,
    valueType = 'json',
    showToolbar = true,
    readMode: _readMode = false,
    disabled = false,
    placeholder = '',
    minHeight = 200,
    maxHeight,
    autoFocus = false,
    border = false,
    showOutline = true,
    outlineMaxLevel = 3,
  } = props

  const readMode = _readMode || disabled

  // 是否有标题（用于控制大纲显示时的边距）
  const [hasHeadings, setHasHeadings] = useState(false)
  const handleHasHeadingsChange = (value: boolean) => {
    setHasHeadings(value)
  }

  const plugins = createRichtextPlugins(placeholder)

  // 存储初始值和是否需要延迟反序列化
  const initialStrRef = useRef(value ?? defaultValue)
  const initializedRef = useRef(false)
  // 只有 markdown 需要 editor 实例来反序列化
  const needsInitialDeserialize =
    valueType === 'markdown' && initialStrRef.current

  // 对于 json 和 html 类型，可以直接解析初始值
  // 对于 markdown 类型，需要在 editor 创建后处理
  const initialValue = useMemo(() => {
    if (valueType === 'json') {
      return deserializeJsonValue(initialStrRef.current)
    }
    if (valueType === 'html') {
      return deserializeHtml(initialStrRef.current || '')
    }
    // markdown 需要 editor 实例，先用空值初始化
    return createInitialValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 只在初始化时执行一次

  const editor = usePlateEditor({
    plugins,
    value: () => initialValue,
    override: {
      components: {
        // 块元素
        p: ParagraphElement,
        h1: HeadingElement,
        h2: HeadingElement,
        h3: HeadingElement,
        h4: HeadingElement,
        h5: HeadingElement,
        h6: HeadingElement,
        blockquote: BlockquoteElement,
        code_block: CodeBlockElement,
        code_line: CodeLineElement,
        hr: HorizontalRuleElement,
        a: LinkElement,
        ul: UnorderedListElement,
        ol: OrderedListElement,
        li: ListItemElement,
        action_item: TodoListElement,
        img: ImageElement,
        video: VideoElement,
        audio: AudioElement,
        file: FileElement,
        table: TableElement,
        tr: TableRowElement,
        td: TableCellElement,
        th: TableCellElement,
        toggle: ToggleElement,

        // 标记
        bold: BoldLeaf,
        italic: ItalicLeaf,
        underline: UnderlineLeaf,
        strikethrough: StrikethroughLeaf,
        code: CodeLeaf,
        color: ColorLeaf,
        backgroundColor: BackgroundColorLeaf,
      },
    },
  })

  const handleChange = useCallback(
    ({ value: editorValue }: { value: Value }) => {
      const serialized = serializeValue(editorValue, valueType, editor)
      onChange?.(serialized)
    },
    [valueType, editor, onChange]
  )

  // 处理 markdown/html 类型的初始值反序列化
  useEffect(() => {
    if (
      !initializedRef.current &&
      needsInitialDeserialize &&
      initialStrRef.current
    ) {
      const newValue = deserializeValue(
        initialStrRef.current,
        valueType,
        editor
      )
      editor.tf.setValue(newValue)
      initializedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]) // 只在 editor 创建后执行一次

  // 存储上一次的值，避免不必要的更新
  const prevValueRef = useRef(value)

  // 同步外部值变化
  useEffect(() => {
    // 跳过初始化阶段的同步（由上面的 useEffect 处理）
    if (!initializedRef.current && valueType === 'markdown') {
      return
    }
    // 只有当外部值真正变化时才同步
    if (value !== undefined && value !== prevValueRef.current) {
      prevValueRef.current = value
      const newValue = deserializeValue(value, valueType, editor)
      const currentValue = serializeValue(
        editor.children as Value,
        valueType,
        editor
      )
      if (value !== currentValue) {
        editor.tf.setValue(newValue)
      }
    }
  }, [value, valueType, editor])

  return (
    <div
      {...mergeTag('richtext', props)}
      className={cn(
        'relative h-full w-full',
        border &&
          !readMode &&
          'border-border overflow-hidden rounded-lg border',
        className
      )}
      style={style}
    >
      <Plate editor={editor} onChange={handleChange}>
        <div className='bg-background relative flex h-full w-full flex-col'>
          {/* 工具栏 - 全宽 */}
          {showToolbar && !readMode && <RichtextToolbar />}

          {/* 内容区域 - 画布 + 大纲 */}
          <div className='relative min-h-0 flex-1'>
            {/* 主编辑区域 */}
            <div
              className='flex h-full w-full cursor-text flex-col overflow-auto'
              data-richtext-scroll-container
              style={{
                maxHeight:
                  maxHeight &&
                  (typeof maxHeight === 'number'
                    ? `${maxHeight}px`
                    : maxHeight),
              }}
            >
              <TableMenu>
                <PlateContent
                  className={cn(
                    'w-full flex-1 outline-none',
                    !readMode && 'pl-16',
                    readMode && 'pl-2',
                    showOutline && hasHeadings ? 'pr-62' : 'pr-2',
                    'prose prose-sm dark:prose-invert',
                    '[&_*::selection]:bg-primary/20',
                    readMode && 'cursor-default'
                  )}
                  style={{
                    minHeight:
                      typeof minHeight === 'number'
                        ? `${minHeight}px`
                        : minHeight,
                  }}
                  readOnly={readMode}
                  autoFocus={autoFocus}
                />
              </TableMenu>

              {!readMode && (
                <>
                  <FloatingToolbar />
                  <SlashMenu />
                  <LinkFloatingToolbar />
                </>
              )}
            </div>

            {/* 右侧大纲 - 悬浮在画布之上 */}
            {showOutline && (
              <Outline
                className='absolute top-4 right-4'
                maxLevel={outlineMaxLevel}
                onHasHeadingsChange={handleHasHeadingsChange}
              />
            )}
          </div>
        </div>
      </Plate>
    </div>
  )
}
