import { BaseProps, cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
interface BadgeProps extends BaseProps {
  type?: 'default' | 'secondary' | 'destructive'
  count?: number
  dot?: boolean
  animate?: boolean
  position?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }
}

export const Badge = (props: BadgeProps) => {
  const {
    className,
    style,
    type = 'default',
    dot = false,
    count = 0,
    animate = false,
    position,
    children,
  } = props
  return (
    <div
      {...mergeTag('bavge', props)}
      className={cn('relative', className)}
      style={style}
    >
      {count > 0 && (
        <div
          className={cn(
            'absolute top-0 right-0 z-50 flex h-4 min-w-4 items-center justify-center rounded-full p-1 text-xs',
            dot && 'h-3 w-3',
            {
              default: 'bg-primary text-primary-foreground',
              secondary: 'bg-secondary text-secondary-foreground',
              destructive: 'bg-destructive text-destructive-foreground',
            }[type]
          )}
          style={{
            transform: 'translateX(calc(100% - 10px))',
            ...position,
          }}
        >
          {animate && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-50',
                {
                  default: 'bg-primary text-primary-foreground',
                  secondary: 'bg-secondary text-secondary-foreground',
                  destructive: 'bg-destructive text-destructive-foreground',
                }[type]
              )}
            ></span>
          )}
          {!dot && (count > 99 ? '99+' : count < 0 ? 0 : count)}
        </div>
      )}
      {children}
    </div>
  )
}
