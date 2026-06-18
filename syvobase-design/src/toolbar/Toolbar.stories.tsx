import { Meta, StoryObj } from '@storybook/react-vite'
import { Toolbar } from '@/toolbar'

const meta = {
  title: 'Base/Toolbar',
  component: Toolbar,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'link', 'destructive'],
    },
    onlyIcon: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {},
} satisfies Meta<typeof Toolbar>

export default meta

type Story = StoryObj<typeof meta>

// 默认工具栏
export const Default: Story = {
  args: {
    items: [{ name: '保存' }, { name: '编辑' }, { name: '删除' }],
  },
}

// 带图标的按钮
export const WithIcons: Story = {
  args: {
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑' },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

// 仅图标模式
export const OnlyIcon: Story = {
  args: {
    onlyIcon: true,
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑' },
      { icon: 'Trash2', name: '删除' },
      { icon: 'Settings', name: '设置' },
    ],
  },
}

// 左中右布局
export const LeftCenterRight: Story = {
  args: {
    left: [{ icon: 'Menu', name: '菜单' }],
    items: [{ name: '首页' }, { name: '文档' }, { name: '组件' }],
    right: [
      { icon: 'User', name: '用户' },
      { icon: 'Settings', name: '设置' },
    ],
  },
}

// 仅左侧
export const LeftOnly: Story = {
  args: {
    left: [{ icon: 'ArrowLeft', name: '返回' }, { name: '首页' }],
  },
}

// 仅右侧
export const RightOnly: Story = {
  args: {
    right: [
      { icon: 'Search', name: '搜索' },
      { icon: 'Bell', name: '通知' },
      { icon: 'User', name: '用户' },
    ],
  },
}

// 带下拉菜单
export const WithDropdown: Story = {
  args: {
    items: [
      { name: '文件' },
      { name: '编辑' },
      {
        name: '更多',
        items: [{ name: '导出' }, { name: '打印' }, { name: '分享' }],
      },
    ],
  },
}

// 不同按钮类型
export const ButtonTypes: Story = {
  args: {
    type: 'ghost',
    items: [
      { icon: 'Bold', name: '加粗' },
      { icon: 'Italic', name: '斜体' },
      { icon: 'Underline', name: '下划线' },
    ],
  },
}

// 不同尺寸
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑' },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

export const SizeLarge: Story = {
  args: {
    size: 'lg',
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑' },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

// 圆角按钮
export const RoundedButtons: Story = {
  args: {
    rounded: true,
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑' },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑' },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

// 混合禁用
export const MixedDisabled: Story = {
  args: {
    items: [
      { icon: 'Save', name: '保存' },
      { icon: 'Edit', name: '编辑', disabled: true },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

// 文本编辑器工具栏
export const TextEditorToolbar: Story = {
  args: {
    type: 'ghost',
    onlyIcon: true,
    size: 'sm',
    left: [
      { icon: 'Undo', name: '撤销' },
      { icon: 'Redo', name: '重做' },
    ],
    items: [
      { icon: 'Bold', name: '加粗' },
      { icon: 'Italic', name: '斜体' },
      { icon: 'Underline', name: '下划线' },
      { icon: 'Strikethrough', name: '删除线' },
      { icon: 'AlignLeft', name: '左对齐' },
      { icon: 'AlignCenter', name: '居中' },
      { icon: 'AlignRight', name: '右对齐' },
      { icon: 'List', name: '无序列表' },
      { icon: 'ListOrdered', name: '有序列表' },
    ],
    right: [
      { icon: 'Link', name: '链接' },
      { icon: 'Image', name: '图片' },
    ],
  },
}

// 文件操作工具栏
export const FileOperationsToolbar: Story = {
  args: {
    left: [
      { icon: 'File', name: '新建' },
      { icon: 'FolderOpen', name: '打开' },
      { icon: 'Save', name: '保存' },
    ],
    right: [
      { icon: 'Download', name: '下载' },
      { icon: 'Upload', name: '上传' },
      {
        icon: 'MoreHorizontal',
        name: '更多',
        items: [{ name: '导出PDF' }, { name: '导出Word' }, { name: '打印' }],
      },
    ],
  },
}

// 表格操作工具栏
export const TableToolbar: Story = {
  args: {
    left: [
      { icon: 'Plus', name: '新增', type: 'default' },
      { icon: 'Trash2', name: '删除', type: 'destructive' },
    ],
    right: [
      { icon: 'Filter', name: '筛选' },
      { icon: 'Download', name: '导出' },
      { icon: 'RefreshCw', name: '刷新' },
    ],
  },
}

// 内联模式
export const InlineMode: Story = {
  args: {
    inlineMode: true,
    type: 'ghost',
    onlyIcon: true,
    size: 'sm',
    items: [
      { icon: 'Edit', name: '编辑' },
      { icon: 'Copy', name: '复制' },
      { icon: 'Trash2', name: '删除' },
    ],
  },
}

// 完整模式
export const FullMode: Story = {
  args: {
    fullMode: true,
    items: [
      { name: '首页' },
      { name: '产品' },
      { name: '关于' },
      { name: '联系我们' },
    ],
  },
}

// 复杂示例 - 应用头部
export const AppHeader: Story = {
  render() {
    return (
      <div className='border-b p-2'>
        <Toolbar
          left={[
            { icon: 'Menu', name: '菜单', type: 'ghost', onlyIcon: true },
            { name: 'NocoKit', type: 'link' },
          ]}
          items={[
            { name: '首页' },
            { name: '文档' },
            {
              name: '组件',
              items: [
                { name: '基础组件' },
                { name: '表单组件' },
                { name: '布局组件' },
              ],
            },
            { name: '示例' },
          ]}
          right={[
            { icon: 'Search', name: '搜索', type: 'ghost', onlyIcon: true },
            { icon: 'Github', name: 'GitHub', type: 'ghost', onlyIcon: true },
            { name: '登录' },
          ]}
          type='ghost'
        />
      </div>
    )
  },
}
