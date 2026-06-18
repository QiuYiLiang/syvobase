import { Meta, StoryObj } from '@storybook/react-vite'
import { Draw } from '@/draw'
import { fn } from 'storybook/test'

const meta = {
  title: 'Input/Draw',
  component: Draw,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Draw>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
    onChange: fn(),
  } as any,
}
