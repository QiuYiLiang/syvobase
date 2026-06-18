import { Meta, StoryObj } from '@storybook/react-vite'

import { Kanban, KanbanProps } from '@/kanban'
import { useState } from 'react'

const meta: Meta<typeof Kanban> = {
  title: 'Layout/Kanban',
  component: Kanban,
  argTypes: {},
}

export default meta

type Story = StoryObj<KanbanProps>

// 默认看板
export const Default: Story = {
  args: {
    items: [
      { id: 'Planned', name: 'Planned', color: '#6B7280' },
      { id: 'In Progress', name: 'In Progress', color: '#F59E0B' },
      { id: 'Done', name: 'Done', color: '#10B981' },
    ],
    fieldNames: { idKey: 'id', groupKey: 'parentId' },
    value: [
      { id: '1', name: 'AI Scene Analysis', parentId: 'Planned' },
      { id: '2', name: 'Collaborative Editing', parentId: 'In Progress' },
      { id: '3', name: 'AI-Powered Color Grading', parentId: 'Done' },
      { id: '4', name: 'Real-time Video Chat', parentId: 'Planned' },
      { id: '5', name: 'AI Voice-to-Text Subtitles', parentId: 'In Progress' },
      { id: '6', name: 'Cloud Asset Management', parentId: 'Done' },
      { id: '7', name: 'Multi-track Timeline', parentId: 'Planned' },
      { id: '8', name: 'Auto Background Removal', parentId: 'In Progress' },
    ],
  },
  render(args) {
    const [value, setValue] = useState(args.value)
    return <Kanban {...args} value={value} onChange={setValue} />
  },
}

// 任务管理看板
export const TaskBoard: Story = {
  render() {
    const [value, setValue] = useState<any[]>([
      {
        id: '1',
        name: '需求分析',
        parentId: 'todo',
        priority: 'high',
        assignee: '张三',
      },
      {
        id: '2',
        name: '技术方案设计',
        parentId: 'todo',
        priority: 'high',
        assignee: '李四',
      },
      {
        id: '3',
        name: '前端开发',
        parentId: 'doing',
        priority: 'medium',
        assignee: '王五',
      },
      {
        id: '4',
        name: '后端API开发',
        parentId: 'doing',
        priority: 'high',
        assignee: '赵六',
      },
      {
        id: '5',
        name: '数据库设计',
        parentId: 'done',
        priority: 'high',
        assignee: '张三',
      },
      {
        id: '6',
        name: '项目立项',
        parentId: 'done',
        priority: 'low',
        assignee: '李四',
      },
      {
        id: '7',
        name: '单元测试编写',
        parentId: 'todo',
        priority: 'medium',
        assignee: '王五',
      },
      {
        id: '8',
        name: '集成测试',
        parentId: 'doing',
        priority: 'low',
        assignee: '赵六',
      },
    ])
    return (
      <Kanban
        items={[
          { id: 'todo', name: '待办', color: '#6B7280' },
          { id: 'doing', name: '进行中', color: '#3B82F6' },
          { id: 'done', name: '已完成', color: '#10B981' },
        ]}
        fieldNames={{ idKey: 'id', groupKey: 'parentId' }}
        value={value}
        onChange={setValue}
        onItemRender={(item) => (
          <div className='p-2'>
            <div className='font-medium'>{item.name}</div>
            <div className='mt-1 flex items-center justify-between'>
              <span
                className={`rounded px-2 py-0.5 text-xs ${
                  item.priority === 'high'
                    ? 'bg-red-100 text-red-600'
                    : item.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-green-100 text-green-600'
                }`}
              >
                {item.priority === 'high'
                  ? '高'
                  : item.priority === 'medium'
                    ? '中'
                    : '低'}
              </span>
              <span className='text-muted-foreground text-xs'>
                {item.assignee}
              </span>
            </div>
          </div>
        )}
      />
    )
  },
}

