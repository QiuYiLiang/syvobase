import { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/badge'
import { Avatar } from '@/avatar/Avatar'
import { Button } from '@/button'

const meta = {
  title: 'Base/Badge',
  component: Badge,
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'secondary', 'destructive'],
      description: '徽章类型',
    },
    count: {
      control: 'number',
      description: '数字',
    },
    dot: {
      control: 'boolean',
      description: '是否显示为小圆点',
    },
    animate: {
      control: 'boolean',
      description: '是否显示动画',
    },
  },
  args: {},
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    count: 6,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 超过99显示99+
export const Max: Story = {
  args: {
    count: 999,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 不同类型
export const TypeDefault: Story = {
  args: {
    count: 5,
    type: 'default',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

export const TypeSecondary: Story = {
  args: {
    count: 5,
    type: 'secondary',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

export const TypeDestructive: Story = {
  args: {
    count: 5,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 小圆点模式
export const Dot: Story = {
  args: {
    count: 1,
    dot: true,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 带动画
export const Animate: Story = {
  args: {
    count: 3,
    animate: true,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 小圆点带动画
export const DotWithAnimate: Story = {
  args: {
    count: 1,
    dot: true,
    animate: true,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 自定义位置
export const CustomPosition: Story = {
  args: {
    count: 5,
    type: 'destructive',
    position: {
      top: 5,
      right: 5,
    },
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 与按钮配合使用
export const WithButton: Story = {
  args: {
    count: 12,
    type: 'destructive',
    children: <Button icon='Bell'>通知</Button>,
  },
}

// 零值不显示
export const ZeroCount: Story = {
  args: {
    count: 0,
    type: 'destructive',
    children: <Avatar src='https://github.com/shadcn.png' />,
  },
}

// 所有类型对比
export const AllTypes: Story = {
  render: () => (
    <div className='flex items-center gap-8'>
      <Badge count={5} type='default'>
        <Avatar src='https://github.com/shadcn.png' />
      </Badge>
      <Badge count={5} type='secondary'>
        <Avatar src='https://github.com/shadcn.png' />
      </Badge>
      <Badge count={5} type='destructive'>
        <Avatar src='https://github.com/shadcn.png' />
      </Badge>
    </div>
  ),
}
