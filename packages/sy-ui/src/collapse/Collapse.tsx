import { BaseValueProps, cn, useControllable } from '@/utils'
import { CSSProperties, ReactNode } from 'react'
import { Button } from '@/button'
import { Toolbar, ToolbarItem } from '../toolbar'
import { mergeTag } from '@/utils/tag'

export interface CollapseProps<V = any> extends BaseValueProps<V> {
  multiple?: boolean
  className?: string
  style?: CSSProperties
  disabledPadding?: boolean
  type?: 'group' | 'collapse'
  items?: {
    id: string
    name: ReactNode
    toolbar?: ToolbarItem[]
    content: ReactNode
  }[]
  size?: 'sm' | 'default' | 'lg'
  border?: boolean
}
export const Collapse = ((props: CollapseProps) => {
  const {
    className,
    style,
    type = 'collapse',
    disabledPadding = false,
    multiple = true,
    items = [],
    border = true,
    size = 'default',
  } = props
  const [value, setValue] = useControllable<CollapseProps, 'value'>({
    props,
    value: [],
  })
  const isGroup = type === 'group'

  return (
    <div
      {...mergeTag('collapse', props)}
      className={cn(
        'w-full',
        border && 'border-border overflow-hidden rounded-lg border',
        className
      )}
      style={style}
    >
      {items.map(({ id, name, toolbar, content }, index) => {
        const visible = isGroup || value.includes(id)
        return (
          <div
            key={id}
            className={cn('border-border', !isGroup && index > 0 && 'border-t')}
          >
            <div className='flex space-x-1 p-1'>
              <div
                className='flex flex-1 items-center space-x-1 overflow-visible!'
                onClick={() => {
                  if (isGroup) {
                    return
                  }
                  setValue((value) => {
                    if (multiple) {
                      if (visible) {
                        return value.filter((item) => item !== id)
                      }
                      return [...value, id]
                    }
                    return visible ? [] : [id]
                  })
                }}
              >
                {isGroup ? (
                  <div className='bg-primary mr-[5px] h-[18px] w-[4px] rounded'></div>
                ) : (
                  <Button
                    icon={visible ? 'ChevronDown' : 'ChevronRight'}
                    type='ghost'
                    size={size}
                  />
                )}
                <div className='font-semibold'>{name}</div>
              </div>
              {toolbar && <Toolbar className='w-auto' right={toolbar} />}
            </div>
            {visible && (
              <div
                className={cn(
                  'overflow-hidden pt-1 text-sm',
                  !disabledPadding && 'px-2'
                )}
              >
                <div className={cn(!disabledPadding && 'pt-0 pb-4')}>
                  {content}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}) as <V = any>(props: CollapseProps<V>) => ReactNode
