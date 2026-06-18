import { Meta, StoryObj } from '@storybook/react-vite'
import { Number } from '@/number'
import { useState } from 'react'

const meta = {
  title: 'Input/Number',
  component: Number,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Number>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render() {
    const [value, setValue] = useState<number>(123)
    return <Number value={value} onChange={setValue} />
  },
}

export const Error: Story = {
  args: {},
  render() {
    const [value, setValue] = useState<number>(123)
    return <Number errorMsg='哈哈哈' value={value} onChange={setValue} />
  },
}

export const Decimal: Story = {
  args: {
    decimal: 2,
  },
  render(args) {
    const [value, setValue] = useState<number>(123)
    return <Number {...args} value={value} onChange={setValue as any} />
  },
}

export const ZeroFilling: Story = {
  args: {
    zeroFilling: 2,
    readMode: true,
  },
  render(args) {
    const [value, setValue] = useState<number>(123)
    return <Number {...args} value={value} onChange={setValue as any} />
  },
}

export const Range: Story = {
  args: {
    range: true,
  },
  render(args) {
    const [value, setValue] = useState<[number, number]>([1, 2])
    return <Number {...args} value={value} onChange={setValue as any} />
  },
}
