import { Meta, StoryObj } from '@storybook/react-vite'
import { OTP } from '@/otp'
import { useState } from 'react'

const meta = {
  title: 'Input/OTP',
  component: OTP,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    length: {
      control: 'number',
    },
  },
  args: {},
} satisfies Meta<typeof OTP>

export default meta

type Story = StoryObj<typeof meta>

// 默认OTP输入
export const Default: Story = {
  render() {
    const [value, setValue] = useState('')
    return <OTP value={value} onChange={setValue} />
  },
}

// 带初始值
export const WithValue: Story = {
  render() {
    const [value, setValue] = useState('123456')
    return <OTP value={value} onChange={setValue} />
  },
}

// 4位验证码
export const Length4: Story = {
  render() {
    const [value, setValue] = useState('')
    return <OTP value={value} onChange={setValue} length={4} />
  },
}

// 8位验证码
export const Length8: Story = {
  render() {
    const [value, setValue] = useState('')
    return <OTP value={value} onChange={setValue} length={8} />
  },
}

// 小尺寸
export const SizeSmall: Story = {
  render() {
    const [value, setValue] = useState('')
    return <OTP value={value} onChange={setValue} size='sm' />
  },
}

// 默认尺寸
export const SizeDefault: Story = {
  render() {
    const [value, setValue] = useState('')
    return <OTP value={value} onChange={setValue} size='default' />
  },
}

// 大尺寸
export const SizeLarge: Story = {
  render() {
    const [value, setValue] = useState('')
    return <OTP value={value} onChange={setValue} size='lg' />
  },
}

// 禁用状态
export const Disabled: Story = {
  render() {
    const [value, setValue] = useState('123')
    return <OTP value={value} onChange={setValue} disabled />
  },
}

// 错误状态
export const Error: Story = {
  render() {
    const [value, setValue] = useState('123456')
    return (
      <OTP
        errorMsg='验证码错误，请重新输入'
        value={value}
        onChange={setValue}
      />
    )
  },
}

// 完成回调
export const OnComplete: Story = {
  render() {
    const [value, setValue] = useState('')
    const [message, setMessage] = useState('')
    return (
      <div className='flex flex-col gap-2'>
        <OTP
          value={value}
          onChange={setValue}
          onComplete={(v) => setMessage(`验证码完成: ${v}`)}
        />
        {message && <div className='text-sm text-green-600'>{message}</div>}
      </div>
    )
  },
}

// 所有尺寸对比
export const AllSizes: Story = {
  render() {
    const [v1, setV1] = useState('')
    const [v2, setV2] = useState('')
    const [v3, setV3] = useState('')
    return (
      <div className='flex flex-col gap-4'>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>Small (sm):</div>
          <OTP value={v1} onChange={setV1} size='sm' />
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>Default:</div>
          <OTP value={v2} onChange={setV2} size='default' />
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>Large (lg):</div>
          <OTP value={v3} onChange={setV3} size='lg' />
        </div>
      </div>
    )
  },
}

// 验证表单
export const VerificationForm: Story = {
  render() {
    const [value, setValue] = useState('')
    const [verified, setVerified] = useState(false)
    return (
      <div className='flex w-[320px] flex-col items-center gap-4 rounded-lg border p-6'>
        <div className='text-lg font-semibold'>验证您的手机号</div>
        <div className='text-muted-foreground text-center text-sm'>
          我们已向您的手机发送了6位验证码
        </div>
        <OTP
          value={value}
          onChange={setValue}
          onComplete={() => setVerified(true)}
          size='lg'
        />
        {verified && <div className='text-sm text-green-600'>✓ 验证成功</div>}
        <button className='text-sm text-blue-600 hover:underline'>
          重新发送验证码
        </button>
      </div>
    )
  },
}
