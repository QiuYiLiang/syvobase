import { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '@/pagination'
import { useState } from 'react'

const meta = {
  title: 'Base/Pagination',
  component: Pagination,
  argTypes: {
    index: {
      control: 'number',
      description: '当前页码（从0开始）',
    },
    total: {
      control: 'number',
      description: '总记录数',
    },
    size: {
      control: 'number',
      description: '每页显示条数',
    },
  },
  args: {},
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

// 默认分页
export const Default: Story = {
  args: {
    index: 0,
    total: 200,
    sizeData: [10, 20, 50, 200],
    style: {
      width: 800,
    },
  },
}

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [index, setIndex] = useState(0)
    const [size, setSize] = useState(20)
    return (
      <div className='space-y-4'>
        <div className='text-muted-foreground'>
          当前页码: {index + 1}, 每页条数: {size}
        </div>
        <Pagination
          index={index}
          total={200}
          size={size}
          sizeData={[10, 20, 50, 100]}
          onIndexChange={setIndex}
          onSizeChange={setSize}
          style={{ width: 800 }}
        />
      </div>
    )
  },
}

// 少量数据
export const FewPages: Story = {
  args: {
    index: 0,
    total: 30,
    size: 10,
    sizeData: [10, 20, 50],
    style: {
      width: 600,
    },
  },
}

// 大量数据
export const ManyPages: Story = {
  args: {
    index: 5,
    total: 10000,
    size: 20,
    sizeData: [10, 20, 50, 100, 200],
    style: {
      width: 800,
    },
  },
}

// 中间页码
export const MiddlePage: Story = {
  args: {
    index: 10,
    total: 500,
    size: 20,
    sizeData: [10, 20, 50],
    style: {
      width: 800,
    },
  },
}

// 最后几页
export const LastPages: Story = {
  args: {
    index: 18,
    total: 200,
    size: 10,
    sizeData: [10, 20, 50],
    style: {
      width: 800,
    },
  },
}

// 自定义每页条数选项
export const CustomSizeOptions: Story = {
  args: {
    index: 0,
    total: 1000,
    size: 25,
    sizeData: [25, 50, 75, 100],
    style: {
      width: 800,
    },
  },
}

// 无数据
export const Empty: Story = {
  args: {
    index: 0,
    total: 0,
    size: 20,
    sizeData: [10, 20, 50],
    style: {
      width: 600,
    },
  },
}

// 单页数据
export const SinglePage: Story = {
  args: {
    index: 0,
    total: 15,
    size: 20,
    sizeData: [10, 20, 50],
    style: {
      width: 600,
    },
  },
}
