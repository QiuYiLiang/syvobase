import {
  cn,
  BaseTextProps,
  BaseInputModel,
  useControllable,
  useFocusClassName,
  useKeydown,
} from '@/utils'
import {
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  ReactNode,
  RefAttributes,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useValidator, Validator } from '@/validation'
import { mergeTag } from '@/utils/tag'

export interface TextProps
  extends BaseTextProps, RefAttributes<BaseInputModel> {
  htmlType?: HTMLInputTypeAttribute
  max?: number
  before?: ReactNode
  after?: ReactNode
  border?: boolean
  onKeyDown?: KeyboardEventHandler
  onKeyUp?: KeyboardEventHandler
}

export const Text = (props: TextProps) => {
  const {
    ref,
    className,
    readMode,
    htmlType,
    placeholder,
    max,
    style,
    disabled,
    before,
    border = true,
    size = 'default',
    after,
    inlineMode,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur,
  } = props

  const [value, setValue, triggerUpdate] = useControllable<TextProps, 'value'>({
    manualTriggerUpdate: inlineMode,
    props,
    value: '',
  })

  const { verifyClassName, validation, errorMsg } = useValidator({
    ...props,
    value,
  })

  const blur = () => {
    setFocus(false)
    onBlur?.()
    triggerUpdate()
    validation({
      trigger: 'blur',
      value,
    })
  }

  useKeydown('Enter', () => {
    blur()
  })

  useImperativeHandle(ref, () => ({
    validation,
  }))

  const [focus, setFocus] = useState(false)

  const focusClassName = useFocusClassName(focus)

  const inputRef = useRef<HTMLInputElement>(null)

  if (readMode) {
    return [null, undefined, ''].includes(value) ? (
      <div {...mergeTag('text', props)} className='inline'>
        &nbsp;
      </div>
    ) : (
      value
    )
  }

  return (
    <Validator errorMsg={errorMsg} validation={validation}>
      <div
        {...mergeTag('text', props)}
        className={cn(
          'bg-background placeholder:text-muted-foreground relative flex w-full cursor-text items-center text-sm disabled:cursor-not-allowed disabled:opacity-50',
          border && 'border-border rounded-md border',
          border && !disabled && focusClassName,
          className,
          {
            sm: 'h-7 p-2',
            default: 'h-8 p-2',
            lg: 'h-10 px-3 py-2',
          }[size],
          verifyClassName
        )}
        style={style}
        onClickCapture={() => {
          inputRef.current?.focus()
        }}
      >
        {disabled && (
          <div className='bg-background absolute top-0 left-0 z-50 h-full w-full cursor-not-allowed rounded-md opacity-50'></div>
        )}
        <div className='flex w-full items-center space-x-2'>
          {before}
          <input
            type={htmlType}
            ref={inputRef}
            className={cn(
              'relative top-[-.5px] m-0 h-6 w-full flex-1 overflow-visible! border-none bg-transparent p-0 outline-none'
            )}
            disabled={disabled}
            value={value ?? ''}
            placeholder={placeholder}
            max={max}
            onChange={async (e) => {
              const value = e.target.value as string
              validation({
                trigger: 'change',
                value,
              })
              setValue?.(
                typeof max === 'number' && max < value.length
                  ? value.substring(0, max)
                  : value
              )
            }}
            onFocus={() => {
              setFocus(true)
              onFocus?.()
            }}
            onBlur={blur}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
          />
          {after}
        </div>
      </div>
    </Validator>
  )
}
