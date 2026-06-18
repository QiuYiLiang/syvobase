import { BaseValueProps, cn, useControllable } from '@/utils'
import { ReactNode, RefAttributes, useImperativeHandle } from 'react'
import { Icon } from '@/icon'
import { mergeTag } from '@/utils/tag'

export interface StepItem {
  id: string
  name: string
  content: ReactNode
  description?: string
}

export interface StepsProps
  extends BaseValueProps<string>, RefAttributes<StepsModel> {
  value?: string
  items?: StepItem[]
  onChange?: (value: string) => void
}

export interface StepsModel {
  prevStep: () => void
  nextStep: () => void
  stepTo: (id: string) => void
}

export const Steps = (props: StepsProps) => {
  const { ref, className, style, items = [] } = props
  const [value, setValue] = useControllable({
    props,
    value: items?.[0].id ?? '',
  })
  const activeIndex = items.findIndex(({ id }) => id === value)
  const activeItem = items[activeIndex] as StepItem

  useImperativeHandle(ref, () => ({
    prevStep: () => {
      const item = items[activeIndex - 1]
      if (item) {
        setValue(item.id)
      }
    },
    nextStep: () => {
      const item = items[activeIndex + 1]
      if (item) {
        setValue(item.id)
      }
    },
    stepTo: (id: string) => {
      setValue(id)
    },
  }))

  if (items.length === 0) {
    return
  }

  return (
    <div
      {...mergeTag('steps', props)}
      className={cn(className, 'flex w-full flex-col')}
      style={style}
    >
      <div className={cn('flex items-center justify-between space-x-6')}>
        {items.map(({ id, name, description }, index) => {
          const isActive = index === activeIndex
          const isPrev = index < activeIndex
          return (
            <>
              {index > 0 && (
                <div
                  className={cn(
                    'bg-secondary h-1 flex-1 rounded',
                    (isPrev || isActive) && 'bg-primary'
                  )}
                ></div>
              )}
              <div className={cn('flex items-center space-x-2')} key={id}>
                <div
                  className={cn(
                    'border-border flex size-12 items-center justify-center rounded-full border-2',
                    isPrev && 'border-primary text-primary',
                    isActive &&
                      'border-primary bg-primary text-primary-foreground'
                  )}
                >
                  {isPrev ? <Icon name='Check' /> : index + 1}
                </div>
                <div className='flex flex-col'>
                  <div>{name}</div>
                  <div className='text-foreground/50 max-w-36 text-sm'>
                    {description}
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>
      <div className='flex-1'>{activeItem.content}</div>
    </div>
  )
}
