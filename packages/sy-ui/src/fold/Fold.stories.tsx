import { Meta, StoryObj } from '@storybook/react-vite'

import { Fold } from '@/fold'
import { useState } from 'react'

const meta = {
  title: 'Layout/Fold',
  component: Fold,
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right'],
    },
    handlerPosition: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {},
} satisfies Meta<typeof Fold>

export default meta

type Story = StoryObj<typeof meta>

// 默认折叠面板
export const Default: Story = {
  render() {
    return (
      <div className='flex'>
        <Fold>
          <div
            className='border-border'
            style={{
              borderRadius: 6,
              border: '1px solid',
              width: 200,
              height: 300,
              padding: 16,
            }}
          >
            可折叠内容区域
          </div>
        </Fold>
        <div className='flex-1 p-4'>主内容区域</div>
      </div>
    )
  },
}

// 向左折叠
export const DirectionLeft: Story = {
  render() {
    return (
      <div className='flex'>
        <div className='flex-1 p-4'>主内容区域</div>
        <Fold direction='left'>
          <div
            className='border-border'
            style={{
              borderRadius: 6,
              border: '1px solid',
              width: 200,
              height: 300,
              padding: 16,
            }}
          >
            左侧折叠面板
          </div>
        </Fold>
      </div>
    )
  },
}

// 受控模式
export const Controlled: Story = {
  render() {
    const [value, setValue] = useState(true)
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <button
            className='rounded bg-blue-500 px-3 py-1 text-sm text-white'
            onClick={() => setValue(true)}
          >
            展开
          </button>
          <button
            className='rounded bg-gray-200 px-3 py-1 text-sm'
            onClick={() => setValue(false)}
          >
            收起
          </button>
          <span className='text-muted-foreground text-sm'>
            当前状态: {value ? '展开' : '收起'}
          </span>
        </div>
        <div className='flex'>
          <Fold value={value} onChange={setValue}>
            <div
              className='border-border'
              style={{
                borderRadius: 6,
                border: '1px solid',
                width: 200,
                height: 200,
                padding: 16,
              }}
            >
              受控面板内容
            </div>
          </Fold>
          <div className='flex-1 p-4'>主内容区域</div>
        </div>
      </div>
    )
  },
}

// 手柄位置 - 顶部
export const HandlerPositionStart: Story = {
  render() {
    return (
      <div className='flex'>
        <Fold handlerPosition='start'>
          <div
            className='border-border'
            style={{
              borderRadius: 6,
              border: '1px solid',
              width: 200,
              height: 300,
              padding: 16,
            }}
          >
            手柄在顶部
          </div>
        </Fold>
        <div className='flex-1 p-4'>主内容</div>
      </div>
    )
  },
}

// 手柄位置 - 底部
export const HandlerPositionEnd: Story = {
  render() {
    return (
      <div className='flex'>
        <Fold handlerPosition='end'>
          <div
            className='border-border'
            style={{
              borderRadius: 6,
              border: '1px solid',
              width: 200,
              height: 300,
              padding: 16,
            }}
          >
            手柄在底部
          </div>
        </Fold>
        <div className='flex-1 p-4'>主内容</div>
      </div>
    )
  },
}

// 禁用折叠
export const Disabled: Story = {
  render() {
    return (
      <div className='flex'>
        <Fold disabled>
          <div
            className='border-border'
            style={{
              borderRadius: 6,
              border: '1px solid',
              width: 200,
              height: 200,
              padding: 16,
            }}
          >
            不可折叠（无手柄）
          </div>
        </Fold>
        <div className='flex-1 p-4'>主内容</div>
      </div>
    )
  },
}

// 默认收起
export const DefaultCollapsed: Story = {
  render() {
    return (
      <div className='flex'>
        <Fold value={false}>
          <div
            className='border-border'
            style={{
              borderRadius: 6,
              border: '1px solid',
              width: 200,
              height: 200,
              padding: 16,
            }}
          >
            默认收起的内容
          </div>
        </Fold>
        <div className='flex-1 p-4'>主内容区域（点击展开按钮查看）</div>
      </div>
    )
  },
}

// 侧边栏布局示例
export const SidebarLayout: Story = {
  render() {
    return (
      <div className='flex h-[400px] rounded border'>
        <Fold>
          <div className='h-full w-[200px] bg-slate-100 p-4'>
            <div className='mb-4 font-bold'>导航菜单</div>
            <div className='space-y-2'>
              <div className='cursor-pointer rounded bg-blue-500 p-2 text-white'>
                首页
              </div>
              <div className='cursor-pointer rounded p-2 hover:bg-slate-200'>
                文档
              </div>
              <div className='cursor-pointer rounded p-2 hover:bg-slate-200'>
                组件
              </div>
              <div className='cursor-pointer rounded p-2 hover:bg-slate-200'>
                设置
              </div>
            </div>
          </div>
        </Fold>
        <div className='flex-1 p-4'>
          <h1 className='mb-4 text-xl font-bold'>内容区域</h1>
          <p className='text-gray-600'>
            点击左侧边缘的折叠按钮可以收起导航菜单
          </p>
        </div>
      </div>
    )
  },
}

// 属性面板布局
export const PropertyPanelLayout: Story = {
  render() {
    return (
      <div className='flex h-[400px] rounded border'>
        <div className='flex-1 p-4'>
          <h1 className='mb-4 text-xl font-bold'>编辑器</h1>
          <div className='flex h-[300px] items-center justify-center rounded bg-gray-100'>
            画布区域
          </div>
        </div>
        <Fold direction='left'>
          <div className='h-full w-[250px] border-l bg-slate-50 p-4'>
            <div className='mb-4 font-bold'>属性面板</div>
            <div className='space-y-4'>
              <div>
                <label className='text-sm text-gray-600'>名称</label>
                <input
                  className='mt-1 w-full rounded border px-2 py-1'
                  placeholder='输入名称'
                />
              </div>
              <div>
                <label className='text-sm text-gray-600'>宽度</label>
                <input
                  className='mt-1 w-full rounded border px-2 py-1'
                  placeholder='100'
                />
              </div>
              <div>
                <label className='text-sm text-gray-600'>高度</label>
                <input
                  className='mt-1 w-full rounded border px-2 py-1'
                  placeholder='100'
                />
              </div>
            </div>
          </div>
        </Fold>
      </div>
    )
  },
}

// 所有手柄位置对比
export const AllHandlerPositions: Story = {
  render() {
    return (
      <div className='flex flex-col gap-8'>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            handlerPosition="start"
          </div>
          <div className='flex h-[150px] rounded border'>
            <Fold handlerPosition='start'>
              <div className='h-full w-[150px] bg-blue-50 p-2'>Start</div>
            </Fold>
            <div className='flex-1 p-2'>Content</div>
          </div>
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            handlerPosition="center"
          </div>
          <div className='flex h-[150px] rounded border'>
            <Fold handlerPosition='center'>
              <div className='h-full w-[150px] bg-green-50 p-2'>Center</div>
            </Fold>
            <div className='flex-1 p-2'>Content</div>
          </div>
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>
            handlerPosition="end"
          </div>
          <div className='flex h-[150px] rounded border'>
            <Fold handlerPosition='end'>
              <div className='h-full w-[150px] bg-purple-50 p-2'>End</div>
            </Fold>
            <div className='flex-1 p-2'>Content</div>
          </div>
        </div>
      </div>
    )
  },
}
