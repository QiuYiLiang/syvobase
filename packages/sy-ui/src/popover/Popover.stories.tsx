import { Meta, StoryObj } from '@storybook/react-vite'

import { Popover } from '@/popover'
import { Button } from '@/button'

const meta = {
  title: 'Base/Popover',
  component: Popover,
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
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    equalWidth: {
      control: 'boolean',
      description: '是否与触发元素等宽',
    },
    animate: {
      control: 'boolean',
      description: '是否启用动画',
    },
    offset: {
      control: 'number',
      description: '偏移距离',
    },
  },
  args: {},
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

// 悬浮触发
export const Hover: Story = {
  args: {
    trigger: 'hover',
    content: <div>悬浮弹出的内容</div>,
    children: (
      <div>
        <Button>悬浮查看</Button>
      </div>
    ),
  },
}

// 点击触发
export const Click: Story = {
  args: {
    trigger: 'click',
    content: <div>点击弹出的内容</div>,
    children: (
      <div>
        <Button>点击打开</Button>
      </div>
    ),
  },
}

// 向上弹出
export const DirectionTop: Story = {
  args: {
    direction: 'top',
    content: <div>向上弹出</div>,
    children: (
      <div>
        <Button>向上</Button>
      </div>
    ),
  },
}

// 向下弹出
export const DirectionBottom: Story = {
  args: {
    direction: 'bottom',
    content: <div>向下弹出</div>,
    children: (
      <div>
        <Button>向下</Button>
      </div>
    ),
  },
}

// 向左弹出
export const DirectionLeft: Story = {
  args: {
    direction: 'left',
    content: <div>向左弹出</div>,
    children: (
      <div>
        <Button>向左</Button>
      </div>
    ),
  },
}

// 向右弹出
export const DirectionRight: Story = {
  args: {
    direction: 'right',
    content: <div>向右弹出</div>,
    children: (
      <div>
        <Button>向右</Button>
      </div>
    ),
  },
}

// 左对齐
export const AlignLeft: Story = {
  args: {
    align: 'left',
    content: <div>左对齐的内容，可能会比较长一些</div>,
    children: (
      <div>
        <Button>左对齐</Button>
      </div>
    ),
  },
}

// 居中对齐
export const AlignCenter: Story = {
  args: {
    align: 'center',
    content: <div>居中对齐的内容</div>,
    children: (
      <div>
        <Button>居中对齐</Button>
      </div>
    ),
  },
}

// 右对齐
export const AlignRight: Story = {
  args: {
    align: 'right',
    content: <div>右对齐的内容，可能会比较长一些</div>,
    children: (
      <div>
        <Button>右对齐</Button>
      </div>
    ),
  },
}

// 等宽
export const EqualWidth: Story = {
  args: {
    equalWidth: true,
    content: <div className='text-center'>与按钮等宽</div>,
    children: (
      <div>
        <Button style={{ width: 200 }}>等宽弹出</Button>
      </div>
    ),
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    content: <div>这个内容不会显示</div>,
    children: (
      <div>
        <Button>禁用的Popover</Button>
      </div>
    ),
  },
}

// 自定义偏移
export const CustomOffset: Story = {
  args: {
    offset: 16,
    content: <div>增加了偏移距离</div>,
    children: (
      <div>
        <Button>自定义偏移</Button>
      </div>
    ),
  },
}

// 无动画
export const NoAnimate: Story = {
  args: {
    animate: false,
    content: <div>无动画效果</div>,
    children: (
      <div>
        <Button>无动画</Button>
      </div>
    ),
  },
}

// 函数渲染内容
export const FunctionContent: Story = {
  args: {
    content: () => (
      <div>
        <p>通过函数渲染的内容</p>
        <p className='text-muted-foreground text-xs'>每次打开时重新渲染</p>
      </div>
    ),
    children: (
      <div>
        <Button>函数内容</Button>
      </div>
    ),
  },
}

// 复杂内容
export const ComplexContent: Story = {
  args: {
    trigger: 'click',
    content: (
      <div className='w-64 space-y-2'>
        <h4 className='font-semibold'>用户信息</h4>
        <div className='text-muted-foreground text-sm'>
          <p>用户名：张三</p>
          <p>邮箱：zhangsan@example.com</p>
          <p>角色：管理员</p>
        </div>
        <div className='flex gap-2 pt-2'>
          <Button size='sm' type='outline'>
            编辑
          </Button>
          <Button size='sm'>查看详情</Button>
        </div>
      </div>
    ),
    children: (
      <div>
        <Button>用户卡片</Button>
      </div>
    ),
  },
}

// 提示信息
export const Tooltip: Story = {
  args: {
    trigger: 'hover',
    openDelay: 100,
    content: '这是一个提示信息',
    children: <Button type='ghost' icon='Info' onlyIcon />,
  },
}

// 自定义样式
export const CustomStyle: Story = {
  args: {
    className: 'bg-primary text-primary-foreground',
    content: <div>自定义样式的Popover</div>,
    children: (
      <div>
        <Button>自定义样式</Button>
      </div>
    ),
  },
}

// 所有方向展示
export const AllDirections: Story = {
  render: () => (
    <div className='flex h-48 items-center justify-center gap-4'>
      <Popover direction='left' content='左侧'>
        <div>
          <Button>左</Button>
        </div>
      </Popover>
      <div className='flex flex-col gap-4'>
        <Popover direction='top' content='上方'>
          <div>
            <Button>上</Button>
          </div>
        </Popover>
        <Popover direction='bottom' content='下方'>
          <div>
            <Button>下</Button>
          </div>
        </Popover>
      </div>
      <Popover direction='right' content='右侧'>
        <div>
          <Button>右</Button>
        </div>
      </Popover>
    </div>
  ),
}
