import { Meta, StoryObj } from '@storybook/react-vite'
import { Mindmap } from '@/mindmap'
import { useState } from 'react'
import { MindmapData } from './types'

const meta = {
  title: 'Input/Mindmap',
  component: Mindmap,
  argTypes: {
    readMode: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    direction: {
      control: 'select',
      options: ['right', 'left', 'both'],
    },
    showToolbar: {
      control: 'boolean',
    },
  },
  args: {
    direction: 'right',
    showToolbar: true,
  },
} satisfies Meta<typeof Mindmap>

export default meta

type Story = StoryObj<typeof meta>

// 默认思维导图
export const Default: Story = {
  render() {
    const [value, setValue] = useState<MindmapData | null>(null)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        style={{ width: 800, height: 500 }}
      />
    )
  },
}

// 带初始数据
export const WithInitialData: Story = {
  render() {
    const initialData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: '项目计划',
        expanded: true,
        children: [
          {
            id: 'sub1',
            topic: '需求分析',
            expanded: true,
            children: [
              { id: 'sub1-1', topic: '用户调研', expanded: true },
              { id: 'sub1-2', topic: '竞品分析', expanded: true },
            ],
          },
          {
            id: 'sub2',
            topic: '技术方案',
            expanded: true,
            children: [
              { id: 'sub2-1', topic: '架构设计', expanded: true },
              { id: 'sub2-2', topic: '技术选型', expanded: true },
            ],
          },
          {
            id: 'sub3',
            topic: '开发实施',
            expanded: true,
            children: [
              { id: 'sub3-1', topic: '前端开发', expanded: true },
              { id: 'sub3-2', topic: '后端开发', expanded: true },
            ],
          },
        ],
      },
    }
    const [value, setValue] = useState<MindmapData | null>(initialData)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        style={{ width: 900, height: 500 }}
      />
    )
  },
}

// 双向布局
export const BothDirection: Story = {
  render() {
    const initialData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: '中心主题',
        expanded: true,
        children: [
          {
            id: 'left1',
            topic: '左侧分支1',
            expanded: true,
            children: [{ id: 'left1-1', topic: '子节点', expanded: true }],
          },
          {
            id: 'left2',
            topic: '左侧分支2',
            expanded: true,
          },
          {
            id: 'right1',
            topic: '右侧分支1',
            expanded: true,
            children: [{ id: 'right1-1', topic: '子节点', expanded: true }],
          },
          {
            id: 'right2',
            topic: '右侧分支2',
            expanded: true,
          },
        ],
      },
    }
    const [value, setValue] = useState<MindmapData | null>(initialData)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        direction='both'
        style={{ width: 900, height: 500 }}
      />
    )
  },
}

// 只读模式
export const ReadMode: Story = {
  render() {
    const initialData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: '产品功能',
        expanded: true,
        children: [
          {
            id: 'sub1',
            topic: '用户管理',
            expanded: true,
            children: [
              { id: 'sub1-1', topic: '注册登录', expanded: true },
              { id: 'sub1-2', topic: '权限控制', expanded: true },
            ],
          },
          {
            id: 'sub2',
            topic: '内容管理',
            expanded: true,
            children: [
              { id: 'sub2-1', topic: '文章发布', expanded: true },
              { id: 'sub2-2', topic: '评论系统', expanded: true },
            ],
          },
        ],
      },
    }
    return (
      <Mindmap
        readMode
        value={initialData}
        style={{ width: 800, height: 400 }}
      />
    )
  },
}

// 禁用模式
export const Disabled: Story = {
  render() {
    const initialData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: '禁用状态',
        expanded: true,
        children: [
          { id: 'sub1', topic: '子节点1', expanded: true },
          { id: 'sub2', topic: '子节点2', expanded: true },
        ],
      },
    }
    return (
      <Mindmap
        disabled
        value={initialData}
        style={{ width: 800, height: 400 }}
      />
    )
  },
}

