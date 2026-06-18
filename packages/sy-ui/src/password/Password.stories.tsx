import { Meta, StoryObj } from '@storybook/react-vite'
import { Password } from '@/password'
import { useState } from 'react'

const meta = {
  title: 'Input/Password',
  component: Password,
  argTypes: {},
  args: {
    style: { width: 200 },
  },
} satisfies Meta<typeof Password>

export default meta

type Story = StoryObj<typeof meta>

// 默认密码输入框
export const Default: Story = {
  render(args) {
    const [value, setValue] = useState('')
    return (
      <Password
        {...args}
        value={value}
        onChange={setValue}
        placeholder='请输入密码'
      />
    )
  },
}

// 带初始值
export const WithValue: Story = {
  render(args) {
    const [value, setValue] = useState('password123')
    return <Password {...args} value={value} onChange={setValue} />
  },
}

// 受控模式
export const Controlled: Story = {
  render(args) {
    const [value, setValue] = useState('mypassword')
    return (
      <div className='flex flex-col gap-2'>
        <Password {...args} value={value} onChange={setValue} />
        <div className='text-muted-foreground text-sm'>当前值: {value}</div>
      </div>
    )
  },
}

// 禁用状态
export const Disabled: Story = {
  render(args) {
    const [value, setValue] = useState('disabledpassword')
    return <Password {...args} value={value} onChange={setValue} disabled />
  },
}

// 错误状态
export const Error: Story = {
  render(args) {
    const [value, setValue] = useState('123')
    return (
      <Password
        {...args}
        value={value}
        onChange={setValue}
        errorMsg='密码长度不能小于6位'
      />
    )
  },
}

// 只读模式 - 可查看密码
export const ReadMode: Story = {
  render(args) {
    return (
      <div className='flex flex-col gap-4'>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>
            只读模式（点击眼睛图标查看）:
          </div>
          <Password {...args} value='secretpassword' readMode />
        </div>
      </div>
    )
  },
}

// 在表单中使用
export const InForm: Story = {
  render(args) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    return (
      <div className='flex w-[300px] flex-col gap-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>密码</label>
          <Password
            {...args}
            style={{ width: '100%' }}
            value={password}
            onChange={setPassword}
            placeholder='请输入密码'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>确认密码</label>
          <Password
            {...args}
            style={{ width: '100%' }}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder='请再次输入密码'
            errorMsg={
              confirmPassword && password !== confirmPassword
                ? '两次输入的密码不一致'
                : undefined
            }
          />
        </div>
      </div>
    )
  },
}

// 所有状态对比
export const AllStates: Story = {
  render(args) {
    return (
      <div className='flex flex-col gap-4'>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>默认:</div>
          <Password {...args} value='password' onChange={() => {}} />
        </div>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>禁用:</div>
          <Password {...args} value='password' onChange={() => {}} disabled />
        </div>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>错误:</div>
          <Password
            {...args}
            value='123'
            onChange={() => {}}
            errorMsg='密码过短'
          />
        </div>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>只读:</div>
          <Password {...args} value='secretpassword' readMode />
        </div>
      </div>
    )
  },
}
