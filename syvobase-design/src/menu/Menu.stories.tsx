import { Meta, StoryObj } from '@storybook/react-vite'

import { Menu } from '@/menu'
import { useState } from 'react'

const meta = {
  title: 'Layout/Menu',
  component: Menu,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    mode: {
      control: 'select',
      options: ['inline', 'horizontal', 'vertical'],
    },
    enabledSearch: {
      control: 'boolean',
    },
  },
  args: {},
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

// 默认菜单
export const Default: Story = {
  args: {
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'components', name: '组件', icon: 'Package' },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
}

// 带子菜单
export const WithChildren: Story = {
  args: {
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      {
        id: 'products',
        name: '产品',
        icon: 'Package',
        children: [
          { id: 'product-list', name: '产品列表' },
          { id: 'product-add', name: '添加产品' },
          { id: 'product-category', name: '产品分类' },
        ],
      },
      {
        id: 'users',
        name: '用户',
        icon: 'Users',
        children: [
          { id: 'user-list', name: '用户列表' },
          { id: 'user-roles', name: '角色管理' },
        ],
      },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
}

// 多层嵌套（4层以上）
export const DeepNested: Story = {
  args: {
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
      {
        id: 'system',
        name: '系统管理',
        icon: 'Settings',
        children: [
          { id: 'system-overview', name: '系统概览' },
          {
            id: 'user-management',
            name: '用户管理',
            children: [
              { id: 'user-list', name: '用户列表' },
              { id: 'user-add', name: '添加用户' },
              {
                id: 'user-group',
                name: '用户分组',
                children: [
                  { id: 'group-list', name: '分组列表' },
                  { id: 'group-add', name: '添加分组' },
                  {
                    id: 'group-settings',
                    name: '分组设置',
                    children: [
                      { id: 'group-permissions', name: '分组权限' },
                      { id: 'group-members', name: '成员管理' },
                      { id: 'group-audit', name: '审计日志' },
                    ],
                  },
                ],
              },
              { id: 'user-import', name: '批量导入' },
            ],
          },
          {
            id: 'role-management',
            name: '角色管理',
            children: [
              { id: 'role-list', name: '角色列表' },
              { id: 'role-add', name: '添加角色' },
              {
                id: 'role-permissions',
                name: '权限配置',
                children: [
                  { id: 'perm-menu', name: '菜单权限' },
                  { id: 'perm-data', name: '数据权限' },
                  { id: 'perm-api', name: '接口权限' },
                ],
              },
            ],
          },
          { id: 'system-log', name: '系统日志' },
        ],
      },
      {
        id: 'content',
        name: '内容管理',
        icon: 'FileText',
        children: [
          { id: 'article-list', name: '文章列表' },
          {
            id: 'article-category',
            name: '文章分类',
            children: [
              { id: 'category-list', name: '分类列表' },
              { id: 'category-add', name: '添加分类' },
              {
                id: 'category-settings',
                name: '分类设置',
                children: [
                  { id: 'category-seo', name: 'SEO设置' },
                  { id: 'category-template', name: '模板配置' },
                ],
              },
            ],
          },
          { id: 'article-tags', name: '标签管理' },
        ],
      },
      { id: 'analytics', name: '数据分析', icon: 'BarChart3' },
      { id: 'about', name: '关于', icon: 'Info' },
    ],
  },
}

// 带徽标
export const WithBadge: Story = {
  args: {
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'inbox', name: '收件箱', icon: 'Mail', count: 12 },
      { id: 'notifications', name: '通知', icon: 'Bell', count: 5 },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
}

// 水平菜单
export const Horizontal: Story = {
  args: {
    mode: 'horizontal',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'components', name: '组件', icon: 'Package' },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
  decorators: [
    (Story) => (
      <div className='border-border h-12 w-full overflow-visible rounded border'>
        <Story />
      </div>
    ),
  ],
}

