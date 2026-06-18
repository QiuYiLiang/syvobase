import { Meta, StoryObj } from '@storybook/react-vite'
import { Qrcode } from '@/qrcode'
import { useState } from 'react'

const meta = {
  title: 'Input/Qrcode',
  component: Qrcode,
  argTypes: {
    errorLevel: {
      control: 'select',
      options: ['L', 'M', 'Q', 'H'],
    },
  },
  args: {
    style: { width: 200 },
  },
} satisfies Meta<typeof Qrcode>

export default meta

type Story = StoryObj<typeof meta>

// 默认输入模式
export const Default: Story = {
  render(args) {
    const [value, setValue] = useState('')
    return (
      <Qrcode
        {...args}
        value={value}
        onChange={setValue}
        placeholder='输入链接生成二维码'
      />
    )
  },
}

// 带初始值
export const WithValue: Story = {
  render(args) {
    const [value, setValue] = useState('https://example.com')
    return <Qrcode {...args} value={value} onChange={setValue} />
  },
}

// 只读模式 - 显示二维码
export const ReadMode: Story = {
  args: {
    value: 'https://github.com',
    readMode: true,
    width: 120,
  },
}

// 带图标
export const WithIcon: Story = {
  args: {
    value: 'https://github.com',
    readMode: true,
    width: 150,
    iconUrl: 'https://github.githubassets.com/favicons/favicon.svg',
  },
}

// 自定义颜色
export const CustomColor: Story = {
  args: {
    value: 'https://example.com',
    readMode: true,
    width: 120,
    color: '#1677ff',
  },
}

// 自定义背景色
export const CustomBgColor: Story = {
  args: {
    value: 'https://example.com',
    readMode: true,
    width: 120,
    bgColor: '#f0f0f0',
  },
}

// 带边框
export const Bordered: Story = {
  args: {
    value: 'https://example.com',
    readMode: true,
    width: 120,
    bordered: true,
  },
}

// 不同容错级别
export const ErrorLevelL: Story = {
  args: {
    value: 'https://example.com',
    readMode: true,
    width: 120,
    errorLevel: 'L',
  },
}

export const ErrorLevelH: Story = {
  args: {
    value: 'https://example.com',
    readMode: true,
    width: 120,
    errorLevel: 'H',
  },
}

// 不同尺寸
export const DifferentSizes: Story = {
  render() {
    return (
      <div className='flex items-end gap-4'>
        <div className='text-center'>
          <Qrcode value='https://example.com' readMode width={80} />
          <div className='text-muted-foreground mt-1 text-sm'>80px</div>
        </div>
        <div className='text-center'>
          <Qrcode value='https://example.com' readMode width={120} />
          <div className='text-muted-foreground mt-1 text-sm'>120px</div>
        </div>
        <div className='text-center'>
          <Qrcode value='https://example.com' readMode width={160} />
          <div className='text-muted-foreground mt-1 text-sm'>160px</div>
        </div>
      </div>
    )
  },
}

// 错误状态
export const Error: Story = {
  render(args) {
    const [value, setValue] = useState('')
    return (
      <Qrcode
        {...args}
        value={value}
        onChange={setValue}
        errorMsg='请输入有效的链接'
      />
    )
  },
}

// 禁用状态
export const Disabled: Story = {
  render(args) {
    const [value, setValue] = useState('https://example.com')
    return <Qrcode {...args} value={value} onChange={setValue} disabled />
  },
}

// 编辑与预览
export const EditAndPreview: Story = {
  render() {
    const [value, setValue] = useState('https://github.com')
    return (
      <div className='flex items-start gap-8'>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-medium'>输入链接:</div>
          <Qrcode value={value} onChange={setValue} style={{ width: 250 }} />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-medium'>二维码预览:</div>
          <Qrcode value={value} readMode width={150} bordered />
        </div>
      </div>
    )
  },
}

// 多种颜色展示
export const ColorVariants: Story = {
  render() {
    const colors = ['#000000', '#1677ff', '#52c41a', '#fa8c16', '#eb2f96']
    return (
      <div className='flex flex-wrap gap-4'>
        {colors.map((color) => (
          <div key={color} className='text-center'>
            <Qrcode
              value='https://example.com'
              readMode
              width={100}
              color={color}
            />
            <div className='text-muted-foreground mt-1 text-sm'>{color}</div>
          </div>
        ))}
      </div>
    )
  },
}
