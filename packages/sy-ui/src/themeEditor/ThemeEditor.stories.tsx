import { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeEditor } from './ThemeEditor'
import { useState } from 'react'
import { Theme } from '@/themes'

const meta = {
  title: 'Input/ThemeEditor',
  component: ThemeEditor,
  argTypes: {
    mode: {
      control: 'select',
      options: ['light', 'dark', 'both'],
      description: '编辑模式',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readMode: {
      control: 'boolean',
      description: '是否只读模式',
    },
  },
  args: {},
} satisfies Meta<typeof ThemeEditor>

export default meta

type Story = StoryObj<typeof meta>

// 默认主题编辑器
export const Default: Story = {
  args: {},
}

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>({
      light: {
        primary: '#3b82f6',
        primaryForeground: '#ffffff',
        background: '#ffffff',
        foreground: '#0f172a',
        accent: '#f1f5f9',
        accentForeground: '#0f172a',
      },
      dark: {
        primary: '#60a5fa',
        primaryForeground: '#0f172a',
        background: '#0f172a',
        foreground: '#f8fafc',
        accent: '#1e293b',
        accentForeground: '#f8fafc',
      },
    })
    return (
      <div className='flex flex-col gap-4'>
        <ThemeEditor value={theme} onChange={setTheme} />
        <div className='bg-muted rounded-lg p-4'>
          <pre className='text-muted-foreground overflow-auto text-xs'>
            {JSON.stringify(theme, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

// 仅浅色模式
export const LightModeOnly: Story = {
  args: {
    mode: 'light',
    defaultValue: {
      light: {
        primary: '#8b5cf6',
        primaryForeground: '#ffffff',
        background: '#faf5ff',
        foreground: '#1e1b4b',
      },
    },
  },
}

// 仅深色模式
export const DarkModeOnly: Story = {
  args: {
    mode: 'dark',
    defaultValue: {
      light: {},
      dark: {
        primary: '#a78bfa',
        primaryForeground: '#1e1b4b',
        background: '#1e1b4b',
        foreground: '#f5f3ff',
      },
    },
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: {
      light: {
        primary: '#ef4444',
        primaryForeground: '#ffffff',
        background: '#ffffff',
        foreground: '#1f2937',
      },
    },
  },
}

// 只读模式
export const ReadMode: Story = {
  args: {
    readMode: true,
    defaultValue: {
      light: {
        primary: '#10b981',
        accent: '#d1fae5',
        muted: '#ecfdf5',
        border: '#a7f3d0',
      },
    },
  },
}

// 完整主题配置
export const FullTheme: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>({
      light: {
        primary: '#6366f1',
        primaryForeground: '#ffffff',
        secondary: '#f1f5f9',
        secondaryForeground: '#0f172a',
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        cardForeground: '#0f172a',
        popover: '#ffffff',
        popoverForeground: '#0f172a',
        muted: '#f1f5f9',
        mutedForeground: '#64748b',
        accent: '#f1f5f9',
        accentForeground: '#0f172a',
        destructive: '#ef4444',
        destructiveForeground: '#ffffff',
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#6366f1',
        chart1: '#6366f1',
        chart2: '#8b5cf6',
        chart3: '#a855f7',
        chart4: '#d946ef',
        chart5: '#ec4899',
        radius: '0.5rem',
      },
      dark: {
        primary: '#818cf8',
        primaryForeground: '#0f172a',
        secondary: '#1e293b',
        secondaryForeground: '#f8fafc',
        background: '#0f172a',
        foreground: '#f8fafc',
        card: '#1e293b',
        cardForeground: '#f8fafc',
        popover: '#1e293b',
        popoverForeground: '#f8fafc',
        muted: '#1e293b',
        mutedForeground: '#94a3b8',
        accent: '#334155',
        accentForeground: '#f8fafc',
        destructive: '#f87171',
        destructiveForeground: '#0f172a',
        border: '#334155',
        input: '#334155',
        ring: '#818cf8',
        chart1: '#818cf8',
        chart2: '#a78bfa',
        chart3: '#c084fc',
        chart4: '#e879f9',
        chart5: '#f472b6',
        radius: '0.5rem',
      },
      common: {
        radius: '0.5rem',
      },
    })
    return (
      <div className='max-w-lg'>
        <ThemeEditor value={theme} onChange={setTheme} mode='both' />
      </div>
    )
  },
}

// 不同预设主题
export const PresetThemes: Story = {
  render: () => {
    const themes: { name: string; theme: Theme }[] = [
      {
        name: '蓝色主题',
        theme: {
          light: {
            primary: '#3b82f6',
            accent: '#dbeafe',
            muted: '#eff6ff',
            border: '#bfdbfe',
          },
        },
      },
      {
        name: '绿色主题',
        theme: {
          light: {
            primary: '#10b981',
            accent: '#d1fae5',
            muted: '#ecfdf5',
            border: '#a7f3d0',
          },
        },
      },
      {
        name: '紫色主题',
        theme: {
          light: {
            primary: '#8b5cf6',
            accent: '#ede9fe',
            muted: '#f5f3ff',
            border: '#ddd6fe',
          },
        },
      },
    ]

    const [currentTheme, setCurrentTheme] = useState(themes[0].theme)

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          {themes.map((t) => (
            <button
              key={t.name}
              className='hover:bg-muted rounded-lg border px-3 py-1.5 text-sm transition-colors'
              onClick={() => setCurrentTheme(t.theme)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <ThemeEditor
          value={currentTheme}
          onChange={setCurrentTheme}
          mode='light'
        />
      </div>
    )
  },
}
