import { Icon } from '@/icon'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { mergeTag } from '@/utils/tag'

export interface FoldProps extends BaseValueProps<boolean> {
  disabled?: boolean
  direction?: 'left' | 'right'
  handlerPosition?: 'start' | 'center' | 'end'
}

export const Fold = (props: FoldProps) => {
  const {
    className,
    style,
    direction = 'right',
    disabled = false,
    handlerPosition = 'center',
    children,
  } = props
  const [value, setValue] = useControllable({
    props,
    value: true,
  })
  return (
    <div
      {...mergeTag('fold', props)}
      className={cn(className, 'relative', !value && 'w-0! border-none px-0')}
      style={style}
    >
      <div className={cn('h-full w-full', !value && 'w-0 overflow-hidden')}>
        {children}
      </div>
      {!disabled && (
        <div
          className={cn(
            'bg-border text-foreground/50 hover:bg-border/50 absolute z-50 cursor-pointer overflow-hidden',
            direction === 'left' ? 'left-0 rounded-l' : 'right-0 rounded-r',
            handlerPosition === 'start' && 'top-[20px]',
            handlerPosition === 'center' && 'top-[50%]',
            handlerPosition === 'end' && 'bottom-[20px]'
          )}
          style={{
            width: 8,
            height: 23,
            transform:
              handlerPosition === 'center'
                ? `translate(${direction === 'left' ? '-' : ''}100%, -50%)`
                : `translateX(${direction === 'left' ? '-' : ''}100%)`,
          }}
          onClick={() => {
            setValue((value) => !value)
          }}
        >
          <Icon
            style={{
              width: 13,
              margin: '3px 0 0 -3px',
            }}
            name={
              value && direction === 'right' ? 'ChevronLeft' : 'ChevronRight'
            }
          />
        </div>
      )}
    </div>
  )
}
