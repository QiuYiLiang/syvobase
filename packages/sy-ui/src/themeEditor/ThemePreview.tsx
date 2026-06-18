import { Button } from '@/button'
import { Text } from '@/text'
import { Switch } from '@/switch'
import { Checkbox } from '@/checkbox'
import { Badge } from '@/badge'
import { Select } from '@/select'
import { Tabs } from '@/tabs'
import { Avatar } from '@/avatar'
import { Popover } from '@/popover'
import { useMemo, useState } from 'react'
import { ThemeEditorValue } from './shared'
import { cn } from '@/utils'

// 简单的 SVG 图标组件
const IconSearch = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='11' cy='11' r='8' />
    <path d='m21 21-4.3-4.3' />
  </svg>
)

const IconBell = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
    <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
  </svg>
)

const IconHome = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
    <polyline points='9 22 9 12 15 12 15 22' />
  </svg>
)

const IconFolder = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' />
  </svg>
)

const IconUser = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
)

const IconSettings = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='12' cy='12' r='3' />
    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
  </svg>
)

const IconStar = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
  </svg>
)

const IconHeart = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
  </svg>
)

const IconMessage = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z' />
  </svg>
)

const IconShare = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='18' cy='5' r='3' />
    <circle cx='6' cy='12' r='3' />
    <circle cx='18' cy='19' r='3' />
    <line x1='8.59' x2='15.42' y1='13.51' y2='17.49' />
    <line x1='15.41' x2='8.59' y1='6.51' y2='10.49' />
  </svg>
)

const IconInfo = () => (
  <svg
    className='size-4'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='12' cy='12' r='10' />
    <path d='M12 16v-4' />
    <path d='M12 8h.01' />
  </svg>
)

export interface ThemePreviewProps {
  className?: string
  value?: ThemeEditorValue
  mode?: 'light' | 'dark'
}

