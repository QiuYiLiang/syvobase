import { Dict } from '@syvobase/utils'
import { FlowFormProps } from './FlowForm'
import { GridFormProps } from './GridForm'
import { BaseValueProps } from '@/utils'
import { PanelProps } from '@/panel'
import { createContext, CSSProperties, Ref, RefAttributes } from 'react'
import { ValidationModel } from '@/validation'

export type FormItems = FlowFormProps['items'] | GridFormProps

export interface FormModel extends ValidationModel {}

export interface FormProps<V = Dict>
  extends
    BaseValueProps<V>,
    Pick<
      PanelProps,
      | 'type'
      | 'border'
      | 'fixed'
      | 'header'
      | 'footer'
      | 'topToolbar'
      | 'toolbar'
    >,
    RefAttributes<FormModel> {
  className?: string
  style?: CSSProperties
  readMode?: boolean
  disabled?: boolean
  defaultValue?: V
  padding?: number
  labelWidth?: number
  items: FormItems
  width?: number | string
  value?: V
  topLabel?: boolean
  onChange?: (value: V) => void
  onFieldChange?: (id: string, value: any) => void
}

export type InputModelRefsMap = Dict<Ref<any>>

export interface FormContextType extends FormProps {
  handleInputChange: (id: string, value: any) => void
}

export const FormContext = createContext({} as FormContextType)

export function filterItems<V>({ items, value }: { items: V; value?: Dict }) {
  return (items as any).filter(({ visible }) => {
    if (typeof visible === 'function') {
      return visible(value || {})
    }
    return true
  }) as V
}
