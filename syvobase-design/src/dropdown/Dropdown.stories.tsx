import { Meta, StoryObj } from '@storybook/react-vite'

import { Dropdown } from '@/dropdown'
import { Button } from '@/button'

const meta = {
  title: 'Base/Dropdown',
  component: Dropdown,
  argTypes: {
    trigger: {
      control: 'inline-radio',
      options: ['click', 'hover'],
      description: '触发方式',
    },
    direction: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: '弹出方向',
    },
    align: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: '对齐方式',
    },
    disabledIcon: {
      control: 'boolean',
      description: '是否禁用图标',
    },
    equalWidth: {
      control: 'boolean',
      description: '是否与触发元素等宽',
    },
  },
  args: {},
} satisfies Meta<typeof Dropdown>

export default meta

type Story = StoryObj<typeof meta>

const basicItems = [
  { type: 'label' as const, name: '菜单标题' },
  {
    icon: 'Settings' as const,
    name: '设置',
    onClick: () => console.log('click Settings'),
  },
  {
    type: 'separator' as const,
  },
  {
    icon: 'House' as const,
    name: '首页',
  },
]

// 默认下拉菜单
export const Default: Story = {
  args: {
    items: basicItems,
    children: <Button>下拉菜单</Button>,
  },
}

// 点击触发
export const ClickTrigger: Story = {
  args: {
    trigger: 'click',
    items: basicItems,
    children: <Button>点击打开</Button>,
  },
}

// 悬浮触发
export const HoverTrigger: Story = {
  args: {
    trigger: 'hover',
    items: basicItems,
    children: <Button>悬浮打开</Button>,
  },
}

// 带子菜单
export const WithSubMenu: Story = {
  args: {
    items: [
      { type: 'label', name: '操作' },
      {
        icon: 'Settings',
        name: '菜单1',
        onClick: () => console.log('click Settings'),
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
          {
            icon: 'User',
            name: '菜单2-菜单3',
            items: [{ name: '三级菜单1' }, { name: '三级菜单2' }],
          },
        ],
      },
      {
        icon: 'User',
        name: '菜单3',
        items: [{ name: '菜单3-菜单1' }, { icon: 'Bell', name: '菜单3-菜单2' }],
      },
    ],
    children: <Button>多级菜单</Button>,
  },
}

// 显示图标
export const WithIcon: Story = {
  args: {
    disabledIcon: false,
    items: [
      { icon: 'Plus', name: '新建' },
      { icon: 'Copy', name: '复制' },
      { icon: 'Scissors', name: '剪切' },
      { type: 'separator' },
      { icon: 'Trash2', name: '删除' },
    ],
    children: <Button>带图标菜单</Button>,
  },
}

// 向上弹出
export const DirectionTop: Story = {
  args: {
    direction: 'top',
    items: basicItems,
    children: <Button>向上弹出</Button>,
  },
}

// 向左弹出
export const DirectionLeft: Story = {
  args: {
    direction: 'left',
    items: basicItems,
    children: <Button>向左弹出</Button>,
  },
}

// 向右弹出
export const DirectionRight: Story = {
  args: {
    direction: 'right',
    items: basicItems,
    children: <Button>向右弹出</Button>,
  },
}

// 右对齐
export const AlignRight: Story = {
  args: {
    align: 'right',
    items: basicItems,
    children: <Button>右对齐</Button>,
  },
}

// 等宽
export const EqualWidth: Story = {
  args: {
    equalWidth: true,
    items: basicItems,
    children: <Button style={{ width: 200 }}>等宽下拉</Button>,
  },
}

// 条件显示菜单项
export const ConditionalItems: Story = {
  args: {
    items: [
      { name: '总是显示' },
      { name: '条件显示', visible: () => true },
      { name: '隐藏项', visible: () => false },
      { type: 'separator', visible: () => true },
      { name: '另一个显示项' },
    ],
    children: <Button>条件菜单</Button>,
  },
}

// 复杂示例
export const ComplexExample: Story = {
  args: {
    disabledIcon: false,
    items: [
      { type: 'label', name: '文件操作' },
      { icon: 'FilePlus', name: '新建文件' },
      { icon: 'FolderPlus', name: '新建文件夹' },
      { type: 'separator' },
      { type: 'label', name: '编辑' },
      { icon: 'Copy', name: '复制' },
      { icon: 'Scissors', name: '剪切' },
      { icon: 'Clipboard', name: '粘贴' },
      { type: 'separator' },
      {
        icon: 'Share2',
        name: '分享',
        items: [
          { icon: 'Link', name: '复制链接' },
          { icon: 'Mail', name: '发送邮件' },
          { icon: 'MessageSquare', name: '发送消息' },
        ],
      },
      { type: 'separator' },
      { icon: 'Trash2', name: '删除' },
    ],
    children: <Button icon='Menu'>操作菜单</Button>,
  },
}

// 图标按钮触发
export const IconButtonTrigger: Story = {
  args: {
    trigger: 'click',
    items: [
      { icon: 'Edit', name: '编辑' },
      { icon: 'Copy', name: '复制' },
      { type: 'separator' },
      { icon: 'Trash2', name: '删除' },
    ],
    children: <Button icon='MoreVertical' type='ghost' onlyIcon />,
  },
}
