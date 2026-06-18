import { BaseInputProps, useControllable } from '@/utils'
import { ReactNode } from 'react'
import { BaseNumber, BaseNumberProps } from './BaseNumber'
import { NumberRange } from './NumberRange'
import { mergeTag } from '@/utils/tag'

export interface NumberProps<V = any>
  extends
    BaseInputProps<V>,
    Omit<BaseNumberProps, 'defaultValue' | 'rules' | 'value' | 'onChange'> {
  range?: boolean
}

export const Number = ((props: NumberProps) => {
  const { range = false } = props
  const [value, setValue] = useControllable<NumberProps, 'value'>({
    props,
    value: range ? [] : undefined,
  })

  const Root = range ? NumberRange : BaseNumber

  return (
    <Root
      {...mergeTag('number', props)}
      {...props}
      value={value}
      onChange={setValue}
    />
  )
}) as <V = any>(props: NumberProps<V>) => ReactNode
