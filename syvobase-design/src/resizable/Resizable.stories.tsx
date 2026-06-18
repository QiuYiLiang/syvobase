import { Meta, StoryObj } from '@storybook/react-vite'

import { Resizable } from '@/resizable'
import { useState } from 'react'

const meta = {
  title: 'Layout/Resizable',
  component: Resizable,
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    allowResize: {
      control: 'boolean',
    },
  },
  args: {
    style: {
      width: 500,
      height: 300,
    },
  },
} satisfies Meta<typeof Resizable>

export default meta

type Story = StoryObj<typeof meta>

// 默认 - 左侧可调整
export const Default: Story = {
  args: {
    direction: 'left',
    size: 150,
    children: [
      <div className='h-full bg-blue-100 p-4'>左侧面板</div>,
      <div className='h-full bg-gray-100 p-4'>主内容区域</div>,
    ],
  },
}

// 从右侧调整
export const DirectionRight: Story = {
  args: {
    direction: 'right',
    size: 150,
    children: [
      <div className='h-full bg-gray-100 p-4'>主内容区域</div>,
      <div className='h-full bg-green-100 p-4'>右侧面板</div>,
    ],
  },
}

// 从上方调整
export const DirectionTop: Story = {
  args: {
    direction: 'top',
    size: 100,
    children: [
      <div className='h-full bg-yellow-100 p-4'>顶部面板</div>,
      <div className='h-full bg-gray-100 p-4'>主内容区域</div>,
    ],
  },
}

// 从下方调整
export const DirectionBottom: Story = {
  args: {
    direction: 'bottom',
    size: 100,
    children: [
      <div className='h-full bg-gray-100 p-4'>主内容区域</div>,
      <div className='h-full bg-purple-100 p-4'>底部面板</div>,
    ],
  },
}

// 禁用调整
export const DisableResize: Story = {
  args: {
    direction: 'left',
    size: 150,
    allowResize: false,
    children: [
      <div className='h-full bg-blue-100 p-4'>固定宽度面板</div>,
      <div className='h-full bg-gray-100 p-4'>主内容（拖拽分隔条无效）</div>,
    ],
  },
}

// 受控模式
export const Controlled: Story = {
  render(args) {
    const [size, setSize] = useState(200)
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>当前尺寸: {size}px</div>
        <Resizable {...args} size={size} onSizeChange={setSize}>
          <div className='h-full bg-blue-100 p-4'>可调整面板 ({size}px)</div>
          <div className='h-full bg-gray-100 p-4'>主内容区域</div>
        </Resizable>
      </div>
    )
  },
}

// 侧边栏布局
export const SidebarLayout: Story = {
  args: {
    direction: 'left',
    size: 200,
    style: {
      width: '100%',
      height: 400,
    },
    children: [
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
      </div>,
      <div className='h-full bg-white p-4'>
        <h1 className='mb-4 text-xl font-bold'>内容区域</h1>
        <p className='text-gray-600'>拖动分隔条调整侧边栏宽度</p>
      </div>,
    ],
  },
}

// 双面板编辑器
export const EditorLayout: Story = {
  args: {
    direction: 'left',
    size: 250,
    style: {
      width: '100%',
      height: 400,
    },
    children: [
      <div className='h-full overflow-auto bg-gray-900 p-4 font-mono text-sm text-green-400'>
        <div>{'// 代码编辑器'}</div>
        <div>{'function hello() {'}</div>
        <div>{'  console.log("Hello");'}</div>
        <div>{'}'}</div>
      </div>,
      <div className='h-full overflow-auto bg-white p-4'>
        <h2 className='mb-2 font-bold'>预览</h2>
        <div className='text-gray-600'>这里显示预览内容</div>
      </div>,
    ],
  },
}

// 三栏布局（嵌套）
export const ThreeColumnLayout: Story = {
  render() {
    return (
      <Resizable
        direction='left'
        size={150}
        style={{ width: '100%', height: 400 }}
      >
        <div className='h-full bg-slate-100 p-4'>
          <div className='mb-2 font-bold'>导航</div>
          <div className='text-sm text-gray-600'>菜单项...</div>
        </div>
        <Resizable
          direction='right'
          size={200}
          style={{ width: '100%', height: '100%' }}
        >
          <div className='h-full bg-white p-4'>
            <h1 className='mb-2 font-bold'>主内容</h1>
            <p className='text-sm text-gray-600'>这是三栏布局的中间区域</p>
          </div>
          <div className='h-full bg-blue-50 p-4'>
            <div className='mb-2 font-bold'>属性面板</div>
            <div className='text-sm text-gray-600'>配置选项...</div>
          </div>
        </Resizable>
      </Resizable>
    )
  },
}

// 上下布局
export const VerticalLayout: Story = {
  args: {
    direction: 'top',
    size: 150,
    style: {
      width: 500,
      height: 400,
    },
    children: [
      <div className='h-full bg-blue-50 p-4'>
        <div className='font-bold'>工具栏区域</div>
        <div className='mt-2 flex gap-2'>
          <button className='rounded bg-blue-500 px-3 py-1 text-sm text-white'>
            保存
          </button>
          <button className='rounded bg-gray-200 px-3 py-1 text-sm'>
            撤销
          </button>
        </div>
      </div>,
      <div className='h-full overflow-auto bg-white p-4'>
        <h2 className='mb-2 font-bold'>内容区域</h2>
        <p className='text-gray-600'>向上拖动分隔条可以调整工具栏高度</p>
      </div>,
    ],
  },
}

// 所有方向对比
export const AllDirections: Story = {
  render() {
    const containerStyle = { width: 300, height: 200 }
    return (
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            direction="left"
          </div>
          <Resizable direction='left' size={100} style={containerStyle}>
            <div className='h-full bg-blue-100 p-2 text-sm'>Left</div>
            <div className='h-full bg-gray-100 p-2 text-sm'>Content</div>
          </Resizable>
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            direction="right"
          </div>
          <Resizable direction='right' size={100} style={containerStyle}>
            <div className='h-full bg-gray-100 p-2 text-sm'>Content</div>
            <div className='h-full bg-green-100 p-2 text-sm'>Right</div>
          </Resizable>
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            direction="top"
          </div>
          <Resizable direction='top' size={60} style={containerStyle}>
            <div className='h-full bg-yellow-100 p-2 text-sm'>Top</div>
            <div className='h-full bg-gray-100 p-2 text-sm'>Content</div>
          </Resizable>
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            direction="bottom"
          </div>
          <Resizable direction='bottom' size={60} style={containerStyle}>
            <div className='h-full bg-gray-100 p-2 text-sm'>Content</div>
            <div className='h-full bg-purple-100 p-2 text-sm'>Bottom</div>
          </Resizable>
        </div>
      </div>
    )
  },
}
