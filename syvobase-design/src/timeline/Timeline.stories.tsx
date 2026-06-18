import { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from '@/timeline'

const meta = {
  title: 'Base/Timeline',
  component: Timeline,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Timeline>

export default meta

type Story = StoryObj<typeof meta>

// 默认时间线
export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        name: '事件一',
      },
      {
        id: '2',
        name: '事件二',
      },
      {
        id: '3',
        name: '事件三',
      },
    ],
  },
}

// 带颜色的时间线
export const WithColors: Story = {
  args: {
    items: [
      {
        id: '1',
        name: '创建成功',
        color: 'green',
      },
      {
        id: '2',
        name: '审核中',
        color: 'blue',
      },
      {
        id: '3',
        name: '已驳回',
        color: 'red',
      },
      {
        id: '4',
        name: '待处理',
        color: 'orange',
      },
    ],
  },
}

// 空心圆点
export const HollowDot: Story = {
  args: {
    items: [
      {
        id: '1',
        name: '事件一',
        dot: false,
      },
      {
        id: '2',
        name: '事件二',
        dot: false,
        color: 'green',
      },
      {
        id: '3',
        name: '事件三',
        dot: false,
        color: 'blue',
      },
    ],
  },
}

// 带图标
export const WithIcons: Story = {
  args: {
    items: [
      {
        id: '1',
        icon: 'Check',
        name: '已完成',
        color: 'green',
      },
      {
        id: '2',
        icon: 'Clock',
        name: '进行中',
        color: 'blue',
      },
      {
        id: '3',
        icon: 'AlertCircle',
        name: '待处理',
        color: 'orange',
      },
      {
        id: '4',
        icon: 'X',
        name: '已取消',
        color: 'red',
      },
    ],
  },
}

// 带内容的时间线
export const WithContent: Story = {
  args: {
    items: [
      {
        id: '1',
        name: '2024-01-01',
        content: (
          <div className='text-muted-foreground'>
            <div className='text-foreground font-semibold'>项目启动</div>
            <div>完成项目立项和团队组建</div>
          </div>
        ),
      },
      {
        id: '2',
        name: '2024-02-15',
        color: 'blue',
        content: (
          <div className='text-muted-foreground'>
            <div className='text-foreground font-semibold'>需求分析</div>
            <div>完成需求收集和分析文档</div>
          </div>
        ),
      },
      {
        id: '3',
        name: '2024-03-20',
        color: 'green',
        content: (
          <div className='text-muted-foreground'>
            <div className='text-foreground font-semibold'>开发完成</div>
            <div>核心功能开发完毕，进入测试阶段</div>
          </div>
        ),
      },
      {
        id: '4',
        name: '2024-04-01',
        color: 'purple',
        content: (
          <div className='text-muted-foreground'>
            <div className='text-foreground font-semibold'>正式上线</div>
            <div>产品正式发布并投入使用</div>
          </div>
        ),
      },
    ],
  },
}

// 混合样式
export const Mixed: Story = {
  args: {
    items: [
      {
        id: '1',
        name: '实心圆点',
      },
      {
        id: '2',
        dot: false,
        name: '空心圆点',
        color: 'blue',
      },
      {
        id: '3',
        icon: 'Star',
        name: '带图标',
        color: 'yellow',
      },
      {
        id: '4',
        icon: 'Settings',
        name: '设置图标',
      },
      {
        id: '5',
        name: '带颜色',
        color: 'purple',
      },
    ],
  },
}

// 操作日志
export const OperationLog: Story = {
  args: {
    items: [
      {
        id: '1',
        icon: 'Plus',
        name: '创建记录',
        color: 'green',
        content: (
          <div className='text-muted-foreground text-sm'>
            张三 创建了此记录 - 10:30
          </div>
        ),
      },
      {
        id: '2',
        icon: 'Edit',
        name: '编辑记录',
        color: 'blue',
        content: (
          <div className='text-muted-foreground text-sm'>
            李四 修改了标题 - 11:45
          </div>
        ),
      },
      {
        id: '3',
        icon: 'MessageSquare',
        name: '添加评论',
        color: 'purple',
        content: (
          <div className='text-muted-foreground text-sm'>
            王五 添加了评论 - 14:20
          </div>
        ),
      },
      {
        id: '4',
        icon: 'Check',
        name: '完成任务',
        color: 'green',
        content: (
          <div className='text-muted-foreground text-sm'>
            张三 将状态改为已完成 - 16:00
          </div>
        ),
      },
    ],
  },
}

// 简洁模式
export const Simple: Story = {
  args: {
    items: [
      { id: '1', name: '09:00 - 起床' },
      { id: '2', name: '10:00 - 工作' },
      { id: '3', name: '12:00 - 午餐' },
      { id: '4', name: '14:00 - 会议' },
      { id: '5', name: '18:00 - 下班' },
    ],
  },
}
