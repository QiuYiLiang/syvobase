import { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@/checkbox'
import { fn } from 'storybook/test'
import { useState } from 'react'

const meta = {
  title: 'Input/Checkbox',
  component: Checkbox,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: true,
    onChange: fn(),
  },
  render(args) {
    const [value, setValue] = useState(true)
    return <Checkbox {...args} value={value} onChange={setValue} />
  },
}

export const Rounded: Story = {
  args: {
    value: true,
    rounded: true,
    onChange: fn(),
  },
  render(args) {
    const [value, setValue] = useState(true)
    return <Checkbox {...args} value={value} onChange={setValue} />
  },
}

export const Name: Story = {
  args: {
    value: true,
    name: '测试',
    onChange: fn(),
  },
  render(args) {
    const [value, setValue] = useState(true)
    return <Checkbox {...args} value={value} onChange={setValue} />
  },
}

export const Pills: Story = {
  args: {
    value: true,
    name: '测试',
    styleType: 'pills',
    onChange: fn(),
  },
  render(args) {
    const [value, setValue] = useState(true)
    return <Checkbox {...args} value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  args: {
    value: true,
    name: '测试',
    onChange: fn(),
    disabled: true,
  },
  render(args) {
    const [value, setValue] = useState(true)
    return <Checkbox {...args} value={value} onChange={setValue} />
  },
}

export const Indeterminate: Story = {
  args: {
    value: true,
    name: '测试',
    onChange: fn(),
  },
  render(args) {
    const [value, setValue] = useState(false)
    return (
      <Checkbox {...args} value={value} indeterminate onChange={setValue} />
    )
  },
}

export const Error: Story = {
  args: {
    errorMsg: '哈哈哈',
    value: true,
    name: '测试',
    onChange: fn(),
  },
}