// 水平菜单带子菜单
export const HorizontalWithChildren: Story = {
  args: {
    mode: 'horizontal',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      {
        id: 'products',
        name: '产品',
        icon: 'Package',
        children: [
          { id: 'product-list', name: '产品列表' },
          { id: 'product-add', name: '添加产品' },
          { id: 'product-category', name: '产品分类' },
        ],
      },
      {
        id: 'users',
        name: '用户',
        icon: 'Users',
        children: [
          { id: 'user-list', name: '用户列表' },
          { id: 'user-roles', name: '角色管理' },
        ],
      },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
  decorators: [
    (Story) => (
      <div className='border-border h-12 w-full overflow-visible rounded border'>
        <Story />
      </div>
    ),
  ],
}

// 水平菜单多级嵌套（4层以上）
export const HorizontalDeepNested: Story = {
  args: {
    mode: 'horizontal',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
      {
        id: 'system',
        name: '系统管理',
        icon: 'Settings',
        children: [
          { id: 'system-overview', name: '系统概览' },
          {
            id: 'user-management',
            name: '用户管理',
            children: [
              { id: 'user-list', name: '用户列表' },
              { id: 'user-add', name: '添加用户' },
              {
                id: 'user-group',
                name: '用户分组',
                children: [
                  { id: 'group-list', name: '分组列表' },
                  { id: 'group-add', name: '添加分组' },
                  {
                    id: 'group-settings',
                    name: '分组设置',
                    children: [
                      { id: 'group-permissions', name: '分组权限' },
                      { id: 'group-members', name: '成员管理' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'role-management',
            name: '角色管理',
            children: [
              { id: 'role-list', name: '角色列表' },
              {
                id: 'role-permissions',
                name: '权限配置',
                children: [
                  { id: 'perm-menu', name: '菜单权限' },
                  { id: 'perm-data', name: '数据权限' },
                ],
              },
            ],
          },
          { id: 'system-log', name: '系统日志' },
        ],
      },
      {
        id: 'content',
        name: '内容',
        icon: 'FileText',
        children: [
          { id: 'article-list', name: '文章列表' },
          {
            id: 'article-category',
            name: '文章分类',
            children: [
              { id: 'category-list', name: '分类列表' },
              { id: 'category-add', name: '添加分类' },
            ],
          },
        ],
      },
      { id: 'about', name: '关于', icon: 'Info' },
    ],
  },
  decorators: [
    (Story) => (
      <div className='border-border h-12 w-full overflow-visible rounded border'>
        <Story />
      </div>
    ),
  ],
}

// 垂直悬浮菜单
export const Vertical: Story = {
  args: {
    mode: 'vertical',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      {
        id: 'products',
        name: '产品',
        icon: 'Package',
        children: [
          { id: 'product-list', name: '产品列表' },
          { id: 'product-add', name: '添加产品' },
          { id: 'product-category', name: '产品分类' },
        ],
      },
      {
        id: 'users',
        name: '用户',
        icon: 'Users',
        children: [
          { id: 'user-list', name: '用户列表' },
          { id: 'user-roles', name: '角色管理' },
        ],
      },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
  decorators: [
    (Story) => (
      <div className='border-border h-[300px] w-[200px] overflow-visible rounded border'>
        <Story />
      </div>
    ),
  ],
}

// 垂直菜单多级嵌套（4层以上）
export const VerticalDeepNested: Story = {
  args: {
    mode: 'vertical',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
      {
        id: 'system',
        name: '系统管理',
        icon: 'Settings',
        children: [
          { id: 'system-overview', name: '系统概览' },
          {
            id: 'user-management',
            name: '用户管理',
            children: [
              { id: 'user-list', name: '用户列表' },
              { id: 'user-add', name: '添加用户' },
              {
                id: 'user-group',
                name: '用户分组',
                children: [
                  { id: 'group-list', name: '分组列表' },
                  { id: 'group-add', name: '添加分组' },
                  {
                    id: 'group-settings',
                    name: '分组设置',
                    children: [
                      { id: 'group-permissions', name: '分组权限' },
                      { id: 'group-members', name: '成员管理' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'role-management',
            name: '角色管理',
            children: [
              { id: 'role-list', name: '角色列表' },
              {
                id: 'role-permissions',
                name: '权限配置',
                children: [
                  { id: 'perm-menu', name: '菜单权限' },
                  { id: 'perm-data', name: '数据权限' },
                ],
              },
            ],
          },
          { id: 'system-log', name: '系统日志' },
        ],
      },
      {
        id: 'content',
        name: '内容管理',
        icon: 'FileText',
        children: [
          { id: 'article-list', name: '文章列表' },
          {
            id: 'article-category',
            name: '文章分类',
            children: [
              { id: 'category-list', name: '分类列表' },
              { id: 'category-add', name: '添加分类' },
            ],
          },
        ],
      },
      { id: 'about', name: '关于', icon: 'Info' },
    ],
  },
  decorators: [
    (Story) => (
      <div className='border-border h-[300px] w-[200px] overflow-visible rounded border'>
        <Story />
      </div>
    ),
  ],
}

// 受控模式
export const Controlled: Story = {
  args: {
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'components', name: '组件', icon: 'Package' },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState('home')
    return (
      <div className='flex gap-4'>
        <Menu {...args} value={value} onChange={setValue} />
        <div className='text-muted-foreground text-sm'>当前选中: {value}</div>
      </div>
    )
  },
}

// 水平菜单受控模式
export const HorizontalControlled: Story = {
  args: {
    mode: 'horizontal',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      {
        id: 'products',
        name: '产品',
        icon: 'Package',
        children: [
          { id: 'product-list', name: '产品列表' },
          { id: 'product-add', name: '添加产品' },
        ],
      },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState('home')
    return (
      <div className='flex flex-col gap-4'>
        <div className='border-border h-12 w-full rounded border'>
          <Menu {...args} value={value} onChange={setValue} />
        </div>
        <div className='text-muted-foreground text-sm'>当前选中: {value}</div>
      </div>
    )
  },
}

// 启用搜索
export const WithSearch: Story = {
  args: {
    enabledSearch: true,
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'components', name: '组件', icon: 'Package' },
      { id: 'api', name: 'API 参考', icon: 'Code' },
      { id: 'examples', name: '示例', icon: 'Layout' },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
}

// 小尺寸
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
}

// 大尺寸
export const SizeLarge: Story = {
  args: {
    size: 'lg',
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'docs', name: '文档', icon: 'FileText' },
      { id: 'settings', name: '设置', icon: 'Settings' },
    ],
  },
}

// 后台管理菜单（Inline 模式）
export const AdminMenuInline: Story = {
  args: {
    enabledSearch: true,
    items: [
      { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
      {
        id: 'content',
        name: '内容管理',
        icon: 'FileText',
        children: [
          { id: 'articles', name: '文章管理' },
          { id: 'categories', name: '分类管理' },
          { id: 'tags', name: '标签管理' },
        ],
      },
      {
        id: 'users',
        name: '用户管理',
        icon: 'Users',
        count: 3,
        children: [
          { id: 'user-list', name: '用户列表' },
          { id: 'roles', name: '角色管理' },
          { id: 'permissions', name: '权限配置' },
        ],
      },
      { id: 'analytics', name: '数据分析', icon: 'BarChart3' },
      { id: 'notifications', name: '通知中心', icon: 'Bell', count: 5 },
      { id: 'settings', name: '系统设置', icon: 'Settings' },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState('dashboard')
    return (
      <div className='flex h-[500px] rounded border'>
        <div className='w-[240px] border-r'>
          <Menu {...args} value={value} onChange={setValue} />
        </div>
        <div className='flex-1 p-4'>
          <h1 className='mb-4 text-xl font-bold'>
            {value === 'dashboard' && '仪表盘'}
            {value === 'articles' && '文章管理'}
            {value === 'user-list' && '用户列表'}
            {value === 'settings' && '系统设置'}
          </h1>
          <p className='text-muted-foreground'>当前页面: {value}</p>
        </div>
      </div>
    )
  },
}

// 后台管理菜单（Horizontal 模式）
export const AdminMenuHorizontal: Story = {
  args: {
    mode: 'horizontal',
    items: [
      { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
      {
        id: 'content',
        name: '内容管理',
        icon: 'FileText',
        children: [
          { id: 'articles', name: '文章管理' },
          { id: 'categories', name: '分类管理' },
          { id: 'tags', name: '标签管理' },
        ],
      },
      {
        id: 'users',
        name: '用户管理',
        icon: 'Users',
        children: [
          { id: 'user-list', name: '用户列表' },
          { id: 'roles', name: '角色管理' },
          { id: 'permissions', name: '权限配置' },
        ],
      },
      { id: 'analytics', name: '数据分析', icon: 'BarChart3' },
      { id: 'settings', name: '系统设置', icon: 'Settings' },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState('dashboard')
    return (
      <div className='flex h-[400px] flex-col rounded border'>
        <div className='border-border flex h-12 items-center border-b px-4'>
          <div className='mr-4 flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded bg-blue-500 font-bold text-white'>
              N
            </div>
            <span className='font-bold'>NocoKit</span>
          </div>
          <Menu {...args} value={value} onChange={setValue} />
        </div>
        <div className='flex-1 p-4'>
          <h1 className='mb-4 text-xl font-bold'>
            {value === 'dashboard' && '仪表盘'}
            {value === 'articles' && '文章管理'}
            {value === 'user-list' && '用户列表'}
            {value === 'settings' && '系统设置'}
          </h1>
          <p className='text-muted-foreground'>当前页面: {value}</p>
        </div>
      </div>
    )
  },
}

// 所有模式对比
export const AllModes: Story = {
  args: {
    items: [
      { id: 'home', name: '首页', icon: 'Home' },
      { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
      {
        id: 'system',
        name: '系统管理',
        icon: 'Settings',
        children: [
          { id: 'system-overview', name: '系统概览' },
          {
            id: 'user-management',
            name: '用户管理',
            children: [
              { id: 'user-list', name: '用户列表' },
              { id: 'user-add', name: '添加用户' },
              {
                id: 'user-group',
                name: '用户分组',
                children: [
                  { id: 'group-list', name: '分组列表' },
                  { id: 'group-add', name: '添加分组' },
                  {
                    id: 'group-settings',
                    name: '分组设置',
                    children: [
                      { id: 'group-permissions', name: '分组权限' },
                      { id: 'group-members', name: '成员管理' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'role-management',
            name: '角色管理',
            children: [
              { id: 'role-list', name: '角色列表' },
              {
                id: 'role-permissions',
                name: '权限配置',
                children: [
                  { id: 'perm-menu', name: '菜单权限' },
                  { id: 'perm-data', name: '数据权限' },
                ],
              },
            ],
          },
          { id: 'system-log', name: '系统日志' },
        ],
      },
      {
        id: 'content',
        name: '内容管理',
        icon: 'FileText',
        children: [
          { id: 'article-list', name: '文章列表' },
          {
            id: 'article-category',
            name: '文章分类',
            children: [
              { id: 'category-list', name: '分类列表' },
              { id: 'category-add', name: '添加分类' },
            ],
          },
        ],
      },
      { id: 'about', name: '关于', icon: 'Info' },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState('home')

    return (
      <div className='flex w-full flex-col space-y-8 p-2'>
        <div>
          <h3 className='mb-2 font-bold'>Inline 模式（默认）</h3>
          <div className='border-border h-[300px] w-[200px] overflow-auto rounded border'>
            <Menu {...args} mode='inline' value={value} onChange={setValue} />
          </div>
        </div>

        <div>
          <h3 className='mb-2 font-bold'>Horizontal 模式</h3>
          <div className='border-border h-12 w-full rounded border'>
            <Menu
              {...args}
              mode='horizontal'
              value={value}
              onChange={setValue}
            />
          </div>
        </div>

        <div>
          <h3 className='mb-2 font-bold'>Vertical 模式（悬浮子菜单）</h3>
          <div className='border-border h-[300px] w-[200px] overflow-auto rounded border'>
            <Menu {...args} mode='vertical' value={value} onChange={setValue} />
          </div>
        </div>

        <div className='text-muted-foreground text-sm'>当前选中: {value}</div>
      </div>
    )
  },
}
