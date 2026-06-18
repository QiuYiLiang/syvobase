import { Meta, StoryObj } from '@storybook/react-vite'
import { TagGroup } from '@/tagGroup'

const meta = {
  title: 'Base/TagGroup',
  component: TagGroup,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    rounded: {
      control: 'boolean',
    },
    border: {
      control: 'boolean',
    },
    noStyle: {
      control: 'boolean',
    },
  },
  args: {},
} satisfies Meta<typeof TagGroup>

export default meta

type Story = StoryObj<typeof meta>

// 默认标签组
export const Default: Story = {
  args: {
    value: ['前端', '后端', '设计'],
  },
}

// 更多标签
export const MoreTags: Story = {
  args: {
    value: [
      'JavaScript',
      'TypeScript',
      'React',
      'Vue',
      'Angular',
      'Node.js',
      'Python',
      'Go',
    ],
  },
}

// 圆角标签
export const Rounded: Story = {
  args: {
    value: ['标签1', '标签2', '标签3', '标签4'],
    rounded: true,
  },
}

// 带边框
export const WithBorder: Story = {
  args: {
    value: ['标签1', '标签2', '标签3'],
    border: true,
  },
}

// 无样式（纯文本）
export const NoStyle: Story = {
  args: {
    value: ['苹果', '香蕉', '橙子', '葡萄'],
    noStyle: true,
  },
}

// 小尺寸
export const SizeSmall: Story = {
  args: {
    value: ['小标签1', '小标签2', '小标签3'],
    size: 'sm',
  },
}

// 大尺寸
export const SizeLarge: Story = {
  args: {
    value: ['大标签1', '大标签2', '大标签3'],
    size: 'lg',
  },
}

// 自定义颜色
export const CustomColors: Story = {
  args: {
    value: [
      { name: '待处理', color: 'orange' },
      { name: '进行中', color: 'blue' },
      { name: '已完成', color: 'green' },
      { name: '已关闭', color: 'gray' },
    ],
    getName: (item: any) => item.name,
    getColor: (item: any) => item.color,
  },
}

// 带图标
export const WithIcons: Story = {
  args: {
    value: [
      { name: 'GitHub', icon: 'Github' },
      { name: '设置', icon: 'Settings' },
      { name: '用户', icon: 'User' },
      { name: '消息', icon: 'Mail' },
    ],
    getName: (item: any) => item.name,
    getIcon: (item: any) => item.icon,
  },
}

// 状态标签
export const StatusTags: Story = {
  args: {
    value: [
      { name: '成功', color: 'green', icon: 'Check' },
      { name: '警告', color: 'orange', icon: 'AlertTriangle' },
      { name: '错误', color: 'red', icon: 'X' },
      { name: '信息', color: 'blue', icon: 'Info' },
    ],
    getName: (item: any) => item.name,
    getColor: (item: any) => item.color,
    getIcon: (item: any) => item.icon,
    rounded: true,
  },
}

// 技能标签
export const SkillTags: Story = {
  args: {
    value: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    rounded: true,
    size: 'sm',
  },
}

// 分类标签
export const CategoryTags: Story = {
  args: {
    value: [
      { name: '技术', color: 'blue' },
      { name: '生活', color: 'green' },
      { name: '工作', color: 'purple' },
      { name: '学习', color: 'orange' },
    ],
    getName: (item: any) => item.name,
    getColor: (item: any) => item.color,
    border: true,
  },
}

// 所有尺寸对比
export const AllSizes: Story = {
  render() {
    const tags = ['标签A', '标签B', '标签C']
    return (
      <div className='flex flex-col gap-4'>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>Small (sm):</div>
          <TagGroup value={tags} size='sm' />
        </div>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>Default:</div>
          <TagGroup value={tags} size='default' />
        </div>
        <div>
          <div className='text-muted-foreground mb-1 text-sm'>Large (lg):</div>
          <TagGroup value={tags} size='lg' />
        </div>
      </div>
    )
  },
}

// 文章标签
export const ArticleTags: Story = {
  render() {
    return (
      <div className='max-w-md rounded-lg border p-4'>
        <h3 className='mb-2 font-bold'>如何构建现代化的前端应用</h3>
        <p className='text-muted-foreground mb-3 text-sm'>
          本文介绍了使用 React 和 TypeScript 构建企业级应用的最佳实践...
        </p>
        <TagGroup
          value={['React', 'TypeScript', '前端架构', '最佳实践']}
          size='sm'
          rounded
        />
      </div>
    )
  },
}

// 用户技能展示
export const UserSkills: Story = {
  render() {
    return (
      <div className='max-w-md rounded-lg border p-4'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold text-white'>
            JD
          </div>
          <div>
            <div className='font-bold'>John Doe</div>
            <div className='text-muted-foreground text-sm'>全栈开发工程师</div>
          </div>
        </div>
        <TagGroup
          value={[
            { name: 'React', color: 'blue' },
            { name: 'Node.js', color: 'green' },
            { name: 'TypeScript', color: 'blue' },
            { name: 'PostgreSQL', color: 'cyan' },
            { name: 'Docker', color: 'cyan' },
          ]}
          getName={(item: any) => item.name}
          getColor={(item: any) => item.color}
          size='sm'
        />
      </div>
    )
  },
}