export const ThemePreview = ({
  className,
  value,
  mode = 'light',
}: ThemePreviewProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [switchValue, setSwitchValue] = useState(true)
  const [checkboxValue, setCheckboxValue] = useState(true)
  const [sliderValue] = useState(65)

  // 将主题值转换为 CSS 变量样式
  const themeStyle = useMemo(() => {
    const themeVars = mode === 'dark' ? value?.dark : value?.light
    if (!themeVars) return {}

    const style: Record<string, string> = {}
    Object.entries(themeVars).forEach(([key, val]) => {
      if (val) {
        // key 已经是 --syvobase-* 格式
        style[key] = val
      }
    })
    return style
  }, [value, mode])

  return (
    <div className={cn('h-full w-full', className)} style={themeStyle}>
      <div className='bg-background text-foreground border-border flex h-full w-full flex-col overflow-hidden rounded-lg border'>
        {/* 顶部导航栏 */}
        <div className='bg-card border-border flex items-center justify-between border-b px-4 py-2'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold'>
              N
            </div>
            <span className='text-sm font-semibold'>Syvobase</span>
          </div>
          <div className='flex items-center gap-2'>
            <Button size='sm' type='ghost' className='size-8 p-0'>
              <IconSearch />
            </Button>
            <Button size='sm' type='ghost' className='size-8 p-0'>
              <IconBell />
            </Button>
            <Avatar size='sm' name='John Doe' />
          </div>
        </div>

        <div className='flex flex-1'>
          {/* 侧边栏 */}
          <div className='border-border flex w-12 flex-col items-center gap-1 border-r py-2'>
            <Popover content='Home' trigger='hover'>
              <Button size='sm' type='ghost' className='size-8 p-0'>
                <IconHome />
              </Button>
            </Popover>
            <Popover content='Projects' trigger='hover'>
              <Button size='sm' className='size-8 p-0'>
                <IconFolder />
              </Button>
            </Popover>
            <Popover content='Users' trigger='hover'>
              <Button size='sm' type='ghost' className='size-8 p-0'>
                <IconUser />
              </Button>
            </Popover>
            <Popover content='Settings' trigger='hover'>
              <Button size='sm' type='ghost' className='size-8 p-0'>
                <IconSettings />
              </Button>
            </Popover>
          </div>

          {/* 主内容区 */}
          <div className='flex-1 space-y-4 p-4'>
            {/* Tabs 导航 */}
            <Tabs
              type='line'
              value={activeTab}
              onChange={setActiveTab}
              items={[
                { id: 'overview', name: 'Overview' },
                { id: 'analytics', name: 'Analytics' },
                { id: 'settings', name: 'Settings' },
              ]}
            />

            {/* 统计卡片 */}
            <div className='grid grid-cols-3 gap-2'>
              <div className='bg-card border-border rounded-lg border p-3'>
                <div className='text-muted-foreground text-xs'>Total Users</div>
                <div className='text-lg font-bold'>2,847</div>
                <div className='text-xs text-green-500'>+12.5%</div>
              </div>
              <div className='bg-card border-border rounded-lg border p-3'>
                <div className='text-muted-foreground text-xs'>Revenue</div>
                <div className='text-lg font-bold'>$45.2k</div>
                <div className='text-xs text-green-500'>+8.2%</div>
              </div>
              <div className='bg-card border-border rounded-lg border p-3'>
                <div className='text-muted-foreground text-xs'>Active Now</div>
                <div className='text-lg font-bold'>573</div>
                <div className='text-destructive text-xs'>-2.4%</div>
              </div>
            </div>

            {/* Alert 提示 */}
            <div className='bg-accent text-accent-foreground flex items-center gap-2 rounded-lg p-3 text-sm'>
              <IconInfo />
              <span>System update scheduled for tonight at 2:00 AM.</span>
            </div>

            {/* 按钮组 */}
            <div className='flex flex-wrap gap-2'>
              <Button size='sm'>Primary</Button>
              <Button size='sm' type='secondary'>
                Secondary
              </Button>
              <Button size='sm' type='outline'>
                Outline
              </Button>
              <Button size='sm' type='ghost'>
                Ghost
              </Button>
              <Button size='sm' type='destructive'>
                Delete
              </Button>
              <Button size='sm' type='link'>
                Link
              </Button>
            </div>

            {/* 列表项卡片 */}
            <div className='bg-card border-border space-y-2 rounded-lg border p-3'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-medium'>Recent Items</span>
                <Badge>3 new</Badge>
              </div>
              {[
                { name: 'Project Alpha', desc: 'Updated 2 hours ago' },
                { name: 'Design System', desc: 'Updated yesterday' },
                { name: 'Mobile App', desc: 'Updated 3 days ago' },
              ].map((item, i) => (
                <div
                  key={i}
                  className='hover:bg-accent flex items-center justify-between rounded-md p-2 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <div className='bg-muted flex size-8 items-center justify-center rounded'>
                      <IconFolder />
                    </div>
                    <div>
                      <div className='text-sm font-medium'>{item.name}</div>
                      <div className='text-muted-foreground text-xs'>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <span className='text-muted-foreground hover:text-foreground cursor-pointer'>
                      <IconStar />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 社交卡片 */}
            <div className='bg-card border-border rounded-lg border p-3'>
              <div className='mb-2 flex items-center gap-2'>
                <Avatar size='sm' name='Jane Smith' />
                <div>
                  <div className='text-sm font-medium'>Jane Smith</div>
                  <div className='text-muted-foreground text-xs'>
                    @janesmith · 2h
                  </div>
                </div>
              </div>
              <p className='mb-2 text-sm'>
                Just shipped a new feature! 🚀 Check out our latest update with
                improved performance.
              </p>
              <div className='flex gap-4'>
                <button className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs'>
                  <IconHeart />
                  <span>128</span>
                </button>
                <button className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs'>
                  <IconMessage />
                  <span>24</span>
                </button>
                <button className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs'>
                  <IconShare />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* 表单元素 */}
            <div className='bg-card border-border space-y-3 rounded-lg border p-3'>
              <div className='text-sm font-medium'>Form Controls</div>
              <div className='flex gap-2'>
                <Text className='flex-1' size='sm' placeholder='Search...' />
                <Select
                  size='sm'
                  className='w-28'
                  value='all'
                  items={[
                    { id: 'all', name: 'All' },
                    { id: 'active', name: 'Active' },
                    { id: 'inactive', name: 'Inactive' },
                  ]}
                />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Enable notifications</span>
                <Switch value={switchValue} onChange={setSwitchValue} />
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Checkbox value={checkboxValue} onChange={setCheckboxValue} />
                  <span className='text-sm'>Remember me</span>
                </div>
              </div>
              {/* 进度条模拟 */}
              <div className='space-y-1'>
                <div className='flex justify-between text-xs'>
                  <span className='text-muted-foreground'>Progress</span>
                  <span>{sliderValue}%</span>
                </div>
                <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
                  <div
                    className='bg-primary h-full rounded-full transition-all'
                    style={{ width: `${sliderValue}%` }}
                  />
                </div>
              </div>
              {/* 第二个进度条 */}
              <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
                <div className='bg-primary h-full w-3/4 rounded-full' />
              </div>
            </div>

            {/* 徽章组 */}
            <div className='flex flex-wrap gap-2'>
              <Badge>Default</Badge>
              <Badge type='secondary'>Secondary</Badge>
              <Badge type='destructive'>Destructive</Badge>
              <span className='border-border text-foreground inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium'>
                Outline
              </span>
              <span className='inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600'>
                Success
              </span>
              <span className='inline-flex items-center rounded-md bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-600'>
                Warning
              </span>
            </div>

            {/* 颜色展示 */}
            <div className='flex flex-wrap gap-2'>
              {[
                { bg: 'bg-primary', label: 'Primary' },
                { bg: 'bg-secondary', label: 'Secondary' },
                { bg: 'bg-accent', label: 'Accent' },
                { bg: 'bg-muted', label: 'Muted' },
                { bg: 'bg-destructive', label: 'Destructive' },
              ].map((item) => (
                <div
                  key={item.label}
                  className='flex flex-col items-center gap-1'
                >
                  <div className={`${item.bg} size-8 rounded`} />
                  <span className='text-muted-foreground text-[10px]'>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 图表颜色 */}
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs'>Chart Colors</div>
              <div className='flex gap-1'>
                <div className='bg-chart-1 h-6 flex-1 rounded' />
                <div className='bg-chart-2 h-6 flex-1 rounded' />
                <div className='bg-chart-3 h-6 flex-1 rounded' />
                <div className='bg-chart-4 h-6 flex-1 rounded' />
                <div className='bg-chart-5 h-6 flex-1 rounded' />
              </div>
            </div>

            {/* 模拟图表 */}
            <div className='bg-card border-border rounded-lg border p-3'>
              <div className='mb-2 text-sm font-medium'>Activity Chart</div>
              <div className='flex h-24 items-end gap-1'>
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map(
                  (h, i) => (
                    <div
                      key={i}
                      className='bg-primary/80 hover:bg-primary flex-1 rounded-t transition-colors'
                      style={{ height: `${h}%` }}
                    />
                  )
                )}
              </div>
              <div className='text-muted-foreground mt-1 flex justify-between text-[10px]'>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
