import { Meta, StoryObj } from '@storybook/react-vite'

import { Collapse } from '@/collapse'
import { useState } from 'react'
import { Button } from '@/button'

const meta = {
  title: 'Layout/Collapse',
  component: Collapse,
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['collapse', 'group'],
      description: '类型：折叠面板或分组',
    },
    multiple: {
      control: 'boolean',
      description: '是否允许多个展开',
    },
    border: {
      control: 'boolean',
      description: '是否显示边框',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: '尺寸',
    },
    disabledPadding: {
      control: 'boolean',
      description: '禁用内边距',
    },
  },
  args: {},
} satisfies Meta<typeof Collapse>

export default meta

type Story = StoryObj<typeof meta>

const items = [
  {
    id: 'tab1',
    name: '标签1',
    content: '这是标签1的内容，可以放置任何React节点。',
  },
  {
    id: 'tab2',
    name: '标签2',
    content: '这是标签2的内容，支持多行文本和复杂布局。',
  },
  {
    id: 'tab3',
    name: '标签3',
    content: '这是标签3的内容，可以包含表单、列表等组件。',
  },
]

// 默认折叠面板（无边框）
export const Default: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    border: false,
  },
}

// 带边框
export const WithBorder: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    border: true,
  },
}

// 单个展开模式
export const SingleExpand: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    multiple: false,
    border: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['tab1'])
    return <Collapse {...args} value={value} onChange={setValue} />
  },
}

// 多个展开模式
export const MultipleExpand: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    multiple: true,
    border: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['tab1', 'tab2'])
    return <Collapse {...args} value={value} onChange={setValue} />
  },
}

// 分组模式（总是展开）
export const GroupMode: Story = {
  args: {
    style: {
      width: 500,
    },
    type: 'group',
    items,
    border: true,
  },
}

// 小尺寸
export const SizeSmall: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    size: 'sm',
    border: true,
  },
}

// 大尺寸
export const SizeLarge: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    size: 'lg',
    border: true,
  },
}

// 禁用内边距
export const DisabledPadding: Story = {
  args: {
    style: {
      width: 500,
    },
    items: [
      {
        id: 'tab1',
        name: '标签1',
        content: (
          <div className='bg-secondary p-4'>自定义内容区域，无内边距</div>
        ),
      },
      {
        id: 'tab2',
        name: '标签2',
        content: (
          <div className='bg-secondary p-4'>自定义内容区域，无内边距</div>
        ),
      },
    ],
    disabledPadding: true,
    border: true,
  },
}

// 带工具栏
export const WithToolbar: Story = {
  args: {
    style: {
      width: 500,
    },
    items: [
      {
        id: 'tab1',
        name: '标签1',
        toolbar: [
          {
            icon: 'Plus',
            type: 'ghost',
            size: 'sm',
            onClick: () => console.log('添加'),
          },
          {
            icon: 'Settings',
            type: 'ghost',
            size: 'sm',
            onClick: () => console.log('设置'),
          },
        ],
        content: '这是标签1的内容',
      },
      {
        id: 'tab2',
        name: '标签2',
        toolbar: [
          {
            icon: 'Trash2',
            type: 'ghost',
            size: 'sm',
            onClick: () => console.log('删除'),
          },
        ],
        content: '这是标签2的内容',
      },
    ],
    border: true,
  },
}

// 默认展开指定项
export const DefaultExpanded: Story = {
  args: {
    style: {
      width: 500,
    },
    items,
    border: true,
    defaultValue: ['tab1', 'tab3'],
  },
}

// 复杂内容
export const ComplexContent: Story = {
  args: {
    style: {
      width: 500,
    },
    items: [
      {
        id: 'tab1',
        name: '用户信息',
        content: (
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>用户名：</span>
              <span>张三</span>
            </div>
            <div className='flex justify-between'>
              <span>邮箱：</span>
              <span>zhangsan@example.com</span>
            </div>
            <div className='flex justify-between'>
              <span>角色：</span>
              <span>管理员</span>
            </div>
          </div>
        ),
      },
      {
        id: 'tab2',
        name: '操作按钮',
        content: (
          <div className='flex gap-2'>
            <Button size='sm'>编辑</Button>
            <Button size='sm' type='outline'>
              取消
            </Button>
            <Button size='sm' type='destructive'>
              删除
            </Button>
          </div>
        ),
      },
    ],
    border: true,
  },
}
