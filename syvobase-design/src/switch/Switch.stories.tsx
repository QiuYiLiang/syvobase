import { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@/switch'
import { useState } from 'react'

const meta = {
  title: 'Input/Switch',
  component: Switch,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readMode: {
      control: 'boolean',
      description: '是否只读',
    },
  },
  args: {},
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

// 默认开关
export const Default: Story = {
  args: {
    defaultValue: false,
  },
}

// 默认开启
export const DefaultOn: Story = {
  args: {
    defaultValue: true,
  },
}

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(false)
    return (
      <div className='flex items-center gap-4'>
        <Switch value={value} onChange={setValue} />
        <span>当前状态：{value ? '开启' : '关闭'}</span>
      </div>
    )
  },
}

// 禁用状态 - 关闭
export const DisabledOff: Story = {
  args: {
    defaultValue: false,
    disabled: true,
  },
}

// 禁用状态 - 开启
export const DisabledOn: Story = {
  args: {
    defaultValue: true,
    disabled: true,
  },
}

// 只读模式 - 关闭
export const ReadModeOff: Story = {
  args: {
    defaultValue: false,
    readMode: true,
  },
}

// 只读模式 - 开启
export const ReadModeOn: Story = {
  args: {
    defaultValue: true,
    readMode: true,
  },
}

// 带标签
export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState(false)
    return (
      <div className='flex items-center gap-2'>
        <span>关闭</span>
        <Switch value={value} onChange={setValue} />
        <span>开启</span>
      </div>
    )
  },
}

// 表单中使用
export const InForm: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const [autoSave, setAutoSave] = useState(true)
    return (
      <div className='w-64 space-y-4'>
        <div className='flex items-center justify-between'>
          <span>通知提醒</span>
          <Switch value={notifications} onChange={setNotifications} />
        </div>
        <div className='flex items-center justify-between'>
          <span>深色模式</span>
          <Switch value={darkMode} onChange={setDarkMode} />
        </div>
        <div className='flex items-center justify-between'>
          <span>自动保存</span>
          <Switch value={autoSave} onChange={setAutoSave} />
        </div>
      </div>
    )
  },
}

// 自定义样式
export const CustomStyle: Story = {
  args: {
    defaultValue: true,
    className: 'scale-125',
  },
}

// 所有状态对比
export const AllStates: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Switch defaultValue={false} />
        <span>默认关闭</span>
      </div>
      <div className='flex items-center gap-4'>
        <Switch defaultValue={true} />
        <span>默认开启</span>
      </div>
      <div className='flex items-center gap-4'>
        <Switch defaultValue={false} disabled />
        <span>禁用 - 关闭</span>
      </div>
      <div className='flex items-center gap-4'>
        <Switch defaultValue={true} disabled />
        <span>禁用 - 开启</span>
      </div>
      <div className='flex items-center gap-4'>
        <Switch defaultValue={false} readMode />
        <span>只读 - 关闭</span>
      </div>
      <div className='flex items-center gap-4'>
        <Switch defaultValue={true} readMode />
        <span>只读 - 开启</span>
      </div>
    </div>
  ),
}
