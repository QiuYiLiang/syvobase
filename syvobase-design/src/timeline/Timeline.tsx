import { Icon } from '@/icon'
import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Fragment, ReactNode } from 'react'

export interface TimelineProps {
  items: {
    id: string
    icon?: string
    dot?: boolean
    color?: string
    name: ReactNode
    content?: ReactNode
  }[]
}

const Timeline = (props: TimelineProps) => {
  const { items } = props
  const itemsLength = items.length
  return (
    <div
      {...mergeTag('timeline', props)}
      className={cn('flex flex-col items-start')}
    >
      {items.map(({ id, icon, dot = true, color, name, content }, index) => {
        const isLast = index === itemsLength - 1
        return (
          <Fragment key={id}>
            <div className='flex items-center gap-4'>
              {icon ? (
                <Icon className='size-3' name={icon} color={color} />
              ) : (
                <div
                  className={cn(
                    'size-3 rounded-full',
                    dot ? 'bg-primary' : 'border-border border-2'
                  )}
                  style={
                    dot
                      ? {
                          background: color,
                        }
                      : {
                          borderColor: color,
                        }
                  }
                ></div>
              )}
              <div>{name}</div>
            </div>
            {(!isLast || content) && (
              <div className='flex gap-5'>
                {!isLast && (
                  <div
                    className={cn(
                      'ml-[4.5px] min-h-16 w-[3px] self-stretch rounded-full bg-gray-400'
                    )}
                  ></div>
                )}
                {content && (
                  <>
                    {isLast && <div className='ml-[4.5px] w-[3px]'></div>}
                    <div className='pb-6'>{content}</div>
                  </>
                )}
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export { Timeline }
