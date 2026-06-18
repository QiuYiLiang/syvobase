import { CSSProperties } from 'react'

export interface ThemeVars extends CSSProperties {
  '--syvobase-primary'?: string
  '--syvobase-primary-foreground'?: string
  '--syvobase-background'?: string
  '--syvobase-foreground'?: string
  '--syvobase-card'?: string
  '--syvobase-card-foreground'?: string
  '--syvobase-popover'?: string
  '--syvobase-popover-foreground'?: string
  '--syvobase-secondary'?: string
  '--syvobase-secondary-foreground'?: string
  '--syvobase-muted'?: string
  '--syvobase-muted-foreground'?: string
  '--syvobase-accent'?: string
  '--syvobase-accent-foreground'?: string
  '--syvobase-destructive'?: string
  '--syvobase-destructive-foreground'?: string
  '--syvobase-radius'?: string
  '--syvobase-border'?: string
  '--syvobase-input'?: string
  '--syvobase-ring'?: string
  '--syvobase-chart-1'?: string
  '--syvobase-chart-2'?: string
  '--syvobase-chart-3'?: string
  '--syvobase-chart-4'?: string
  '--syvobase-chart-5'?: string
}

export interface Theme {
  light: ThemeVars
  dark?: ThemeVars
  common?: ThemeVars
}