// 产品需求看板
export const ProductBoard: Story = {
  render() {
    const [value, setValue] = useState<any[]>([
      {
        id: '1',
        name: '用户登录优化',
        parentId: 'backlog',
        type: 'feature',
        storyPoints: 5,
      },
      {
        id: '2',
        name: '性能问题修复',
        parentId: 'backlog',
        type: 'bug',
        storyPoints: 3,
      },
      {
        id: '3',
        name: '搜索功能',
        parentId: 'sprint',
        type: 'feature',
        storyPoints: 8,
      },
      {
        id: '4',
        name: '导出功能',
        parentId: 'review',
        type: 'feature',
        storyPoints: 5,
      },
      {
        id: '5',
        name: '首页UI调整',
        parentId: 'done',
        type: 'improvement',
        storyPoints: 2,
      },
      {
        id: '6',
        name: '数据缓存优化',
        parentId: 'backlog',
        type: 'improvement',
        storyPoints: 3,
      },
      {
        id: '7',
        name: '表单验证Bug',
        parentId: 'sprint',
        type: 'bug',
        storyPoints: 2,
      },
      {
        id: '8',
        name: '国际化支持',
        parentId: 'review',
        type: 'feature',
        storyPoints: 13,
      },
      {
        id: '9',
        name: '暗黑模式',
        parentId: 'done',
        type: 'feature',
        storyPoints: 8,
      },
    ])
    return (
      <Kanban
        items={[
          { id: 'backlog', name: 'Backlog', color: '#9CA3AF' },
          { id: 'sprint', name: 'Sprint', color: '#6366F1' },
          { id: 'review', name: 'Review', color: '#F59E0B' },
          { id: 'done', name: 'Done', color: '#10B981' },
        ]}
        fieldNames={{ idKey: 'id', groupKey: 'parentId' }}
        value={value}
        onChange={setValue}
        onItemRender={(item) => (
          <div className='p-2'>
            <div className='flex items-center gap-2'>
              <span
                className={`h-2 w-2 rounded-full ${
                  item.type === 'feature'
                    ? 'bg-blue-500'
                    : item.type === 'bug'
                      ? 'bg-red-500'
                      : 'bg-purple-500'
                }`}
              />
              <span className='font-medium'>{item.name}</span>
            </div>
            <div className='text-muted-foreground mt-1 flex items-center justify-between text-xs'>
              <span>
                {item.type === 'feature'
                  ? '功能'
                  : item.type === 'bug'
                    ? 'Bug'
                    : '优化'}
              </span>
              <span className='rounded bg-gray-100 px-1.5 py-0.5'>
                {item.storyPoints} SP
              </span>
            </div>
          </div>
        )}
      />
    )
  },
}

// 简单状态看板
export const SimpleStatus: Story = {
  render() {
    const [value, setValue] = useState<any[]>([
      { id: '1', name: '张三', parentId: 'active', role: '前端工程师' },
      { id: '2', name: '李四', parentId: 'active', role: '后端工程师' },
      { id: '3', name: '王五', parentId: 'inactive', role: '产品经理' },
      { id: '4', name: '赵六', parentId: 'pending', role: '测试工程师' },
      { id: '5', name: '钱七', parentId: 'active', role: 'UI设计师' },
      { id: '6', name: '孙八', parentId: 'pending', role: '运维工程师' },
    ])
    return (
      <Kanban
        items={[
          { id: 'active', name: '活跃', color: '#10B981' },
          { id: 'inactive', name: '不活跃', color: '#EF4444' },
          { id: 'pending', name: '待审核', color: '#F59E0B' },
        ]}
        fieldNames={{ idKey: 'id', groupKey: 'parentId' }}
        value={value}
        onChange={setValue}
        onItemRender={(item) => (
          <div className='p-2'>
            <div className='font-medium'>{item.name}</div>
            <div className='text-muted-foreground text-xs'>{item.role}</div>
          </div>
        )}
      />
    )
  },
}

// 自定义字段名
export const CustomFieldNames: Story = {
  render() {
    const [value, setValue] = useState<any[]>([
      { taskId: 'task-1', title: '任务一', status: 'open', desc: '紧急处理' },
      { taskId: 'task-2', title: '任务二', status: 'closed', desc: '已归档' },
      { taskId: 'task-3', title: '任务三', status: 'open', desc: '待评审' },
      { taskId: 'task-4', title: '任务四', status: 'open', desc: '需要讨论' },
      { taskId: 'task-5', title: '任务五', status: 'closed', desc: '完成测试' },
    ])
    return (
      <Kanban
        items={[
          { id: 'open', name: '开放', color: '#3B82F6' },
          { id: 'closed', name: '关闭', color: '#6B7280' },
        ]}
        fieldNames={{ idKey: 'taskId', groupKey: 'status' }}
        value={value}
        onChange={setValue}
        onItemRender={(item) => (
          <div className='p-2'>
            <div className='font-medium'>{item.title}</div>
            <div className='text-muted-foreground text-xs'>{item.desc}</div>
          </div>
        )}
      />
    )
  },
}

// 空看板
export const EmptyBoard: Story = {
  render() {
    const [value, setValue] = useState<any[]>([])
    return (
      <Kanban
        items={[
          { id: 'todo', name: '待办', color: '#6B7280' },
          { id: 'doing', name: '进行中', color: '#3B82F6' },
          { id: 'done', name: '已完成', color: '#10B981' },
        ]}
        value={value}
        onChange={setValue}
      />
    )
  },
}

