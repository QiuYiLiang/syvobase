import { Meta, StoryObj } from '@storybook/react-vite'

import { Empty } from '@/empty'
import { Button } from '@/button'

const meta = {
  title: 'Base/Empty',
  component: Empty,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

// 默认空状态
export const Default: Story = {
  args: {
    children: '暂无数据',
  },
}

// 无文字
export const NoText: Story = {
  args: {},
}

// 带按钮
export const WithButton: Story = {
  args: {
    children: (
      <div className='flex flex-col items-center gap-2'>
        <span className='text-muted-foreground'>暂无数据</span>
        <Button size='sm'>添加数据</Button>
      </div>
    ),
  },
}

// 自定义样式
export const CustomStyle: Story = {
  args: {
    className: 'h-64 bg-secondary rounded-lg',
    children: '这是一个自定义高度的空状态',
  },
}

// 搜索无结果
export const SearchNoResult: Story = {
  args: {
    children: (
      <div className='flex flex-col items-center gap-1'>
        <span className='text-muted-foreground'>未找到匹配结果</span>
        <span className='text-muted-foreground text-xs'>请尝试其他关键词</span>
      </div>
    ),
  },
}

// 列表为空
export const EmptyList: Story = {
  args: {
    children: (
      <div className='flex flex-col items-center gap-2'>
        <span className='text-muted-foreground'>列表为空</span>
        <Button icon='Plus' size='sm'>
          新建项目
        </Button>
      </div>
    ),
  },
}

// 带容器
export const InContainer: Story = {
  render: () => (
    <div className='border-border h-80 w-96 rounded-lg border'>
      <Empty>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-muted-foreground'>暂无内容</span>
          <span className='text-muted-foreground text-xs'>
            点击下方按钮添加
          </span>
          <Button size='sm' type='outline'>
            开始添加
          </Button>
        </div>
      </Empty>
    </div>
  ),
}
