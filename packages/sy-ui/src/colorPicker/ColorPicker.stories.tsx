import { Meta, StoryObj } from '@storybook/react-vite'
import { ColorPicker } from '@/colorPicker'
import { useState } from 'react'

const meta = {
  title: 'Input/ColorPicker',
  component: ColorPicker,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readMode: {
      control: 'boolean',
      description: '是否只读模式',
    },
  },
  args: {},
} satisfies Meta<typeof ColorPicker>

export default meta

type Story = StoryObj<typeof meta>

// 默认颜色选择器
export const Default: Story = {
  args: {
    defaultValue: '#1677ff',
  },
}

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [color, setColor] = useState('#1677ff')
    return (
      <div className='flex items-center gap-4'>
        <ColorPicker value={color} onChange={setColor} />
        <div className='text-muted-foreground'>当前颜色: {color}</div>
      </div>
    )
  },
}

// 错误状态
export const Error: Story = {
  args: {
    errorMsg: '请选择颜色',
    defaultValue: '#1677ff',
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '#1677ff',
  },
}

// 只读模式
export const ReadMode: Story = {
  args: {
    readMode: true,
    defaultValue: '#ff4d4f',
  },
}

// 透明色
export const Transparent: Story = {
  args: {
    defaultValue: 'transparent',
  },
}

// 不同颜色
export const DifferentColors: Story = {
  render: () => (
    <div className='flex gap-4'>
      <ColorPicker defaultValue='#1677ff' />
      <ColorPicker defaultValue='#52c41a' />
      <ColorPicker defaultValue='#faad14' />
      <ColorPicker defaultValue='#ff4d4f' />
      <ColorPicker defaultValue='#722ed1' />
    </div>
  ),
}

// 在表单中使用
export const InForm: Story = {
  render: () => {
    const [colors, setColors] = useState({
      primary: '#1677ff',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
    })
    return (
      <div className='w-64 space-y-4'>
        <div className='flex items-center justify-between'>
          <span>主色</span>
          <ColorPicker
            value={colors.primary}
            onChange={(v) => setColors({ ...colors, primary: v })}
          />
        </div>
        <div className='flex items-center justify-between'>
          <span>成功色</span>
          <ColorPicker
            value={colors.success}
            onChange={(v) => setColors({ ...colors, success: v })}
          />
        </div>
        <div className='flex items-center justify-between'>
          <span>警告色</span>
          <ColorPicker
            value={colors.warning}
            onChange={(v) => setColors({ ...colors, warning: v })}
          />
        </div>
        <div className='flex items-center justify-between'>
          <span>错误色</span>
          <ColorPicker
            value={colors.error}
            onChange={(v) => setColors({ ...colors, error: v })}
          />
        </div>
      </div>
    )
  },
}

// 只读模式对比
export const ReadModeComparison: Story = {
  render: () => (
    <div className='flex gap-4'>
      <div className='text-center'>
        <div className='mb-2 text-sm'>编辑模式</div>
        <ColorPicker defaultValue='#1677ff' />
      </div>
      <div className='text-center'>
        <div className='mb-2 text-sm'>只读模式</div>
        <ColorPicker readMode defaultValue='#1677ff' />
      </div>
    </div>
  ),
}
