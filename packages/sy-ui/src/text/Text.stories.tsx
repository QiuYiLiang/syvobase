import { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@/text'
import { useState } from 'react'
import { Icon } from '@/icon'

const meta = {
  title: 'Input/Text',
  component: Text,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 'hhh',
    style: {
      width: 200,
    },
  } as any,

  render(args) {
    const [value, setValue] = useState('hhh')
    return <Text {...args} value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  args: {
    value: 'hhh',
    disabled: true,
    style: {
      width: 200,
    },
  },
}

export const Before: Story = {
  args: {
    before: <Icon name='Search' />,
    value: 'hhh',
    style: {
      width: 200,
    },
  },
}

export const After: Story = {
  args: {
    value: 'hhh',
    after: '个',
    style: {
      width: 200,
    },
  },
}

export const ErrorMsg: Story = {
  args: {
    value: 'hhh',
    errorMsg: '哈哈哈',
    after: '个',
    style: {
      width: 200,
    },
  },
}

export const ErrorRules: Story = {
  args: {
    rules: [
      {
        trigger: 'blur',
        validator: (value) => {
          if (value !== 'hhh') {
            throw new Error('不是hhh')
          }
        },
      },
    ],
    style: {
      width: 200,
    },
  },
  render(args) {
    const [value, setValue] = useState('h')
    return <Text {...args} value={value} onChange={setValue} />
  },
}

export const InlineMode: Story = {
  args: {
    value: 'hhh',
    style: {
      width: 200,
    },
    inlineMode: true,
  } as any,

  render(args) {
    const [value, setValue] = useState('hhh')
    return <Text {...args} value={value} onChange={setValue} />
  },
}
