import { BaseBooleanInputProps, useControllable, cn } from '@/utils'
import { mergeTag } from '@/utils/tag'

export interface SwitchProps extends BaseBooleanInputProps {}

export const Switch = (props: SwitchProps) => {
  const { className, disabled = false, readMode = false } = props
  const [value, setValue] = useControllable({
    props,
    value: false,
  })
  return (
    <div
      {...mergeTag('switch', props)}
      className={cn('flex items-center', className)}
    >
      <div
        onClick={() => {
          if (!disabled && !readMode) setValue(!value)
        }}
        className={cn(
          'inline-flex items-center',
          'rounded-full',
          disabled || readMode
            ? 'pointer-events-none cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        )}
      >
        <div
          className={cn(
            'inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors',
            disabled || readMode
              ? 'disabled:cursor-not-allowed disabled:opacity-50'
              : 'cursor-pointer',
            value ? 'bg-primary' : 'bg-muted'
          )}
        >
          <div
            className={cn(
              'bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg transition-transform',
              value ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>
      </div>
    </div>
  )
}