// 受控模式
export const Controlled: Story = {
  render() {
    const [value, setValue] = useState<MindmapData | null>({
      nodeData: {
        id: 'root',
        topic: '中心主题',
        expanded: true,
        children: [
          { id: 'sub1', topic: '分支1', expanded: true },
          { id: 'sub2', topic: '分支2', expanded: true },
        ],
      },
    })
    return (
      <div className='flex flex-col gap-4'>
        <Mindmap
          value={value}
          onChange={setValue}
          style={{ width: 800, height: 400 }}
        />
        <div className='bg-muted rounded-lg p-3'>
          <div className='mb-2 text-sm font-medium'>当前数据:</div>
          <pre className='text-muted-foreground max-h-40 overflow-auto text-xs'>
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

// 无工具栏模式
export const NoToolbar: Story = {
  render() {
    const [value, setValue] = useState<MindmapData | null>({
      nodeData: {
        id: 'root',
        topic: '简洁模式',
        expanded: true,
        children: [
          { id: 'sub1', topic: '子节点1', expanded: true },
          { id: 'sub2', topic: '子节点2', expanded: true },
        ],
      },
    })
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        showToolbar={false}
        style={{ width: 800, height: 400 }}
      />
    )
  },
}

// 大尺寸
export const LargeSize: Story = {
  render() {
    const [value, setValue] = useState<MindmapData | null>(null)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        style={{ width: '100%', height: 600 }}
      />
    )
  },
}

// 学习笔记示例
export const StudyNotes: Story = {
  render() {
    const notesData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: 'JavaScript 学习',
        expanded: true,
        children: [
          {
            id: 'basics',
            topic: '基础语法',
            expanded: true,
            children: [
              { id: 'b1', topic: '变量声明', expanded: true },
              { id: 'b2', topic: '数据类型', expanded: true },
              { id: 'b3', topic: '运算符', expanded: true },
            ],
          },
          {
            id: 'functions',
            topic: '函数',
            expanded: true,
            children: [
              { id: 'f1', topic: '函数声明', expanded: true },
              { id: 'f2', topic: '箭头函数', expanded: true },
              { id: 'f3', topic: '闭包', expanded: true },
            ],
          },
          {
            id: 'async',
            topic: '异步编程',
            expanded: true,
            children: [
              { id: 'a1', topic: 'Promise', expanded: true },
              { id: 'a2', topic: 'async/await', expanded: true },
              { id: 'a3', topic: '事件循环', expanded: true },
            ],
          },
          {
            id: 'dom',
            topic: 'DOM操作',
            expanded: true,
            children: [
              { id: 'd1', topic: '选择器', expanded: true },
              { id: 'd2', topic: '事件处理', expanded: true },
              { id: 'd3', topic: '动态修改', expanded: true },
            ],
          },
        ],
      },
    }
    const [value, setValue] = useState<MindmapData | null>(notesData)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        style={{ width: 1000, height: 600 }}
      />
    )
  },
}

// 项目规划示例
export const ProjectPlanning: Story = {
  render() {
    const projectData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: '🚀 产品开发',
        expanded: true,
        children: [
          {
            id: 'phase1',
            topic: '📋 第一阶段: 规划',
            expanded: true,
            children: [
              { id: 'p1-1', topic: '需求调研', expanded: true },
              { id: 'p1-2', topic: '竞品分析', expanded: true },
              { id: 'p1-3', topic: '技术评估', expanded: true },
            ],
          },
          {
            id: 'phase2',
            topic: '🎨 第二阶段: 设计',
            expanded: true,
            children: [
              { id: 'p2-1', topic: 'UI/UX设计', expanded: true },
              { id: 'p2-2', topic: '架构设计', expanded: true },
              { id: 'p2-3', topic: '数据库设计', expanded: true },
            ],
          },
          {
            id: 'phase3',
            topic: '💻 第三阶段: 开发',
            expanded: true,
            children: [
              { id: 'p3-1', topic: '前端开发', expanded: true },
              { id: 'p3-2', topic: '后端开发', expanded: true },
              { id: 'p3-3', topic: '接口联调', expanded: true },
            ],
          },
          {
            id: 'phase4',
            topic: '🧪 第四阶段: 测试',
            expanded: true,
            children: [
              { id: 'p4-1', topic: '单元测试', expanded: true },
              { id: 'p4-2', topic: '集成测试', expanded: true },
              { id: 'p4-3', topic: '用户测试', expanded: true },
            ],
          },
          {
            id: 'phase5',
            topic: '🚀 第五阶段: 发布',
            expanded: true,
            children: [
              { id: 'p5-1', topic: '部署上线', expanded: true },
              { id: 'p5-2', topic: '监控运维', expanded: true },
              { id: 'p5-3', topic: '用户反馈', expanded: true },
            ],
          },
        ],
      },
    }
    const [value, setValue] = useState<MindmapData | null>(projectData)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        direction='both'
        style={{ width: 1100, height: 650 }}
      />
    )
  },
}

// 测试折叠按钮
export const WithCollapsedNodes: Story = {
  render() {
    const initialData: MindmapData = {
      nodeData: {
        id: 'root',
        topic: '中心主题',
        expanded: true,
        children: [
          {
            id: 'sub1',
            topic: '展开的节点',
            expanded: true,
            children: [
              { id: 'sub1-1', topic: '子节点1', expanded: true },
              { id: 'sub1-2', topic: '子节点2', expanded: true },
            ],
          },
          {
            id: 'sub2',
            topic: '折叠的节点',
            expanded: false,
            children: [
              { id: 'sub2-1', topic: '隐藏子节点1', expanded: true },
              { id: 'sub2-2', topic: '隐藏子节点2', expanded: true },
              { id: 'sub2-3', topic: '隐藏子节点3', expanded: true },
            ],
          },
          {
            id: 'sub3',
            topic: '另一个展开节点',
            expanded: true,
          },
        ],
      },
    }
    const [value, setValue] = useState<MindmapData | null>(initialData)
    return (
      <Mindmap
        value={value}
        onChange={setValue}
        style={{ width: 900, height: 500 }}
      />
    )
  },
}
