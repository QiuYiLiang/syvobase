import { Meta, StoryObj } from '@storybook/react-vite'

import { Split } from '@/split'
import { useState } from 'react'

const meta = {
  title: 'Layout/Split',
  component: Split,
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    fixedWidth: {
      control: { type: 'number', min: 50, max: 600 },
    },
    minFixedWidth: {
      control: { type: 'number', min: 0 },
    },
    maxFixedWidth: {
      control: { type: 'number', min: 100 },
    },
    readMode: {
      control: 'boolean',
    },
  },
  args: {
    style: {
      width: 600,
      height: 400,
    },
  },
} satisfies Meta<typeof Split>

export default meta

type Story = StoryObj<typeof meta>

// 默认 - 左侧固定
export const Default: Story = {
  args: {
    direction: 'left',
    fixedWidth: 200,
    fixedContent: <div className='h-full bg-blue-100 p-4'>固定面板（左）</div>,
    content: <div className='h-full bg-gray-100 p-4'>弹性内容区域</div>,
  },
}

// 右侧固定
export const DirectionRight: Story = {
  args: {
    direction: 'right',
    fixedWidth: 200,
    fixedContent: <div className='h-full bg-green-100 p-4'>固定面板（右）</div>,
    content: <div className='h-full bg-gray-100 p-4'>弹性内容区域</div>,
  },
}

// 顶部固定
export const DirectionTop: Story = {
  args: {
    direction: 'top',
    fixedWidth: 120,
    fixedContent: (
      <div className='h-full bg-yellow-100 p-4'>固定面板（上）</div>
    ),
    content: <div className='h-full bg-gray-100 p-4'>弹性内容区域</div>,
  },
}

// 底部固定
export const DirectionBottom: Story = {
  args: {
    direction: 'bottom',
    fixedWidth: 120,
    fixedContent: (
      <div className='h-full bg-purple-100 p-4'>固定面板（下）</div>
    ),
    content: <div className='h-full bg-gray-100 p-4'>弹性内容区域</div>,
  },
}

// 只读模式 - 不显示分割线，不可拖动
export const ReadOnly: Story = {
  args: {
    direction: 'left',
    fixedWidth: 200,
    readMode: true,
    fixedContent: (
      <div className='h-full bg-blue-100 p-4'>固定面板（只读）</div>
    ),
    content: (
      <div className='h-full bg-gray-100 p-4'>只读模式：无分割线，不可拖动</div>
    ),
  },
}

// 受控模式 - 显示当前宽度
export const Controlled: Story = {
  render(args) {
    const [width, setWidth] = useState(200)
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>
          当前固定面板宽度: {width}px
        </div>
        <Split {...args} fixedWidth={width} onFixedWidthChange={setWidth}>
          <div className='h-full bg-blue-100 p-4'>固定面板 ({width}px)</div>
          <div className='h-full bg-gray-100 p-4'>弹性内容区域</div>
        </Split>
      </div>
    )
  },
  args: {
    direction: 'left',
    fixedContent: undefined,
    content: undefined,
  },
}

// 带最小/最大宽度限制
export const WithMinMax: Story = {
  render(args) {
    const [width, setWidth] = useState(200)
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>
          宽度: {width}px（限制范围: 100px ~ 400px）
        </div>
        <Split
          {...args}
          fixedWidth={width}
          onFixedWidthChange={setWidth}
          minFixedWidth={100}
          maxFixedWidth={400}
          fixedContent={
            <div className='h-full bg-blue-100 p-4'>固定面板 ({width}px)</div>
          }
          content={
            <div className='h-full bg-gray-100 p-4'>
              拖动把手试试，宽度会被限制在 100~400px
            </div>
          }
        />
      </div>
    )
  },
}

// 侧边栏布局
export const SidebarLayout: Story = {
  render(args) {
    const [width, setWidth] = useState(220)
    return (
      <Split
        {...args}
        style={{ width: '100%', height: 400 }}
        fixedWidth={width}
        onFixedWidthChange={setWidth}
        fixedContent={
          <div className='h-full bg-slate-800 p-4 text-white'>
            <div className='mb-4 font-bold'>导航菜单</div>
            <div className='space-y-2'>
              <div className='rounded bg-slate-700 p-2'>首页</div>
              <div className='cursor-pointer rounded p-2 hover:bg-slate-700'>
                文档
              </div>
              <div className='cursor-pointer rounded p-2 hover:bg-slate-700'>
                组件
              </div>
              <div className='cursor-pointer rounded p-2 hover:bg-slate-700'>
                设置
              </div>
            </div>
          </div>
        }
        content={
          <div className='h-full bg-white p-4'>
            <h1 className='mb-4 text-xl font-bold'>内容区域</h1>
            <p className='text-gray-600'>拖动分隔条调整侧边栏宽度</p>
          </div>
        }
      />
    )
  },
  args: {
    direction: 'left',
    minFixedWidth: 150,
    maxFixedWidth: 400,
  },
}

// 代码编辑器布局
export const EditorLayout: Story = {
  render(args) {
    const [width, setWidth] = useState(300)
    return (
      <Split
        {...args}
        style={{ width: '100%', height: 400 }}
        fixedWidth={width}
        onFixedWidthChange={setWidth}
        fixedContent={
          <div className='h-full overflow-auto bg-gray-900 p-4 font-mono text-sm text-green-400'>
            <div>{'// 代码编辑器'}</div>
            <div>{'function hello() {'}</div>
            <div>{'  console.log("Hello");'}</div>
            <div>{'}'}</div>
          </div>
        }
        content={
          <div className='h-full overflow-auto bg-white p-4'>
            <h2 className='mb-2 font-bold'>预览</h2>
            <div className='text-gray-600'>这里显示实时预览内容</div>
          </div>
        }
      />
    )
  },
  args: {
    direction: 'left',
    minFixedWidth: 150,
  },
}

// 上下分割 - 日志面板
export const LogPanel: Story = {
  render(args) {
    const [height, setHeight] = useState(150)
    return (
      <Split
        {...args}
        style={{ width: '100%', height: 400 }}
        direction='bottom'
        fixedWidth={height}
        onFixedWidthChange={setHeight}
        content={
          <div className='h-full bg-white p-4'>
            <h2 className='mb-2 font-bold'>主工作区</h2>
            <p className='text-gray-600'>上方为主内容区域</p>
          </div>
        }
        fixedContent={
          <div className='h-full overflow-auto bg-gray-900 p-3 font-mono text-xs text-gray-300'>
            <div className='text-green-400'>[INFO] 应用启动成功</div>
            <div className='text-yellow-400'>[WARN] 配置项缺失，使用默认值</div>
            <div className='text-green-400'>[INFO] 数据库连接成功</div>
            <div className='text-red-400'>[ERROR] 请求超时</div>
            <div className='text-green-400'>[INFO] 重试成功</div>
          </div>
        }
      />
    )
  },
  args: {
    minFixedWidth: 80,
    maxFixedWidth: 300,
  },
}
