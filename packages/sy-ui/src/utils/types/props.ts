import {
  Dict,
} from '@syvobase/utils'
import { CSSProperties, ReactNode } from 'react'
import { ValidatorProps } from '@/validation'
import { FilterProps } from '@/filter'
import { ToolbarProps } from '@/toolbar'
import { PaginationProps } from '@/pagination'

export type Validator<V> = (value: V) => Promise<void> | void

export type DefaultRuleTrigger = 'blur' | 'change' | string

export interface ValidatorRule<V, T = DefaultRuleTrigger> {
  trigger?: T
  required?: boolean
  validator?: Validator<V>
}

export type ValidatorRules<V> = ValidatorRule<V>[]

export interface ValidatorModelOptions<V> {
  rules: ValidatorRules<V>
  emptyMessage: string
}

export interface ValidateOtpions<T = DefaultRuleTrigger> {
  trigger?: T
  value?: any
}

export class ValidatorModel<V = any> {
  rules: ValidatorRules<V> = []
  emptyMessage: string
  constructor({ rules, emptyMessage }: ValidatorModelOptions<V>) {
    this.rules = rules
    this.emptyMessage = emptyMessage
  }
  async validation({ trigger: _trigger, value }: ValidateOtpions = {}) {
    for (const { trigger, required, validator } of this.rules) {
      if (
        required &&
        (!value || value === 0 || (Array.isArray(value) && value.length === 0))
      ) {
        throw new Error(this.emptyMessage)
      }
      if (!_trigger || trigger === _trigger) {
        await validator?.(value)
      }
    }
  }
}

export interface FieldNamesType {
  idKey?: string
  nameKey?: string
  parentIdKey?: string
  orderKey?: string
  isLeafKey?: string
  colorKey?: string
  disabledKey?: string
  startDateKey?: string
  endDateKey?: string
  percentageKey?: string
}

export type OnDisabledItem = (item: Dict) => boolean














export interface BaseProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export interface BaseValueProps<V> extends BaseProps {
  defaultValue?: V
  value?: V
  onChange?: (value: V) => void
}

export interface RulesProps<V = any> {
  required?: boolean
  rules?: ValidatorRules<V>
}

export interface BaseInputProps<V>
  extends
    BaseValueProps<V>,
    InlineModeProps,
    Omit<ValidatorProps, 'children'>,
    RulesProps<V> {
  readMode?: boolean
  disabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export interface InlineModeProps {
  inlineMode?: boolean
}

export interface BasePlaceholderProps {
  placeholder?: string
}

export interface BaseOrientationProps {
  orientation?: 'horizontal' | 'vertical'
}

export interface BaseAllowClearProps {
  allowClear?: boolean
}

export interface BaseSizeProps {
  size?: 'default' | 'sm' | 'lg'
}

export interface BaseDirectionProps {
  direction?: 'center' | 'top' | 'right' | 'bottom' | 'left'
}
export interface BaseAlignProps {
  align?: 'left' | 'center' | 'right'
}

export interface BaseTextProps
  extends BaseInputProps<string>, BasePlaceholderProps, BaseSizeProps {}

export interface BaseBooleanInputProps extends BaseInputProps<boolean> {}

export interface BaseSelectProps<V> extends BaseInputProps<V> {
  items?: Dict[]
  multiple?: boolean
  fieldNames?: FieldNamesType
  commaSplit?: boolean
  onDisabledItem?: OnDisabledItem
}

export interface DataProp extends BaseProps {
  filter?: FilterProps
  toolbar?: ToolbarProps | ToolbarProps['items']
  pagination?: PaginationProps
}
