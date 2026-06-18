import { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '@/icon'
import { iconNames } from './shared'

const meta = {
  title: 'Base/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      description: '图标',
      options: ['Settings', ...iconNames],
    },
    color: {
      control: 'color',
    },
    size: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

// 默认图标
export const Default: Story = {
  args: {
    name: 'Settings',
  },
}

// 自定义颜色
export const WithColor: Story = {
  args: {
    name: 'Heart',
    color: '#ef4444',
  },
}

// 自定义大小
export const CustomSize: Story = {
  args: {
    name: 'Star',
    size: 32,
  },
}

// 常用图标
export const CommonIcons: Story = {
  render() {
    const icons = [
      'Home',
      'Settings',
      'User',
      'Mail',
      'Bell',
      'Search',
      'Plus',
      'Minus',
      'X',
      'Check',
      'Edit',
      'Trash2',
      'Save',
      'Download',
      'Upload',
      'Copy',
      'Share',
      'Link',
    ]
    return (
      <div className='flex flex-wrap gap-4'>
        {icons.map((name) => (
          <div key={name} className='flex flex-col items-center gap-1'>
            <Icon name={name as any} />
            <span className='text-muted-foreground text-xs'>{name}</span>
          </div>
        ))}
      </div>
    )
  },
}

// 文件类型图标
export const FileIcons: Story = {
  render() {
    const icons = [
      'File',
      'FileText',
      'FileImage',
      'FileVideo',
      'FileAudio',
      'FileCode',
      'FileArchive',
      'Folder',
      'FolderOpen',
    ]
    return (
      <div className='flex flex-wrap gap-4'>
        {icons.map((name) => (
          <div key={name} className='flex flex-col items-center gap-1'>
            <Icon name={name as any} size={24} />
            <span className='text-muted-foreground text-xs'>{name}</span>
          </div>
        ))}
      </div>
    )
  },
}

// 方向图标
export const DirectionIcons: Story = {
  render() {
    const icons = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ChevronUp',
      'ChevronDown',
      'ChevronLeft',
      'ChevronRight',
      'ChevronsUp',
      'ChevronsDown',
      'ChevronsLeft',
      'ChevronsRight',
    ]
    return (
      <div className='flex flex-wrap gap-4'>
        {icons.map((name) => (
          <div key={name} className='flex flex-col items-center gap-1'>
            <Icon name={name as any} />
            <span className='text-muted-foreground text-xs'>{name}</span>
          </div>
        ))}
      </div>
    )
  },
}

// 状态图标
export const StatusIcons: Story = {
  render() {
    const icons = [
      { name: 'Check', color: '#22c55e' },
      { name: 'X', color: '#ef4444' },
      { name: 'AlertTriangle', color: '#f59e0b' },
      { name: 'Info', color: '#3b82f6' },
      { name: 'AlertCircle', color: '#ef4444' },
      { name: 'HelpCircle', color: '#6b7280' },
    ]
    return (
      <div className='flex flex-wrap gap-4'>
        {icons.map(({ name, color }) => (
          <div key={name} className='flex flex-col items-center gap-1'>
            <Icon name={name as any} color={color} size={24} />
            <span className='text-muted-foreground text-xs'>{name}</span>
          </div>
        ))}
      </div>
    )
  },
}

// 不同尺寸
export const DifferentSizes: Story = {
  render() {
    const sizes = [12, 16, 20, 24, 32, 48]
    return (
      <div className='flex items-end gap-4'>
        {sizes.map((size) => (
          <div key={size} className='flex flex-col items-center gap-1'>
            <Icon name='Star' size={size} />
            <span className='text-muted-foreground text-xs'>{size}px</span>
          </div>
        ))}
      </div>
    )
  },
}

// 不同颜色
export const DifferentColors: Story = {
  render() {
    const colors = [
      '#ef4444',
      '#f59e0b',
      '#22c55e',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
    ]
    return (
      <div className='flex gap-4'>
        {colors.map((color) => (
          <div key={color} className='flex flex-col items-center gap-1'>
            <Icon name='Heart' color={color} size={24} />
            <span className='text-muted-foreground text-xs'>{color}</span>
          </div>
        ))}
      </div>
    )
  },
}

// 在按钮中使用
export const InButton: Story = {
  render() {
    return (
      <div className='flex gap-4'>
        <button className='flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white'>
          <Icon name='Plus' size={16} color='white' />
          <span>新建</span>
        </button>
        <button className='flex items-center gap-2 rounded border px-4 py-2'>
          <Icon name='Settings' size={16} />
          <span>设置</span>
        </button>
        <button className='flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white'>
          <Icon name='Trash2' size={16} color='white' />
          <span>删除</span>
        </button>
      </div>
    )
  },
}

// 在列表中使用
export const InList: Story = {
  render() {
    const items = [
      { icon: 'Home', name: '首页' },
      { icon: 'FileText', name: '文档' },
      { icon: 'Settings', name: '设置' },
      { icon: 'User', name: '用户' },
    ]
    return (
      <div className='w-[200px] rounded border'>
        {items.map(({ icon, name }) => (
          <div
            key={name}
            className='flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-100'
          >
            <Icon name={icon as any} size={18} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    )
  },
}
