import { BaseInputProps } from '@/utils'
import { Text, TextProps } from '@/text'
import { Dict } from '@syvobase/utils'

export interface BaseNumberProps
  extends
    BaseInputProps<number>,
    Omit<TextProps, 'defaultValue' | 'rules' | 'value' | 'onChange'> {
  max?: number
  min?: number
  zeroFilling?: number
  decimal?: number
}

export const BaseNumber = (props: BaseNumberProps) => {
  const { max, min, zeroFilling, decimal, value, onChange, ...otherProps } =
    props

  const numberValue = (() => {
    if (value === null || typeof value === 'undefined') {
      return ''
    }
    if (zeroFilling) {
      return value.toFixed(zeroFilling)
    }
    return value
  })()

  return (
    <Text
      {...(otherProps as Dict)}
      inlineMode
      htmlType='number'
      value={numberValue as any}
      onChange={(_value) => {
        const value = +_value
        if (typeof max !== 'undefined' && max < value) {
          onChange?.(max)
          return
        }
        if (typeof min !== 'undefined' && min > value) {
          onChange?.(min)
          return
        }
        if (_value === '') {
          onChange?.(undefined as any)
          return
        }
        let number: number = value
        if (typeof decimal === 'number') {
          number = parseFloat(value.toFixed(decimal))
        }
        onChange?.(number)
      }}
    />
  )
}
