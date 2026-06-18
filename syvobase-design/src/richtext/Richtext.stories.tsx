import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Richtext } from './Richtext'

const meta = {
  title: 'Input/Richtext',
  component: Richtext,
  args: {},
  argTypes: {
    valueType: {
      control: 'select',
      options: ['json', 'html', 'markdown'],
      description: '值的类型',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Richtext>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
        <details className='mt-4'>
          <summary className='text-muted-foreground cursor-pointer text-sm'>
            查看 JSON 输出
          </summary>
          <pre className='bg-muted mt-2 overflow-auto rounded-lg p-4 text-xs'>
            {value || '(空)'}
          </pre>
        </details>
      </div>
    )
  },
}

export const WithInitialContent: Story = {
  render(args) {
    const initialContent = JSON.stringify([
      {
        type: 'h1',
        children: [{ text: '欢迎使用富文本编辑器' }],
      },
      {
        type: 'p',
        children: [
          { text: '这是一个基于 ' },
          { text: 'Plate', bold: true },
          { text: ' 框架的富文本编辑器，具有类似 ' },
          { text: 'Notion', italic: true },
          { text: ' 的编辑体验。' },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '主要特性' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: '丰富的文本格式支持' }],
          },
          {
            type: 'li',
            children: [{ text: '斜杠命令快速插入' }],
          },
          {
            type: 'li',
            children: [{ text: 'Markdown 快捷输入' }],
          },
        ],
      },
      {
        type: 'blockquote',
        children: [{ text: '引用块可以用来强调重要内容。' }],
      },
      {
        type: 'p',
        children: [
          { text: '你可以使用 ' },
          { text: '`code`', code: true },
          { text: ' 来标记代码。' },
        ],
      },
    ])

    const [value, setValue] = useState(initialContent)
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const ReadMode: Story = {
  args: {
    readMode: true,
    showToolbar: false,
  },
  render(args) {
    const content = JSON.stringify([
      {
        type: 'h1',
        children: [{ text: '只读模式' }],
      },
      {
        type: 'p',
        children: [{ text: '这是一段只读的内容，用户无法编辑。' }],
      },
    ])
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={content} />
      </div>
    )
  },
}

