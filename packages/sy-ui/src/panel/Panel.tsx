import { getToolbarProps, Toolbar, ToolbarItem, ToolbarProps } from '@/toolbar'
import { cn, getHasToolbar } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { omit } from '@syvobase/utils'
import { HTMLAttributes, ReactNode } from 'react'

export interface PanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  type?: 'card' | 'default'
  children?: ReactNode
  fixed?: boolean
  disabledContentPadding?: boolean
  padding?: number
  paddingX?: number
  paddingY?: number
  border?: boolean
  header?: ReactNode
  footer?: ReactNode
  width?: string | number
  topToolbar?: ToolbarProps | ToolbarProps['items']
  toolbar?: ToolbarProps | ToolbarProps['items']
}

export const Panel = ({
  className,
  type = 'default',
  children,
  header,
  footer,
  padding = 10,
  paddingX,
  paddingY,
  disabledContentPadding = false,
  width = '100%',
  fixed = true,
  border = false,
  topToolbar: _topToolbar,
  toolbar,
  ...props
}: PanelProps) => {
  const paddingStyle = {
    paddingTop: paddingY ?? padding,
    paddingRight: paddingX ?? padding ?? 16,
    paddingBottom: paddingY ?? padding ?? 16,
    paddingLeft: paddingX ?? padding,
  }

  const getTopToolBar = () => {
    const closeItem: ToolbarItem = header
    const topToolbar = _topToolbar ?? { left: [] }
    if (Array.isArray(topToolbar)) {
      return {
        items: topToolbar,
        right: [closeItem],
      }
    }
    return {
      ...topToolbar,
      left: [...(header ? [header] : []), ...(topToolbar.left ?? [])],
    }
  }
  const topToolbar = getTopToolBar()
  const topToolbarProps = getToolbarProps(topToolbar)
  const bottomToolbarProps = getToolbarProps(toolbar)
  const hasTopToolbar = header || getHasToolbar(topToolbarProps)
  const hasBottomToolbar = footer || getHasToolbar(bottomToolbarProps)
  return (
    <div
      {...mergeTag('panel', props)}
      className={cn(
        'text-foreground',
        fixed && 'flex h-full flex-col',
        type === 'card' &&
          'border-border bg-card text-card-foreground rounded-lg border',
        className
      )}
      {...omit(props, ['open', 'onOpenChange'])}
    >
      {hasTopToolbar && (
        <div
          className={cn('w-full', border && 'border-border border-b')}
          style={paddingStyle}
        >
          {topToolbar ? <Toolbar {...topToolbarProps} /> : header}
        </div>
      )}
      <div
        className={cn('flex w-full justify-center', fixed && 'flex-1')}
        style={disabledContentPadding ? {} : paddingStyle}
      >
        <div
          style={{
            width,
          }}
        >
          {children}
        </div>
      </div>
      {hasBottomToolbar && (
        <div
          className={cn('w-full', border && 'border-border border-t')}
          style={paddingStyle}
        >
          {toolbar ? <Toolbar {...bottomToolbarProps} /> : footer}
        </div>
      )}
    </div>
  )
}
