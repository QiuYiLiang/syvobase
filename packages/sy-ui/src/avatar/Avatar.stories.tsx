import { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from '@/avatar'

const meta = {
  title: 'Base/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: '头像尺寸',
    },
    rounded: {
      control: 'boolean',
      description: '是否圆形',
    },
    src: {
      control: 'text',
      description: '图片地址',
    },
    name: {
      control: 'text',
      description: '名称（用于生成首字母头像）',
    },
  },
  args: {},
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

// 默认头像（带图片）
export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    name: '张三',
  },
}

// 不同尺寸
export const SizeSmall: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    name: '张三',
    size: 'sm',
  },
}

export const SizeDefault: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    name: '张三',
    size: 'default',
  },
}

export const SizeLarge: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    name: '张三',
    size: 'lg',
  },
}

// 首字母头像（无图片）
export const WithInitials: Story = {
  args: {
    name: '张三',
  },
}

export const WithEnglishName: Story = {
  args: {
    name: 'John Doe',
  },
}

export const WithSingleName: Story = {
  args: {
    name: 'Alice',
  },
}

// 方形头像
export const Square: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    name: '张三',
    rounded: false,
  },
}

export const SquareWithInitials: Story = {
  args: {
    name: '李四',
    rounded: false,
  },
}

// 所有尺寸对比
export const AllSizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar src='https://github.com/shadcn.png' size='sm' name='小' />
      <Avatar src='https://github.com/shadcn.png' size='default' name='中' />
      <Avatar src='https://github.com/shadcn.png' size='lg' name='大' />
    </div>
  ),
}

// 首字母头像尺寸对比
export const AllSizesWithInitials: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar size='sm' name='张三' />
      <Avatar size='default' name='李四' />
      <Avatar size='lg' name='王五' />
    </div>
  ),
}