export const NoToolbar: Story = {
  args: {
    showToolbar: false,
    placeholder: '开始输入...',
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const CustomHeight: Story = {
  args: {
    minHeight: 100,
    maxHeight: 300,
    placeholder: '固定高度范围的编辑器...',
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: '请在这里输入您的内容...',
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const AutoFocus: Story = {
  args: {
    autoFocus: true,
    placeholder: '自动聚焦，可以直接开始输入...',
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithTableContent: Story = {
  render(args) {
    const tableContent = JSON.stringify([
      {
        type: 'h2',
        children: [{ text: '表格示例' }],
      },
      {
        type: 'p',
        children: [{ text: '下面是一个表格：' }],
      },
      {
        type: 'table',
        children: [
          {
            type: 'tr',
            children: [
              { type: 'th', children: [{ text: '功能' }] },
              { type: 'th', children: [{ text: '描述' }] },
              { type: 'th', children: [{ text: '状态' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: '粗体' }] },
              { type: 'td', children: [{ text: '使用 **text** 或工具栏' }] },
              { type: 'td', children: [{ text: '✅ 支持' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: '斜体' }] },
              { type: 'td', children: [{ text: '使用 *text* 或工具栏' }] },
              { type: 'td', children: [{ text: '✅ 支持' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: '代码块' }] },
              { type: 'td', children: [{ text: '使用 ``` 或斜杠命令' }] },
              { type: 'td', children: [{ text: '✅ 支持' }] },
            ],
          },
        ],
      },
    ])

    const [value, setValue] = useState(tableContent)
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithCodeBlock: Story = {
  render(args) {
    const codeContent = JSON.stringify([
      {
        type: 'h2',
        children: [{ text: '代码块示例' }],
      },
      {
        type: 'p',
        children: [{ text: '以下是一段 JavaScript 代码：' }],
      },
      {
        type: 'code_block',
        children: [
          {
            type: 'code_line',
            children: [{ text: 'function greet(name) {' }],
          },
          {
            type: 'code_line',
            children: [{ text: '  return `Hello, ${name}!`;' }],
          },
          {
            type: 'code_line',
            children: [{ text: '}' }],
          },
          {
            type: 'code_line',
            children: [{ text: '' }],
          },
          {
            type: 'code_line',
            children: [{ text: 'console.log(greet("World"));' }],
          },
        ],
      },
      {
        type: 'p',
        children: [
          { text: '你也可以使用内联代码：' },
          { text: 'const x = 42', code: true },
        ],
      },
    ])

    const [value, setValue] = useState(codeContent)
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithTodoList: Story = {
  render(args) {
    const todoContent = JSON.stringify([
      {
        type: 'h2',
        children: [{ text: '待办事项' }],
      },
      {
        type: 'action_item',
        checked: true,
        children: [{ text: '完成富文本编辑器基础功能' }],
      },
      {
        type: 'action_item',
        checked: true,
        children: [{ text: '添加 Markdown 快捷输入支持' }],
      },
      {
        type: 'action_item',
        checked: false,
        children: [{ text: '实现图片上传功能' }],
      },
      {
        type: 'action_item',
        checked: false,
        children: [{ text: '添加协同编辑支持' }],
      },
      {
        type: 'action_item',
        checked: false,
        children: [{ text: '优化移动端体验' }],
      },
    ])

    const [value, setValue] = useState(todoContent)
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithMixedContent: Story = {
  render(args) {
    const mixedContent = JSON.stringify([
      {
        type: 'h1',
        children: [{ text: '📝 产品设计文档' }],
      },
      {
        type: 'p',
        children: [
          { text: '版本: ' },
          { text: 'v1.0.0', bold: true },
          { text: ' | 更新日期: 2024-01-15' },
        ],
      },
      {
        type: 'hr',
        children: [{ text: '' }],
      },
      {
        type: 'h2',
        children: [{ text: '1. 概述' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '本文档描述了富文本编辑器的设计规范和实现细节。该编辑器基于 ',
          },
          { text: 'Plate', bold: true, italic: true },
          { text: ' 框架构建，提供了类似 ' },
          { text: 'Notion', italic: true },
          { text: ' 的编辑体验。' },
        ],
      },
      {
        type: 'blockquote',
        children: [
          {
            text: '💡 提示：使用斜杠命令 "/" 可以快速插入各种内容块。',
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '2. 功能特性' }],
      },
      {
        type: 'h3',
        children: [{ text: '2.1 文本格式' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { text: '粗体', bold: true },
              { text: '、' },
              { text: '斜体', italic: true },
              { text: '、' },
              { text: '下划线', underline: true },
            ],
          },
          {
            type: 'li',
            children: [
              { text: '删除线', strikethrough: true },
              { text: '、' },
              { text: '内联代码', code: true },
            ],
          },
          {
            type: 'li',
            children: [{ text: '自定义文字颜色和背景色' }],
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '2.2 内容块' }],
      },
      {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [{ text: '标题（H1-H6）' }],
          },
          {
            type: 'li',
            children: [{ text: '引用块' }],
          },
          {
            type: 'li',
            children: [{ text: '代码块' }],
          },
          {
            type: 'li',
            children: [{ text: '表格' }],
          },
          {
            type: 'li',
            children: [{ text: '待办事项' }],
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '3. 快捷键' }],
      },
      {
        type: 'table',
        children: [
          {
            type: 'tr',
            children: [
              { type: 'th', children: [{ text: '快捷键' }] },
              { type: 'th', children: [{ text: '功能' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: 'Ctrl/Cmd + B' }] },
              { type: 'td', children: [{ text: '粗体' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: 'Ctrl/Cmd + I' }] },
              { type: 'td', children: [{ text: '斜体' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: 'Ctrl/Cmd + U' }] },
              { type: 'td', children: [{ text: '下划线' }] },
            ],
          },
          {
            type: 'tr',
            children: [
              { type: 'td', children: [{ text: '/' }] },
              { type: 'td', children: [{ text: '打开斜杠菜单' }] },
            ],
          },
        ],
      },
    ])

    const [value, setValue] = useState(mixedContent)
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const CompactMode: Story = {
  args: {
    minHeight: 80,
    maxHeight: 150,
    showToolbar: false,
    placeholder: '简短回复...',
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-md'>
        <div className='text-muted-foreground mb-2 text-sm'>
          紧凑模式 - 适合评论、回复等场景
        </div>
        <div className='overflow-auto rounded-lg border'>
          <Richtext {...args} value={value} onChange={setValue} />
        </div>
      </div>
    )
  },
}

export const FullPageEditor: Story = {
  args: {
    minHeight: 500,
    placeholder: '开始撰写您的文章...',
    autoFocus: true,
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <div className='mb-4 flex items-center justify-between'>
          <input
            type='text'
            placeholder='文章标题'
            className='border-none text-3xl font-bold outline-none placeholder:text-gray-300'
          />
          <button className='bg-primary text-primary-foreground rounded-lg px-4 py-2'>
            发布
          </button>
        </div>
        <Richtext {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const ControlledValue: Story = {
  render(args) {
    const [value, setValue] = useState('')
    const [history, setHistory] = useState<string[]>([])

    const handleChange = (newValue: string) => {
      setValue(newValue)
      // 记录变更历史（最多保留5条）
      setHistory((prev) => [...prev.slice(-4), newValue])
    }

    const handleClear = () => {
      setValue('')
      setHistory([])
    }

    const handleSetSample = () => {
      const sample = JSON.stringify([
        { type: 'p', children: [{ text: '这是通过代码设置的内容' }] },
      ])
      setValue(sample)
    }

    return (
      <div className='mx-auto w-full max-w-4xl'>
        <div className='mb-4 flex gap-2'>
          <button
            onClick={handleClear}
            className='rounded border px-3 py-1 text-sm'
          >
            清空
          </button>
          <button
            onClick={handleSetSample}
            className='rounded border px-3 py-1 text-sm'
          >
            设置示例内容
          </button>
        </div>
        <Richtext {...args} value={value} onChange={handleChange} />
        <div className='mt-4'>
          <div className='text-muted-foreground mb-2 text-sm'>
            变更历史（最近 5 次）:
          </div>
          <div className='bg-muted max-h-40 space-y-1 overflow-auto rounded p-2 text-xs'>
            {history.length === 0 ? (
              <div className='text-muted-foreground'>暂无变更记录</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className='truncate'>
                  {i + 1}. {h.substring(0, 100)}...
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  },
}

export const SideBySideComparison: Story = {
  render() {
    const sampleContent = JSON.stringify([
      {
        type: 'h2',
        children: [{ text: '示例内容' }],
      },
      {
        type: 'p',
        children: [
          { text: '这是一段包含 ' },
          { text: '粗体', bold: true },
          { text: ' 和 ' },
          { text: '斜体', italic: true },
          { text: ' 的文本。' },
        ],
      },
      {
        type: 'ul',
        children: [
          { type: 'li', children: [{ text: '列表项 1' }] },
          { type: 'li', children: [{ text: '列表项 2' }] },
        ],
      },
    ])

    const [editValue, setEditValue] = useState(sampleContent)

    return (
      <div className='mx-auto grid w-full max-w-6xl grid-cols-2 gap-4'>
        <div>
          <div className='text-muted-foreground mb-2 text-sm font-medium'>
            编辑模式
          </div>
          <div className='rounded-lg border'>
            <Richtext value={editValue} onChange={setEditValue} />
          </div>
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm font-medium'>
            只读预览
          </div>
          <div className='rounded-lg border'>
            <Richtext value={editValue} readMode showToolbar={false} />
          </div>
        </div>
      </div>
    )
  },
}

export const WithOutline: Story = {
  render(args) {
    const initialContent = JSON.stringify([
      {
        type: 'h1',
        children: [{ text: 'NocoKit 富文本编辑器使用指南' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '欢迎使用 NocoKit 富文本编辑器！这是一款功能强大、体验流畅的现代化编辑器，旨在为用户提供类似 Notion 的编辑体验。本指南将详细介绍编辑器的各项功能和使用技巧。',
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '1. 快速入门' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '开始使用编辑器非常简单。只需点击编辑区域即可开始输入文字。编辑器支持实时保存，您的所有更改都会自动保存。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '1.1 基本文字输入' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '您可以直接在编辑区域输入文字。使用工具栏可以快速设置文字的 ',
          },
          { text: '粗体', bold: true },
          { text: '、' },
          { text: '斜体', italic: true },
          { text: '、' },
          { text: '下划线', underline: true },
          { text: ' 和 ' },
          { text: '删除线', strikethrough: true },
          { text: ' 等样式。' },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '1.2 斜杠命令' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '在任意位置输入 "/" 可以打开斜杠命令菜单，快速插入各种内容块，包括标题、列表、引用、代码块、表格等。这是提高编辑效率的重要功能。',
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '2. 文本格式化' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '编辑器提供丰富的文本格式化选项，帮助您创建结构清晰、视觉美观的文档。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '2.1 标题层级' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '支持 H1 到 H6 共六级标题，可通过工具栏或 Markdown 快捷方式（如 # 、##、### 等）快速创建。合理使用标题层级可以让文档结构更加清晰。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '2.2 列表功能' }],
      },
      {
        type: 'p',
        children: [{ text: '编辑器支持多种列表类型：' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: '无序列表：使用 "-" 或 "*" 开头' }],
          },
          {
            type: 'li',
            children: [{ text: '有序列表：使用 "1." 开头' }],
          },
          {
            type: 'li',
            children: [{ text: '待办列表：使用 "[]" 开头，可以勾选完成状态' }],
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '2.3 引用块' }],
      },
      {
        type: 'blockquote',
        children: [
          {
            text: '引用块适合用来标注重要信息、引用他人观点或强调关键内容。使用 ">" 符号可以快速创建引用块。',
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '3. 多媒体内容' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '除了文字，编辑器还支持插入多种多媒体内容，让您的文档更加丰富多彩。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '3.1 图片' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '支持通过拖拽、粘贴或上传方式插入图片。图片会自动适应编辑器宽度，也可以手动调整大小。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '3.2 视频和音频' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '可以嵌入视频和音频文件，支持常见的媒体格式。嵌入的媒体文件可以直接在文档中播放。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '3.3 文件附件' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '支持上传各种类型的文件作为附件，方便读者下载和查阅相关资料。',
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '4. 高级功能' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '编辑器还提供了一些高级功能，满足专业用户的需求。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '4.1 表格' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '可以创建和编辑表格，支持添加/删除行列、合并单元格等操作。表格适合用来展示结构化数据。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '4.2 代码块' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '支持插入代码块，并提供语法高亮功能。支持多种编程语言，适合技术文档的编写。',
          },
        ],
      },
      {
        type: 'code_block',
        lang: 'typescript',
        children: [
          {
            type: 'code_line',
            children: [{ text: 'function greet(name: string): string {' }],
          },
          {
            type: 'code_line',
            children: [{ text: '  return `Hello, ${name}!`' }],
          },
          {
            type: 'code_line',
            children: [{ text: '}' }],
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '4.3 折叠块' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '折叠块可以隐藏次要内容，让文档主体更加简洁。读者可以点击展开查看详细内容。',
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '5. 键盘快捷键' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '熟练使用键盘快捷键可以大幅提高编辑效率。以下是一些常用快捷键：',
          },
        ],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: 'Ctrl/Cmd + B：粗体' }],
          },
          {
            type: 'li',
            children: [{ text: 'Ctrl/Cmd + I：斜体' }],
          },
          {
            type: 'li',
            children: [{ text: 'Ctrl/Cmd + U：下划线' }],
          },
          {
            type: 'li',
            children: [{ text: 'Ctrl/Cmd + K：插入链接' }],
          },
          {
            type: 'li',
            children: [{ text: 'Ctrl/Cmd + Z：撤销' }],
          },
          {
            type: 'li',
            children: [{ text: 'Ctrl/Cmd + Shift + Z：重做' }],
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '6. 大纲导航' }],
      },
      {
        type: 'p',
        children: [
          {
            text: '右侧的大纲面板会自动提取文档中的所有标题，形成目录结构。点击大纲中的标题可以快速跳转到对应位置，方便在长文档中导航。',
          },
        ],
      },
      {
        type: 'h3',
        children: [{ text: '6.1 大纲功能特点' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: '自动提取文档标题' }],
          },
          {
            type: 'li',
            children: [{ text: '支持 H1-H6 所有标题级别' }],
          },
          {
            type: 'li',
            children: [{ text: '点击即可跳转到对应位置' }],
          },
          {
            type: 'li',
            children: [{ text: '缩进显示层级关系' }],
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: '7. 总结' }],
      },
      {
        type: 'p',
        children: [
          {
            text: 'NocoKit 富文本编辑器集成了现代编辑器的众多优秀特性，无论是日常写作还是专业文档编写，都能提供优质的编辑体验。我们将持续改进和增加新功能，欢迎提供反馈和建议！',
          },
        ],
      },
    ])

    const [value, setValue] = useState(initialContent)
    return (
      <div className='mx-auto h-200 w-full max-w-5xl'>
        <Richtext
          {...args}
          value={value}
          onChange={setValue}
          showOutline
          minHeight={500}
        />
      </div>
    )
  },
}

export const MarkdownMode: Story = {
  args: {
    valueType: 'markdown',
    placeholder: '使用 Markdown 格式编辑...',
  },
  render(args) {
    const [value, setValue] = useState(`# 欢迎使用 Markdown 模式

这是一段 **粗体** 和 *斜体* 文本。

## 列表

- 项目一
- 项目二
- 项目三

## 代码块

\`\`\`javascript
console.log('Hello World')
\`\`\`

## 引用

> 这是一段引用文本

## 表格

| 功能 | 描述 |
| --- | --- |
| 粗体 | **文本** |
| 斜体 | *文本* |
`)
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
        <details className='mt-4'>
          <summary className='text-muted-foreground cursor-pointer text-sm'>
            查看 Markdown 输出
          </summary>
          <pre className='bg-muted mt-2 overflow-auto rounded-lg p-4 text-xs whitespace-pre-wrap'>
            {value || '(空)'}
          </pre>
        </details>
      </div>
    )
  },
}

export const HtmlMode: Story = {
  args: {
    valueType: 'html',
    placeholder: '使用 HTML 格式编辑...',
  },
  render(args) {
    const [value, setValue] = useState(
      `<h1>欢迎使用 HTML 模式</h1>
<p>这是一段 <strong>粗体</strong> 和 <em>斜体</em> 文本。</p>
<h2>列表</h2>
<ul>
  <li>项目一</li>
  <li>项目二</li>
  <li>项目三</li>
</ul>
<blockquote>这是一段引用文本</blockquote>
<p>HTML 模式支持常见的 HTML 标签，如标题、段落、列表、引用等。</p>`
    )
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Richtext {...args} value={value} onChange={setValue} />
        <details className='mt-4'>
          <summary className='text-muted-foreground cursor-pointer text-sm'>
            查看 HTML 输出
          </summary>
          <pre className='bg-muted mt-2 overflow-auto rounded-lg p-4 text-xs whitespace-pre-wrap'>
            {value || '(空)'}
          </pre>
        </details>
      </div>
    )
  },
}
