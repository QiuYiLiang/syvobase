import { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenu } from '@/contextMenu'

const meta = {
  title: 'API/ContextMenu',
  component: ContextMenu,
  argTypes: {},
  args: {},
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

// 默认右键菜单
export const Default: Story = {
  args: {
    items: [
      { type: 'label', name: '操作菜单' },
      {
        icon: 'Settings',
        name: '设置',
        onClick: () => console.log('设置'),
      },
      {
        type: 'separator',
      },
      {
        icon: 'House',
        name: '首页',
        items: [{ name: '子菜单1' }, { icon: 'Settings', name: '子菜单2' }],
      },
    ],
    children: (
      <div className='border-border flex h-48 w-96 items-center justify-center rounded-lg border'>
        右键点击此区域
      </div>
    ),
  },
}

// 文件操作菜单
export const FileOperations: Story = {
  args: {
    items: [
      { type: 'label', name: '文件操作' },
      { icon: 'FilePlus', name: '新建文件' },
      { icon: 'FolderPlus', name: '新建文件夹' },
      { type: 'separator' },
      { icon: 'Copy', name: '复制' },
      { icon: 'Scissors', name: '剪切' },
      { icon: 'Clipboard', name: '粘贴' },
      { type: 'separator' },
      { icon: 'Trash2', name: '删除' },
    ],
    children: (
      <div className='border-border flex h-48 w-96 items-center justify-center rounded-lg border'>
        文件操作菜单 - 右键点击
      </div>
    ),
  },
}

// 多级子菜单
export const NestedSubMenu: Story = {
  args: {
    items: [
      { type: 'label', name: '导航菜单' },
      {
        icon: 'FileText',
        name: '文档',
        items: [
          { name: '新建文档' },
          { name: '打开文档' },
          {
            name: '最近文档',
            items: [
              { name: '文档1.docx' },
              { name: '文档2.docx' },
              { name: '文档3.docx' },
            ],
          },
        ],
      },
      {
        icon: 'Settings',
        name: '设置',
        items: [
          { name: '用户设置' },
          { name: '系统设置' },
          {
            name: '高级设置',
            items: [{ name: '性能优化' }, { name: '安全设置' }],
          },
        ],
      },
      { type: 'separator' },
      { icon: 'HelpCircle', name: '帮助' },
    ],
    children: (
      <div className='border-border flex h-48 w-96 items-center justify-center rounded-lg border'>
        多级子菜单 - 右键点击
      </div>
    ),
  },
}

// 编辑器菜单
export const EditorMenu: Story = {
  args: {
    items: [
      { icon: 'Undo', name: '撤销' },
      { icon: 'Redo', name: '重做' },
      { type: 'separator' },
      { icon: 'Copy', name: '复制' },
      { icon: 'Scissors', name: '剪切' },
      { icon: 'Clipboard', name: '粘贴' },
      { type: 'separator' },
      { icon: 'Search', name: '查找' },
      { icon: 'Replace', name: '替换' },
      { type: 'separator' },
      {
        icon: 'AlignLeft',
        name: '格式',
        items: [
          { icon: 'Bold', name: '粗体' },
          { icon: 'Italic', name: '斜体' },
          { icon: 'Underline', name: '下划线' },
        ],
      },
    ],
    children: (
      <div className='border-border flex h-48 w-96 items-center justify-center rounded-lg border'>
        编辑器菜单 - 右键点击
      </div>
    ),
  },
}

// 条件显示菜单项
export const ConditionalItems: Story = {
  args: {
    items: [
      { name: '总是显示' },
      { name: '条件显示', visible: () => true },
      { name: '隐藏项', visible: () => false },
      { type: 'separator' },
      { name: '另一个显示项' },
    ],
    children: (
      <div className='border-border flex h-48 w-96 items-center justify-center rounded-lg border'>
        条件显示菜单项 - 右键点击
      </div>
    ),
  },
}

// 表格行右键菜单
export const TableRowMenu: Story = {
  args: {
    items: [
      { icon: 'Eye', name: '查看详情' },
      { icon: 'Edit', name: '编辑' },
      { type: 'separator' },
      { icon: 'Copy', name: '复制行' },
      { icon: 'ArrowUp', name: '上移' },
      { icon: 'ArrowDown', name: '下移' },
      { type: 'separator' },
      { icon: 'Trash2', name: '删除' },
    ],
    children: (
      <div className='border-border bg-secondary flex h-12 w-96 items-center justify-center rounded border'>
        表格行 - 右键点击
      </div>
    ),
  },
}
