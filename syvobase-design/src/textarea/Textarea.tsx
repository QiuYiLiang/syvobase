import {
  cn,
  useFocusClassName,
  BaseInputProps,
  BasePlaceholderProps,
  BaseInputModel,
  useControllable,
} from '@/utils'
import { RefAttributes, useImperativeHandle, useState } from 'react'
import { useValidator, Validator } from '@/validation'
import { mergeTag } from '@/utils/tag'

export interface TextareaProps
  extends
    BaseInputProps<string>,
    BasePlaceholderProps,
    RefAttributes<BaseInputModel> {
  rows?: number
  cols?: number
}

export const Textarea = (props: TextareaProps) => {
  const {
    ref,
    className,
    style,
    rows,
    cols,
    readMode,
    disabled,
    inlineMode = false,
    placeholder,
  } = props

  const [value, setValue, triggerUpdate] = useControllable<
    TextareaProps,
    'value'
  >({
    props,
    value: '',
    manualTriggerUpdate: inlineMode,
  })

  const { verifyClassName, validation, errorMsg } = useValidator({
    ...props,
    value,
  })

  useImperativeHandle(ref, () => ({
    validation,
  }))

  const [focus, setFocus] = useState(false)

  const focusClassName = useFocusClassName(focus)

  if (readMode) {
    return value
  }

  return readMode ? (
    value
  ) : (
    <Validator errorMsg={errorMsg} validation={validation}>
      <textarea
        {...mergeTag('textarea', props)}
        disabled={disabled}
        className={cn(
          'border-border bg-background placeholder:text-muted-foreground relative flex w-full cursor-text items-center rounded-md border p-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          focusClassName,
          className,
          verifyClassName
        )}
        rows={rows}
        cols={cols}
        style={style}
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          setFocus(true)
        }}
        onBlur={() => {
          setFocus(false)
          triggerUpdate()
        }}
        onChange={(e) => {
          setValue?.(e.target.value)
        }}
      />
    </Validator>
  )
}
