import { Meta, StoryObj } from '@storybook/react-vite'
import { IconPicker } from './IconPicker'
import { useState } from 'react'

const meta = {
  title: 'Base/IconPicker',
  component: IconPicker,
  argTypes: {},
} satisfies Meta<typeof IconPicker>

export default meta

type Story = StoryObj<typeof meta>

// 默认图标选择器
export const Default: Story = {
  args: {},
}

// 带初始值 - 默认图标
export const WithDefaultIcon: Story = {
  render() {
    const [value, setValue] = useState({
      type: 'default' as const,
      value: 'Home',
      color: '#3b82f6',
    })
    return <IconPicker value={value} onChange={setValue} />
  },
}

// 带颜色
export const WithColor: Story = {
  render() {
    const [value, setValue] = useState({
      type: 'default' as const,
      value: 'Star',
      color: '#f59e0b',
    })
    return <IconPicker value={value} onChange={setValue} />
  },
}

// 无图标
export const NoIcon: Story = {
  render() {
    const [value, setValue] = useState({
      type: 'none' as const,
      color: 'transparent',
    })
    return <IconPicker value={value} onChange={setValue} />
  },
}

// 只读模式 - 有图标
export const ReadModeWithIcon: Story = {
  args: {
    readMode: true,
    value: {
      type: 'default',
      value: 'Settings',
      color: '#8b5cf6',
    },
  },
}

// 只读模式 - 无图标
export const ReadModeNoIcon: Story = {
  args: {
    readMode: true,
    value: {
      type: 'none',
      color: 'transparent',
    },
  },
}

// 不同颜色的图标
export const DifferentColors: Story = {
  render() {
    const colors = [
      '#ef4444',
      '#f59e0b',
      '#22c55e',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
    ]
    return (
      <div className='flex gap-4'>
        {colors.map((color) => (
          <IconPicker
            key={color}
            readMode
            value={{
              type: 'default',
              value: 'Heart',
              color,
            }}
          />
        ))}
      </div>
    )
  },
}

// 受控模式
export const Controlled: Story = {
  render() {
    const [value, setValue] = useState({
      type: 'default' as const,
      value: 'User',
      color: '#3b82f6',
    })
    return (
      <div className='flex flex-col gap-4'>
        <IconPicker value={value} onChange={setValue} />
        <div className='text-muted-foreground text-sm'>
          <div>类型: {value.type}</div>
          <div>图标: {value.value}</div>
          <div>颜色: {value.color}</div>
        </div>
      </div>
    )
  },
}

// 在列表中使用
export const InList: Story = {
  render() {
    const items = [
      { name: '首页', icon: 'Home', color: '#3b82f6' },
      { name: '设置', icon: 'Settings', color: '#6b7280' },
      { name: '消息', icon: 'Mail', color: '#22c55e' },
      { name: '收藏', icon: 'Star', color: '#f59e0b' },
      { name: '用户', icon: 'User', color: '#8b5cf6' },
    ]
    return (
      <div className='w-[200px] space-y-2'>
        {items.map((item) => (
          <div
            key={item.name}
            className='flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100'
          >
            <IconPicker
              readMode
              value={{
                type: 'default',
                value: item.icon,
                color: item.color,
              }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    )
  },
}

// 表单中使用
export const InForm: Story = {
  render() {
    const [formData, setFormData] = useState({
      name: '我的项目',
      icon: {
        type: 'default' as const,
        value: 'Folder',
        color: '#3b82f6',
      },
    })
    return (
      <div className='flex w-[300px] flex-col gap-4 rounded border p-4'>
        <div className='text-lg font-bold'>项目设置</div>
        <div>
          <label className='mb-1 block text-sm font-medium'>项目图标</label>
          <IconPicker
            value={formData.icon}
            onChange={(icon) => setFormData({ ...formData, icon })}
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>项目名称</label>
          <input
            className='w-full rounded border px-3 py-2'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className='border-t pt-2'>
          <div className='text-muted-foreground text-sm'>预览:</div>
          <div className='mt-2 flex items-center gap-2'>
            <IconPicker readMode value={formData.icon} />
            <span className='font-medium'>{formData.name}</span>
          </div>
        </div>
      </div>
    )
  },
}
