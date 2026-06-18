import { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from '@/tag'

const meta = {
  title: 'Base/Tag',
  component: Tag,
  argTypes: {
    color: {
      control: 'select',
      options: [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
        'gray',
      ],
      description: '标签颜色',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: '尺寸',
    },
    rounded: {
      control: 'boolean',
      description: '是否圆角',
    },
    border: {
      control: 'boolean',
      description: '是否显示边框',
    },
  },
  args: {},
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>

// 默认标签
export const Default: Story = {
  args: {
    color: 'gray',
    children: '默认标签',
  },
}

// 带图标
export const WithIcon: Story = {
  args: {
    icon: 'Loader',
    color: 'cyan',
    children: '处理中',
  },
}

// 所有颜色
export const AllColors: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Tag color='magenta'>Magenta</Tag>
      <Tag color='red'>Red</Tag>
      <Tag color='volcano'>Volcano</Tag>
      <Tag color='orange'>Orange</Tag>
      <Tag color='gold'>Gold</Tag>
      <Tag color='lime'>Lime</Tag>
      <Tag color='green'>Green</Tag>
      <Tag color='cyan'>Cyan</Tag>
      <Tag color='blue'>Blue</Tag>
      <Tag color='geekblue'>Geekblue</Tag>
      <Tag color='purple'>Purple</Tag>
      <Tag color='gray'>Gray</Tag>
    </div>
  ),
}

// 不同尺寸
export const SizeSmall: Story = {
  args: {
    color: 'blue',
    size: 'sm',
    children: '小标签',
  },
}

export const SizeDefault: Story = {
  args: {
    color: 'blue',
    size: 'default',
    children: '默认标签',
  },
}

export const SizeLarge: Story = {
  args: {
    color: 'blue',
    size: 'lg',
    children: '大标签',
  },
}

// 圆角标签
export const Rounded: Story = {
  args: {
    color: 'green',
    rounded: true,
    children: '圆角标签',
  },
}

// 无边框
export const NoBorder: Story = {
  args: {
    color: 'blue',
    border: false,
    children: '无边框',
  },
}

// 状态标签
export const StatusTags: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Tag color='green' icon='Check'>
        成功
      </Tag>
      <Tag color='red' icon='X'>
        失败
      </Tag>
      <Tag color='orange' icon='AlertTriangle'>
        警告
      </Tag>
      <Tag color='blue' icon='Info'>
        信息
      </Tag>
      <Tag color='cyan' icon='Loader'>
        处理中
      </Tag>
    </div>
  ),
}

// 优先级标签
export const PriorityTags: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Tag color='red'>紧急</Tag>
      <Tag color='orange'>高</Tag>
      <Tag color='gold'>中</Tag>
      <Tag color='green'>低</Tag>
    </div>
  ),
}

// 类别标签
export const CategoryTags: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Tag color='blue'>前端</Tag>
      <Tag color='green'>后端</Tag>
      <Tag color='purple'>设计</Tag>
      <Tag color='cyan'>测试</Tag>
      <Tag color='orange'>运维</Tag>
    </div>
  ),
}

// 带图标的不同颜色
export const WithIconColors: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Tag color='blue' icon='User'>
        用户
      </Tag>
      <Tag color='green' icon='Settings'>
        设置
      </Tag>
      <Tag color='orange' icon='Bell'>
        通知
      </Tag>
      <Tag color='red' icon='Trash2'>
        删除
      </Tag>
      <Tag color='purple' icon='Star'>
        收藏
      </Tag>
    </div>
  ),
}

// 圆角标签组
export const RoundedGroup: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Tag color='blue' rounded>
        标签1
      </Tag>
      <Tag color='green' rounded>
        标签2
      </Tag>
      <Tag color='orange' rounded>
        标签3
      </Tag>
      <Tag color='purple' rounded>
        标签4
      </Tag>
    </div>
  ),
}

// 尺寸对比
export const SizeComparison: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <Tag color='blue' size='sm'>
        小
      </Tag>
      <Tag color='blue' size='default'>
        默认
      </Tag>
      <Tag color='blue' size='lg'>
        大
      </Tag>
    </div>
  ),
}

// 自定义样式
export const CustomStyle: Story = {
  args: {
    color: 'blue',
    className: 'font-bold',
    style: { letterSpacing: '2px' },
    children: '自定义样式',
  },
}
