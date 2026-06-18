import { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '@/panel'

const meta = {
  title: 'Layout/Panel',
  component: Panel,
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'card'],
    },
    border: {
      control: 'boolean',
    },
    fixed: {
      control: 'boolean',
    },
    disabledContentPadding: {
      control: 'boolean',
    },
  },
  args: {},
} satisfies Meta<typeof Panel>

export default meta

type Story = StoryObj<typeof meta>

// 默认面板
export const Default: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    header: '面板标题',
    children: '这里是面板内容区域',
  },
}

// 带头部和底部
export const WithHeaderAndFooter: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    header: '面板标题',
    footer: '底部信息',
    children: '这里是面板内容区域',
  },
}

// 带工具栏
export const WithToolbar: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    header: '用户管理',
    toolbar: {
      right: [
        { name: '取消', type: 'secondary' },
        { name: '保存', type: 'primary' },
      ],
    },
    children: (
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>用户名</label>
          <input
            className='w-full rounded border px-3 py-2'
            placeholder='请输入用户名'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>邮箱</label>
          <input
            className='w-full rounded border px-3 py-2'
            placeholder='请输入邮箱'
          />
        </div>
      </div>
    ),
  },
}

// 带顶部工具栏
export const WithTopToolbar: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    topToolbar: {
      left: [{ name: '标题', type: 'ghost' }],
      right: [
        { icon: 'Settings', onlyIcon: true, type: 'ghost' },
        { icon: 'X', onlyIcon: true, type: 'ghost' },
      ],
    },
    children: '面板内容',
  },
}

// 带边框分隔
export const WithBorder: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    border: true,
    header: '带边框面板',
    toolbar: [{ name: '确定' }, { name: '取消' }],
    children: '头部和底部有边框分隔线',
  },
}

// 默认类型（无卡片样式）
export const TypeDefault: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'default',
    header: '默认类型',
    children: '没有卡片边框和背景',
  },
}

// 自定义内边距
export const CustomPadding: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    padding: 24,
    header: '大内边距',
    children: '内边距为 24px',
  },
}

// 禁用内容内边距
export const DisabledContentPadding: Story = {
  args: {
    style: { width: 500, height: 400 },
    type: 'card',
    header: '无内容内边距',
    disabledContentPadding: true,
    children: (
      <div className='flex h-full items-center justify-center bg-blue-50'>
        内容区域无内边距
      </div>
    ),
  },
}

// 自定义宽度
export const CustomWidth: Story = {
  args: {
    style: { height: 300 },
    type: 'card',
    width: 300,
    header: '固定宽度',
    children: '内容宽度固定为 300px',
  },
}

// 非固定高度
export const NotFixed: Story = {
  args: {
    style: { width: 500 },
    type: 'card',
    fixed: false,
    header: '非固定高度',
    children: (
      <div>
        <p>面板高度由内容决定</p>
        <p>不会固定高度</p>
        <p>内容多少，面板多高</p>
      </div>
    ),
  },
}

// 设置对话框
export const SettingsDialog: Story = {
  args: {
    style: { width: 500, height: 500 },
    type: 'card',
    header: '设置',
    border: true,
    toolbar: {
      right: [
        { name: '取消', type: 'secondary' },
        { name: '保存', type: 'primary' },
      ],
    },
    children: (
      <div className='space-y-6'>
        <div>
          <h3 className='mb-3 font-medium'>通用设置</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span>启用通知</span>
              <input type='checkbox' defaultChecked />
            </div>
            <div className='flex items-center justify-between'>
              <span>深色模式</span>
              <input type='checkbox' />
            </div>
          </div>
        </div>
        <div>
          <h3 className='mb-3 font-medium'>语言</h3>
          <select className='w-full rounded border px-3 py-2'>
            <option>简体中文</option>
            <option>English</option>
          </select>
        </div>
      </div>
    ),
  },
}

// 详情页面
export const DetailPage: Story = {
  args: {
    style: { width: 600, height: 500 },
    type: 'card',
    topToolbar: {
      left: [
        { icon: 'ArrowLeft', name: '返回', type: 'ghost' },
        { name: '用户详情', type: 'ghost' },
      ],
      right: [
        { icon: 'Edit', name: '编辑', type: 'ghost' },
        { icon: 'Trash2', name: '删除', type: 'ghost' },
      ],
    },
    children: (
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl text-white'>
            JD
          </div>
          <div>
            <div className='text-xl font-bold'>John Doe</div>
            <div className='text-muted-foreground'>john@example.com</div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-muted-foreground text-sm'>部门</div>
            <div>技术部</div>
          </div>
          <div>
            <div className='text-muted-foreground text-sm'>职位</div>
            <div>高级工程师</div>
          </div>
          <div>
            <div className='text-muted-foreground text-sm'>入职日期</div>
            <div>2023-01-01</div>
          </div>
          <div>
            <div className='text-muted-foreground text-sm'>状态</div>
            <div className='text-green-600'>在职</div>
          </div>
        </div>
      </div>
    ),
  },
}

// 嵌套面板
export const NestedPanels: Story = {
  render() {
    return (
      <Panel style={{ width: 600, height: 500 }} type='card' header='外层面板'>
        <div className='grid grid-cols-2 gap-4'>
          <Panel type='card' header='子面板 1'>
            <div className='text-sm'>子面板内容 1</div>
          </Panel>
          <Panel type='card' header='子面板 2'>
            <div className='text-sm'>子面板内容 2</div>
          </Panel>
        </div>
      </Panel>
    )
  },
}
