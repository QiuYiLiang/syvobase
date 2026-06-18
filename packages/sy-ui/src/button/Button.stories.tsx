import { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/button'

const meta = {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    icon: {
      control: 'select',
      description: '图标',
      options: ['CircleDashed', 'Smile'],
    },
    type: {
      control: 'inline-radio',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'default',
    size: 'default',
    children: '按钮',
  },
}
export const Icon: Story = {
  args: {
    type: 'default',
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const OnlyIcon: Story = {
  args: {
    onlyIcon: true,
    type: 'default',
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}
export const Disabled: Story = {
  args: {
    type: 'default',
    disabled: true,
    icon: 'Settings',
    size: 'lg',
    children: '按钮',
  },
}

export const Rounded: Story = {
  args: {
    type: 'default',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const Destructive: Story = {
  args: {
    type: 'destructive',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const Outline: Story = {
  args: {
    type: 'outline',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const Secondary: Story = {
  args: {
    type: 'secondary',
    popover: '测试',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const Ghost: Story = {
  args: {
    type: 'ghost',
    popover: '测试',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const Link: Story = {
  args: {
    type: 'link',
    popover: '测试',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
  },
}

export const Loading: Story = {
  args: {
    type: 'default',
    popover: '测试',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    children: '按钮',
    onClick: (() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, 2000)
      })
    }) as any,
  },
}

export const DropdownButton: Story = {
  args: {
    type: 'default',
    rounded: true,
    icon: 'Settings',
    size: 'default',
    items: [
      { type: 'label', name: '测试' },
      {
        icon: 'Settings',
        name: '菜单1',
        onClick: () => {
          console.log('click Settings')
        },
      },
      {
        type: 'separator',
      },
      {
        icon: 'House',
        name: '菜单2',
        items: [
          { name: '菜单2-菜单1' },
          { icon: 'Settings', name: '菜单2-菜单2' },
        ],
      },
    ],
    children: '下拉按钮',
  },
}

export const Tag: Story = {
  args: {
    type: 'default',
    rounded: true,
    icon: 'Settings',
    size: 'sm',
    children: '标签1',
  },
}
