import { Meta, StoryObj } from '@storybook/react-vite'

import { Loading } from '@/loading'
import { Button } from '@/button'

const meta = {
  title: 'Base/Loading',
  component: Loading,
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'mask', 'skeleton'],
      description: '加载类型',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: '尺寸',
    },
  },
  args: {},
} satisfies Meta<typeof Loading>

export default meta

type Story = StoryObj<typeof meta>

// 默认加载
export const Default: Story = {
  args: {
    type: 'default',
  },
}

// 带文字的加载
export const WithText: Story = {
  args: {
    type: 'default',
    children: <span className='text-muted-foreground mt-2'>加载中...</span>,
  },
}

// 遮罩层加载
export const Mask: Story = {
  args: {
    type: 'mask',
  },
  render: (args) => (
    <div className='relative h-48 w-64 rounded-lg border p-4'>
      <p>这是一段内容</p>
      <p>加载时会显示遮罩层</p>
      <Loading {...args} />
    </div>
  ),
}

// 骨架屏加载
export const Skeleton: Story = {
  args: {
    type: 'skeleton',
    style: { width: 300 },
  },
}

// 小尺寸
export const SizeSmall: Story = {
  args: {
    type: 'default',
    size: 'sm',
  },
}

// 默认尺寸
export const SizeDefault: Story = {
  args: {
    type: 'default',
    size: 'default',
  },
}

// 大尺寸
export const SizeLarge: Story = {
  args: {
    type: 'default',
    size: 'lg',
  },
}

// 在容器中居中
export const InContainer: Story = {
  render: () => (
    <div className='border-border flex h-48 w-64 items-center justify-center rounded-lg border'>
      <Loading size='default'>
        <span className='text-muted-foreground mt-2 text-sm'>正在加载...</span>
      </Loading>
    </div>
  ),
}

// 遮罩层带文字
export const MaskWithText: Story = {
  render: () => (
    <div className='relative h-48 w-64 rounded-lg border p-4'>
      <p>这是一段内容</p>
      <p>点击按钮加载数据</p>
      <Button className='mt-2'>加载数据</Button>
      <Loading type='mask'>
        <span className='text-muted-foreground mt-2'>数据加载中...</span>
      </Loading>
    </div>
  ),
}

// 所有尺寸对比
export const AllSizes: Story = {
  render: () => (
    <div className='flex items-end gap-8'>
      <div className='flex flex-col items-center'>
        <Loading size='sm' />
        <span className='text-muted-foreground mt-2 text-xs'>Small</span>
      </div>
      <div className='flex flex-col items-center'>
        <Loading size='default' />
        <span className='text-muted-foreground mt-2 text-xs'>Default</span>
      </div>
      <div className='flex flex-col items-center'>
        <Loading size='lg' />
        <span className='text-muted-foreground mt-2 text-xs'>Large</span>
      </div>
    </div>
  ),
}

// 骨架屏在卡片中
export const SkeletonInCard: Story = {
  render: () => (
    <div className='border-border w-80 rounded-lg border p-4'>
      <Loading type='skeleton' />
    </div>
  ),
}

// 自定义样式
export const CustomStyle: Story = {
  args: {
    type: 'default',
    className: 'text-primary',
    style: { height: 100 },
  },
}