// 带拖拽回调
export const WithDragCallback: Story = {
  render() {
    const [value, setValue] = useState<any[]>([
      { id: '1', name: '任务1', parentId: 'col1', tag: '功能' },
      { id: '2', name: '任务2', parentId: 'col1', tag: 'Bug' },
      { id: '3', name: '任务3', parentId: 'col2', tag: '优化' },
      { id: '4', name: '任务4', parentId: 'col1', tag: '功能' },
      { id: '5', name: '任务5', parentId: 'col2', tag: 'Bug' },
    ])
    const [log, setLog] = useState<string[]>([])
    return (
      <div className='flex flex-col gap-4'>
        <Kanban
          items={[
            { id: 'col1', name: '列1', color: '#3B82F6' },
            { id: 'col2', name: '列2', color: '#10B981' },
          ]}
          fieldNames={{ idKey: 'id', groupKey: 'parentId' }}
          value={value}
          onChange={setValue}
          onDrag={({ data, oldGroupId, newGroupId }) => {
            setLog((prev) => [
              ...prev,
              `移动 "${data.name}" 从 "${oldGroupId}" 到 "${newGroupId}"`,
            ])
          }}
          onItemRender={(item) => (
            <div className='p-2'>
              <div className='font-medium'>{item.name}</div>
              <div className='text-muted-foreground text-xs'>{item.tag}</div>
            </div>
          )}
        />
        <div className='rounded border p-3'>
          <div className='mb-2 text-sm font-medium'>拖拽日志:</div>
          {log.length === 0 ? (
            <div className='text-muted-foreground text-sm'>
              拖拽卡片查看日志
            </div>
          ) : (
            log.map((item, index) => (
              <div key={index} className='text-muted-foreground text-sm'>
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    )
  },
}

// 项目管理完整示例
export const ProjectManagement: Story = {
  render() {
    const [value, setValue] = useState<any[]>([
      {
        id: '1',
        name: '用户登录功能',
        parentId: 'todo',
        assignee: '张三',
        dueDate: '2024-01-15',
        priority: 'high',
      },
      {
        id: '2',
        name: 'Dashboard 页面',
        parentId: 'todo',
        assignee: '李四',
        dueDate: '2024-01-20',
        priority: 'medium',
      },
      {
        id: '3',
        name: '数据报表',
        parentId: 'in-progress',
        assignee: '张三',
        dueDate: '2024-01-12',
        priority: 'high',
      },
      {
        id: '4',
        name: 'API 接口开发',
        parentId: 'in-progress',
        assignee: '王五',
        dueDate: '2024-01-18',
        priority: 'medium',
      },
      {
        id: '5',
        name: '用户管理',
        parentId: 'testing',
        assignee: '赵六',
        dueDate: '2024-01-10',
        priority: 'low',
      },
      {
        id: '6',
        name: '权限系统',
        parentId: 'done',
        assignee: '李四',
        dueDate: '2024-01-05',
        priority: 'high',
      },
      {
        id: '7',
        name: '通知系统',
        parentId: 'todo',
        assignee: '王五',
        dueDate: '2024-01-25',
        priority: 'low',
      },
      {
        id: '8',
        name: '数据导入导出',
        parentId: 'in-progress',
        assignee: '赵六',
        dueDate: '2024-01-16',
        priority: 'medium',
      },
      {
        id: '9',
        name: '系统日志',
        parentId: 'testing',
        assignee: '张三',
        dueDate: '2024-01-11',
        priority: 'medium',
      },
      {
        id: '10',
        name: '基础架构搭建',
        parentId: 'done',
        assignee: '王五',
        dueDate: '2024-01-02',
        priority: 'high',
      },
    ])
    return (
      <Kanban
        items={[
          { id: 'todo', name: '待办', color: '#6B7280' },
          { id: 'in-progress', name: '进行中', color: '#3B82F6' },
          { id: 'testing', name: '测试中', color: '#F59E0B' },
          { id: 'done', name: '已完成', color: '#10B981' },
        ]}
        fieldNames={{ idKey: 'id', groupKey: 'parentId' }}
        value={value}
        onChange={setValue}
        onItemRender={(item) => (
          <div className='space-y-2 p-3'>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{item.name}</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  item.priority === 'high'
                    ? 'bg-red-500'
                    : item.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
              />
            </div>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span className='flex items-center gap-1'>
                <span className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white'>
                  {item.assignee.charAt(0)}
                </span>
                {item.assignee}
              </span>
              <span>{item.dueDate}</span>
            </div>
          </div>
        )}
      />
    )
  },
}
