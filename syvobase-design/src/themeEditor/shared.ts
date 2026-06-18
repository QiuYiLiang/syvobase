// 主题颜色变量分组配置（参考 tweakcn.com/editor/theme）
export const THEME_GROUPS = [
  {
    id: 'primary',
    name: 'themeEditor.primary',
    keys: ['--syvobase-primary', '--syvobase-primary-foreground'],
  },
  {
    id: 'secondary',
    name: 'themeEditor.secondary',
    keys: ['--syvobase-secondary', '--syvobase-secondary-foreground'],
  },
  {
    id: 'accent',
    name: 'themeEditor.accent',
    keys: ['--syvobase-accent', '--syvobase-accent-foreground'],
  },
  {
    id: 'base',
    name: 'themeEditor.base',
    keys: ['--syvobase-background', '--syvobase-foreground'],
  },
  {
    id: 'card',
    name: 'themeEditor.card',
    keys: ['--syvobase-card', '--syvobase-card-foreground'],
  },
  {
    id: 'popover',
    name: 'themeEditor.popover',
    keys: ['--syvobase-popover', '--syvobase-popover-foreground'],
  },
  {
    id: 'muted',
    name: 'themeEditor.muted',
    keys: ['--syvobase-muted', '--syvobase-muted-foreground'],
  },
  {
    id: 'destructive',
    name: 'themeEditor.destructive',
    keys: ['--syvobase-destructive', '--syvobase-destructive-foreground'],
  },
  {
    id: 'borderInput',
    name: 'themeEditor.borderInput',
    keys: ['--syvobase-border', '--syvobase-input', '--syvobase-ring'],
  },
  {
    id: 'chart',
    name: 'themeEditor.chart',
    keys: [
      '--syvobase-chart-1',
      '--syvobase-chart-2',
      '--syvobase-chart-3',
      '--syvobase-chart-4',
      '--syvobase-chart-5',
    ],
  },
  {
    id: 'radius',
    name: 'themeEditor.radius',
    keys: ['--syvobase-radius'],
  },
]

// 变量显示名称
export const THEME_KEY_LABELS: Record<string, string> = {
  '--syvobase-primary': 'themeEditor.keys.primary',
  '--syvobase-primary-foreground': 'themeEditor.keys.primaryForeground',
  '--syvobase-background': 'themeEditor.keys.background',
  '--syvobase-foreground': 'themeEditor.keys.foreground',
  '--syvobase-card': 'themeEditor.keys.card',
  '--syvobase-card-foreground': 'themeEditor.keys.cardForeground',
  '--syvobase-popover': 'themeEditor.keys.popover',
  '--syvobase-popover-foreground': 'themeEditor.keys.popoverForeground',
  '--syvobase-secondary': 'themeEditor.keys.secondary',
  '--syvobase-secondary-foreground': 'themeEditor.keys.secondaryForeground',
  '--syvobase-muted': 'themeEditor.keys.muted',
  '--syvobase-muted-foreground': 'themeEditor.keys.mutedForeground',
  '--syvobase-accent': 'themeEditor.keys.accent',
  '--syvobase-accent-foreground': 'themeEditor.keys.accentForeground',
  '--syvobase-destructive': 'themeEditor.keys.destructive',
  '--syvobase-destructive-foreground': 'themeEditor.keys.destructiveForeground',
  '--syvobase-radius': 'themeEditor.keys.radius',
  '--syvobase-border': 'themeEditor.keys.border',
  '--syvobase-input': 'themeEditor.keys.input',
  '--syvobase-ring': 'themeEditor.keys.ring',
  '--syvobase-chart-1': 'themeEditor.keys.chart1',
  '--syvobase-chart-2': 'themeEditor.keys.chart2',
  '--syvobase-chart-3': 'themeEditor.keys.chart3',
  '--syvobase-chart-4': 'themeEditor.keys.chart4',
  '--syvobase-chart-5': 'themeEditor.keys.chart5',
}

// 非颜色类型的变量
export const NON_COLOR_KEYS = ['--syvobase-radius']

// ThemeEditor 的值类型（使用 CSS 变量名格式）
export interface ThemeEditorValue {
  light: Record<string, string>
  dark?: Record<string, string>
}

// modern-minimal 主题的默认值（使用 hex 格式）
export const getDefaultThemeJSON = (): ThemeEditorValue => ({
  light: {
    '--syvobase-background': '#ffffff',
    '--syvobase-foreground': '#3f3f46',
    '--syvobase-card': '#ffffff',
    '--syvobase-card-foreground': '#3f3f46',
    '--syvobase-popover': '#ffffff',
    '--syvobase-popover-foreground': '#3f3f46',
    '--syvobase-primary': '#6366f1',
    '--syvobase-primary-foreground': '#ffffff',
    '--syvobase-secondary': '#f4f4f5',
    '--syvobase-secondary-foreground': '#52525b',
    '--syvobase-muted': '#fafafa',
    '--syvobase-muted-foreground': '#71717a',
    '--syvobase-accent': '#e0f2fe',
    '--syvobase-accent-foreground': '#1e3a8a',
    '--syvobase-destructive': '#ef4444',
    '--syvobase-destructive-foreground': '#ffffff',
    '--syvobase-border': '#e4e4e7',
    '--syvobase-input': '#e4e4e7',
    '--syvobase-ring': '#6366f1',
    '--syvobase-chart-1': '#6366f1',
    '--syvobase-chart-2': '#4f46e5',
    '--syvobase-chart-3': '#4338ca',
    '--syvobase-chart-4': '#3730a3',
    '--syvobase-chart-5': '#1e3a8a',
    '--syvobase-radius': '0.375rem',
  },
  dark: {
    '--syvobase-background': '#18181b',
    '--syvobase-foreground': '#e4e4e7',
    '--syvobase-card': '#27272a',
    '--syvobase-card-foreground': '#e4e4e7',
    '--syvobase-popover': '#27272a',
    '--syvobase-popover-foreground': '#e4e4e7',
    '--syvobase-primary': '#6366f1',
    '--syvobase-primary-foreground': '#ffffff',
    '--syvobase-secondary': '#27272a',
    '--syvobase-secondary-foreground': '#e4e4e7',
    '--syvobase-muted': '#27272a',
    '--syvobase-muted-foreground': '#a1a1aa',
    '--syvobase-accent': '#1e3a8a',
    '--syvobase-accent-foreground': '#c7d2fe',
    '--syvobase-destructive': '#ef4444',
    '--syvobase-destructive-foreground': '#ffffff',
    '--syvobase-border': '#3f3f46',
    '--syvobase-input': '#3f3f46',
    '--syvobase-ring': '#6366f1',
    '--syvobase-chart-1': '#818cf8',
    '--syvobase-chart-2': '#6366f1',
    '--syvobase-chart-3': '#4f46e5',
    '--syvobase-chart-4': '#4338ca',
    '--syvobase-chart-5': '#3730a3',
    '--syvobase-radius': '0.375rem',
  },
})
