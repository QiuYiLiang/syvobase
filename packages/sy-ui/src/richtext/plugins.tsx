import { createPlatePlugin, BlockPlaceholderPlugin } from 'platejs/react'
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  BlockquotePlugin,
  HeadingPlugin,
  HorizontalRulePlugin,
} from '@platejs/basic-nodes/react'
import {
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  TextAlignPlugin,
} from '@platejs/basic-styles/react'
import { CodeBlockPlugin } from '@platejs/code-block/react'
import { LinkPlugin } from '@platejs/link/react'
import {
  ListPlugin as ClassicListPlugin,
  TodoListPlugin,
} from '@platejs/list-classic/react'
import {
  ImagePlugin,
  MediaEmbedPlugin,
  AudioPlugin,
  VideoPlugin,
} from '@platejs/media/react'
import { TablePlugin } from '@platejs/table/react'
import { TogglePlugin } from '@platejs/toggle/react'
import { IndentPlugin } from '@platejs/indent/react'
import { ListPlugin as IndentListPlugin } from '@platejs/list/react'
import { ExitBreakPlugin, KEYS, NodeIdPlugin } from 'platejs'
import { AutoformatPlugin } from '@platejs/autoformat'
import { MarkdownPlugin, remarkMdx, remarkMention } from '@platejs/markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { BlockDraggable } from './components/BlockDraggable'

// 文件附件插件
export const FilePlugin = createPlatePlugin({
  key: 'file',
  node: {
    isElement: true,
    isVoid: true,
  },
})

// 自动格式化规则
const autoformatRules = [
  {
    mode: 'block' as const,
    type: 'h1',
    match: '# ',
  },
  {
    mode: 'block' as const,
    type: 'h2',
    match: '## ',
  },
  {
    mode: 'block' as const,
    type: 'h3',
    match: '### ',
  },
  {
    mode: 'block' as const,
    type: 'blockquote',
    match: '> ',
  },
  {
    mode: 'block' as const,
    type: 'hr',
    match: ['---', '***', '___'],
  },
  {
    mode: 'mark' as const,
    type: ['bold', 'italic'],
    match: '***',
  },
  {
    mode: 'mark' as const,
    type: 'bold',
    match: '**',
  },
  {
    mode: 'mark' as const,
    type: 'italic',
    match: '*',
  },
  {
    mode: 'mark' as const,
    type: 'italic',
    match: '_',
  },
  {
    mode: 'mark' as const,
    type: 'strikethrough',
    match: '~~',
  },
  {
    mode: 'mark' as const,
    type: 'code',
    match: '`',
  },
]

// 段落插件
export const ParagraphPlugin = createPlatePlugin({
  key: 'p',
  node: {
    isElement: true,
  },
})

// 创建所有插件

export const createRichtextPlugins = (placeholder?: string): any[] => [
  // Block Placeholder - 只在选中空块时显示占位符
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        'before:absolute before:cursor-text before:text-muted-foreground/50 before:content-[attr(placeholder)]',
      placeholders: {
        p: placeholder || '请输入...',
      },
      query: ({ path }) => path.length === 1,
    },
  }),

  // 基础节点
  ParagraphPlugin,
  HeadingPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  HorizontalRulePlugin,
  LinkPlugin.configure({
    render: {
      afterEditable: () => null,
    },
  }),
  ClassicListPlugin,
  TodoListPlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  AudioPlugin,
  VideoPlugin,
  FilePlugin,
  TablePlugin,
  TogglePlugin,

  // 标记
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,

  // 字体颜色
  FontColorPlugin,
  FontBackgroundColorPlugin,

  // 字体大小
  FontSizePlugin,

  // 布局
  TextAlignPlugin.configure({
    inject: {
      targetPlugins: ['p', 'h1', 'h2', 'h3'],
    },
  }),
  IndentPlugin.configure({
    inject: {
      targetPlugins: ['p', 'h1', 'h2', 'h3', 'blockquote'],
    },
  }),
  IndentListPlugin.configure({
    inject: {
      targetPlugins: ['p', 'h1', 'h2', 'h3', 'blockquote'],
    },
  }),

  // 节点 ID（拖拽需要）
  NodeIdPlugin,

  // 拖拽 - 使用自定义实现，不依赖 react-dnd
  createPlatePlugin({
    key: 'blockDraggable',
    render: {
      aboveNodes: BlockDraggable,
    },
  }),

  // 行为 - NodeIdPlugin 现在默认启用，SelectOnBackspacePlugin 已内置
  ExitBreakPlugin.configure({
    shortcuts: {
      insert: { keys: 'mod+enter' },
      insertBefore: { keys: 'mod+shift+enter' },
    },
  }),

  // 自动格式化
  AutoformatPlugin.configure({
    options: {
      rules: autoformatRules,
    },
  }),

  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion, KEYS.comment],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
    },
  }),
]

// 初始值

export const createInitialValue = () => [
  {
    id: '1',
    type: 'p',
    children: [{ text: '' }],
  },
]
