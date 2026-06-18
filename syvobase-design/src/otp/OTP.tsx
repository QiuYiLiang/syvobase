import { OTPInput, OTPInputContext } from 'input-otp'
import { RefAttributes, useContext, useImperativeHandle } from 'react'
import {
  cn,
  useFocusClassName,
  BaseInputProps,
  BaseSizeProps,
  useControllable,
  BaseInputModel,
} from '@/utils'
import { useValidator, Validator } from '@/validation'
import { mergeTag } from '@/utils/tag'

export interface OTPProps
  extends BaseInputProps<string>, BaseSizeProps, RefAttributes<BaseInputModel> {
  length?: number
  onComplete?: (value: string) => void
}

export interface OTPItemProps extends BaseSizeProps {
  className: string
  index: number
}

const OTPItem = (props: OTPItemProps) => {
  const { className, index, size = 'default' } = props
  const inputOTPContext = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  const focusClassName = useFocusClassName(isActive)

  return (
    <div
      {...mergeTag('otp', props)}
      className={cn(
        'border-border relative flex items-center justify-center rounded border text-sm transition-all',
        focusClassName,
        {
          sm: 'size-7',
          default: 'size-8',
          lg: 'size-10',
        }[size],
        className
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='animate-caret-blink bg-foreground h-4 w-px duration-1000' />
        </div>
      )}
    </div>
  )
}

export const OTP = (props: OTPProps) => {
  const {
    ref,
    className,
    style,
    size = 'default',
    length = 6,
    disabled,
    readMode,
    inlineMode = false,
  } = props
  const [value, setValue, triggerUpdate] = useControllable({
    manualTriggerUpdate: inlineMode,
    props,
    value: '',
  })
  const { verifyClassName, validation, errorMsg } = useValidator({
    ...props,
    value,
  })
  useImperativeHandle(ref, () => ({
    validation,
    triggerUpdate,
  }))
  if (readMode) {
    return value
  }

  return (
    <Validator errorMsg={errorMsg} validation={validation}>
      <OTPInput
        value={value}
        containerClassName='flex items-center overflow-hidden gap-2 has-disabled:opacity-50 p-1'
        className={cn('disabled:cursor-not-allowed', className)}
        style={style}
        maxLength={length}
        onChange={setValue}
        disabled={disabled}
      >
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <OTPItem
              className={cn(verifyClassName, 'ring-offset-0!')}
              key={index}
              index={index}
              size={size}
            />
          ))}
      </OTPInput>
    </Validator>
  )
}
