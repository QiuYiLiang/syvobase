import { BaseInputProps, cn, useControllable } from '@/utils'
import { Form } from '@/form'
import { $t } from '@/utils/i18n'
import { mergeTag } from '@/utils/tag'
import { ReactNode, useMemo, useState } from 'react'
import {
  THEME_GROUPS,
  THEME_KEY_LABELS,
  NON_COLOR_KEYS,
  ThemeEditorValue,
  getDefaultThemeJSON,
} from './shared'
import { RadiusSlider } from './RadiusSlider'
import { ThemePreview } from './ThemePreview'

// modern-minimal 主题的默认圆角值
const DEFAULT_RADIUS = 0.375
const RADIUS_KEY = '--syvobase-radius'

export interface ThemeEditorProps extends BaseInputProps<ThemeEditorValue> {
  mode?: 'light' | 'dark' | 'both'
  showPreview?: boolean
}

// 生成折叠分组的表单项（包含颜色和圆角）
const generateCollapseItems = (modePrefix: 'light' | 'dark') => {
  return THEME_GROUPS.map((group) => ({
    id: group.id,
    name: $t(group.name),
    items: group.keys.map((key) => {
      const label = THEME_KEY_LABELS[key] || key
      const isRadius = NON_COLOR_KEYS.includes(key)

      return {
        id: `${modePrefix}.${key}`,
        name: $t(label),
        control: isRadius
          ? {
              type: RadiusSlider as any,
            }
          : {
              type: 'colorPicker' as const,
            },
      }
    }),
  }))
}

export const ThemeEditor = ((props: ThemeEditorProps) => {
  const {
    className,
    style,
    mode = 'both',
    disabled,
    readMode,
    showPreview = true,
  } = props

  const [value, setValue] = useControllable<ThemeEditorProps, 'value'>({
    props,
    value: getDefaultThemeJSON(),
  })

  // 跟踪当前预览的模式
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>(
    mode === 'dark' ? 'dark' : 'light'
  )

  if (readMode) {
    return (
      <div className={cn('flex items-center gap-1', className)} style={style}>
        {[
          '--syvobase-primary',
          '--syvobase-accent',
          '--syvobase-muted',
          '--syvobase-border',
        ].map((key) => (
          <div
            key={key}
            className='size-5 rounded-full'
            style={{
              backgroundColor: value.light?.[key] as string,
            }}
          />
        ))}
      </div>
    )
  }

  const showLight = mode === 'light' || mode === 'both'
  const showDark = mode === 'dark' || mode === 'both'

  // Tabs 配置
  const tabItems = useMemo(() => {
    const items: { id: string; name: string }[] = []
    if (showLight) {
      items.push({ id: 'light', name: $t('themeEditor.lightMode') })
    }
    if (showDark) {
      items.push({ id: 'dark', name: $t('themeEditor.darkMode') })
    }
    return items
  }, [showLight, showDark])

  // 根据 mode 生成表单配置（仅用于单一模式）
  const formItems = useMemo(() => {
    const items: any[] = []

    // 在 both 模式下，添加 tabs 切换作为第一个表单项
    if (mode === 'both') {
      items.push({
        id: '_modeSwitch',
        name: $t('themeEditor.mode'),
        control: {
          type: 'tabs' as const,
          full: true,
          items: tabItems,
        },
      })
    }

    // 添加折叠分组
    items.push({
      type: 'collapse' as const,
      size: 'sm' as const,
      collapseType: 'collapse' as const,
      defaultValue: ['primary', 'base'],
      multiple: true,
      items: generateCollapseItems(previewMode),
    })

    return items
  }, [previewMode, mode, tabItems])

  // 生成带有 light/dark 前缀的 formValue（根据当前预览模式）
  const currentFormValue = useMemo(() => {
    const result: Record<string, any> = {
      _modeSwitch: previewMode,
    }
    const themeVars = previewMode === 'dark' ? value.dark : value.light

    if (themeVars) {
      Object.entries(themeVars).forEach(([cssVar, val]) => {
        if (cssVar === RADIUS_KEY && typeof val === 'string') {
          const parsed = parseFloat(val.replace('rem', ''))
          result[`${previewMode}.${cssVar}`] = Number.isNaN(parsed)
            ? DEFAULT_RADIUS
            : parsed
        } else {
          result[`${previewMode}.${cssVar}`] = val
        }
      })
    }
    return result
  }, [value, previewMode])

  // 处理当前模式表单变化
  const handleCurrentFormChange = (newFormValue: Record<string, any>) => {
    // 处理模式切换
    if (newFormValue._modeSwitch && newFormValue._modeSwitch !== previewMode) {
      setPreviewMode(newFormValue._modeSwitch as 'light' | 'dark')
      return
    }

    const updatedThemeVars: Record<string, string> = {}

    Object.entries(newFormValue).forEach(([key, val]) => {
      if (key === '_modeSwitch') return
      const prefix = `${previewMode}.`
      if (key.startsWith(prefix)) {
        const cssVar = key.replace(prefix, '')
        if (cssVar === RADIUS_KEY && typeof val === 'number') {
          updatedThemeVars[cssVar] = `${val}rem`
        } else {
          updatedThemeVars[cssVar] = val
        }
      }
    })

    if (previewMode === 'light') {
      setValue({
        ...value,
        light: { ...value.light, ...updatedThemeVars },
      })
    } else {
      setValue({
        ...value,
        dark: { ...value.dark, ...updatedThemeVars },
      })
    }
  }

  return (
    <div
      {...mergeTag('theme-editor', props)}
      className={cn('flex h-full w-full gap-4', className)}
      style={style}
    >
      {/* 编辑面板 */}
      <div className={cn('flex-1', showPreview && 'max-w-[400px]')}>
        <Form
          padding={4}
          labelWidth={80}
          topLabel={false}
          disabled={disabled}
          value={currentFormValue}
          onChange={handleCurrentFormChange}
          items={formItems}
        />
      </div>

      {/* 预览面板 */}
      {showPreview && (
        <div className='flex flex-1 flex-col'>
          <ThemePreview value={value} mode={previewMode} />
        </div>
      )}
    </div>
  )
}) as (props: ThemeEditorProps) => ReactNode
