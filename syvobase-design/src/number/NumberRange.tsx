import { cn, useFocusClassName } from '@/utils'
import { BaseNumber, BaseNumberProps } from './BaseNumber'
import { useState } from 'react'
import { useValidator, Validator } from '@/validation'

export interface NumberRangeProps extends Omit<
  BaseNumberProps,
  'defaultValue' | 'rules' | 'value' | 'onChange'
> {
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export const NumberRange = (props: NumberRangeProps) => {
  const {
    className,
    style,
    value,
    onChange,

    readMode,
    ...commonProps
  } = props
  const { verifyClassName, validation, errorMsg } = useValidator({
    ...props,
    value: value as any,
  })
  const { disabled = false } = props
  const baseNumberProps = {
    ...commonProps,
    className: 'flex-1 overflow-visible!',
    border: false,
  }
  const number1 = value[0]
  const number2 = value[1]
  const [focus1, setFocus1] = useState(false)
  const [focus2, setFocus2] = useState(false)
  const focusClassName = useFocusClassName(focus1 || focus2)

  if (readMode) {
    return value
      ? `${typeof number1 === 'number' ? value : ''} ~ ${typeof number2 === 'number' ? value : ''}`
      : ''
  }

  return (
    <Validator errorMsg={errorMsg} validation={validation}>
      <div
        className={cn(
          'border-border flex w-full items-center overflow-hidden rounded-md border',
          disabled && 'opacity-50',
          !disabled && focusClassName,
          verifyClassName,
          className
        )}
        style={style}
      >
        <BaseNumber
          {...baseNumberProps}
          value={number1}
          onChange={(_value) => {
            let newValue = _value
            if (typeof number2 === 'number' && newValue > number2) {
              newValue = number2
            }
            onChange([newValue, number2])
          }}
          onFocus={() => setFocus1(true)}
          onBlur={() => setFocus1(false)}
        />
        <div>~</div>
        <BaseNumber
          {...baseNumberProps}
          value={value[1]}
          onChange={(_value) => {
            let newValue = _value
            if (typeof number1 === 'number' && newValue < number1) {
              newValue = number1
            }
            onChange([number1, newValue])
          }}
          onFocus={() => setFocus2(true)}
          onBlur={() => setFocus2(false)}
        />
      </div>
    </Validator>
  )
}
