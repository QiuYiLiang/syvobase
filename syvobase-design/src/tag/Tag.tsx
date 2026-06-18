import { Button } from '@/button'
import { IconName } from '@/icon'
import { BaseProps, BaseSizeProps, cn } from '@/utils'
import { tagStyleMap } from './shared'
import { mergeTag } from '@/utils/tag'

export interface TagProps extends BaseProps, BaseSizeProps {
  icon?: IconName
  color?:
    | 'magenta'
    | 'red'
    | 'volcano'
    | 'orange'
    | 'gold'
    | 'lime'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'geekblue'
    | 'purple'
    | 'gray'
  rounded?: boolean
  border?: boolean
}

export const Tag = (props: TagProps) => {
  const {
    className,
    style,
    color = 'gray',
    icon,
    size = 'sm',
    rounded,
    children,
    border = true,
  } = props
  return (
    <Button
      {...mergeTag('tag', props)}
      className={cn('cursor-text', className)}
      style={{
        ...(tagStyleMap[color] ?? tagStyleMap.gray),
        ...(border ? { borderWidth: 1 } : {}),
        ...style,
      }}
      type='default'
      rounded={rounded}
      icon={icon}
      size={size}
    >
      {children}
    </Button>
  )
}
