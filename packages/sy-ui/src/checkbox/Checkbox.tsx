import { Icon } from '@/icon'
import {
  cn,
  BaseBooleanInputProps,
  useControllable,
  BaseInputModel,
} from '@/utils'
import { RefAttributes, useImperativeHandle } from 'react'
import { Validator, useValidator } from '@/validation'
import { Button } from '@/button'
import { mergeTag } from '@/utils/tag'

export interface CheckboxProps
  extends BaseBooleanInputProps, RefAttributes<BaseInputModel> {
  indeterminate?: boolean
  rounded?: boolean
  styleType?: 'pills' | 'classic'
  name?: string
}

export const Checkbox = (props: CheckboxProps) => {
  const {
    ref,
    className,
    style,
    styleType = 'classic',
    readMode = false,
    indeterminate: _indeterminate = false,
    disabled: _disabled = false,
    rounded = false,
    name,
  } = props
  const disabled = _disabled || readMode
  const [value, setValue] = useControllable<CheckboxProps, 'value'>({
    props,
    value: false,
  })
  const { verifyClassName, validation, errorMsg } = useValidator({
    ...props,
    value,
  })
  useImperativeHandle(ref, () => ({
    validation,
  }))
  const indeterminate = !rounded && _indeterminate
  return (
    <Validator errorMsg={errorMsg} validation={validation}>
      {styleType === 'pills' ? (
        <Button
          {...mergeTag('checkbox', props)}
          className={className}
          style={style}
          type={value ? 'default' : 'ghost'}
          size='sm'
          onClick={() => {
            setValue((value) => !value)
          }}
        >
          {name}
        </Button>
      ) : (
        <div
          {...mergeTag('checkbox', props)}
          className={cn('flex items-center', className)}
          style={style}
        >
          <div
            className={cn(
              'peer border-border bg-background h-4 w-4 cursor-pointer rounded-sm border',
              disabled && 'cursor-not-allowed rounded-sm opacity-50',
              value && 'text-primary-foreground',
              !rounded && value && 'bg-primary',
              rounded && 'flex items-center justify-center rounded-full',
              indeterminate && 'flex items-center justify-center',
              verifyClassName
            )}
            onClick={() => {
              setValue(!value)
            }}
          >
            {value ? (
              <div
                className={cn('flex items-center justify-center text-current')}
              >
                {rounded ? (
                  <div className='bg-primary size-2 rounded-full'></div>
                ) : (
                  <Icon name='Check' />
                )}
              </div>
            ) : (
              indeterminate && (
                <div className='bg-primary size-2 rounded-[3px]'></div>
              )
            )}
          </div>
          {name && (
            <div
              className={cn(
                'flex h-[16px] cursor-pointer items-center pl-2 text-sm leading-[16px]! font-medium',
                disabled && 'cursor-not-allowed opacity-70'
              )}
              onClick={() => {
                setValue(!value)
              }}
            >
              {name}
            </div>
          )}
        </div>
      )}
    </Validator>
  )
}
