import { BaseValueProps, cn, useControllable } from '@/utils'
import { FilterGroup, FilterGroupValue } from './FilterGroup'
import { useRef } from 'react'
import { FilterContext, FilterControl } from './shared'
import { FilterItemValue } from './FilterItem'
import { mergeTag } from '@/utils/tag'

export interface FilterProps extends BaseValueProps<FilterGroupValue> {
  border?: boolean
  value?: FilterGroupValue
  left?: FilterControl
  op?: FilterControl
  right?: FilterControl
  getPresets?: (
    value: FilterItemValue
  ) => { value: Omit<FilterItemValue, 'left'>; name: string }[]
  mode?: 'simple' | 'advanced'
}

export const Filter = (props: FilterProps) => {
  const {
    className,
    style,
    border = true,
    left = {},
    op = {},
    right = {},
    mode = 'advanced',
    getPresets = () => [],
  } = props
  const [value, setValue] = useControllable<FilterProps, 'value'>({
    props,
    value: {
      op: 'and',
      items: [],
    },
  })
  const ref = useRef(null)
  return (
    <FilterContext
      value={{
        left,
        op,
        right,
        mode,
        getPresets,
      }}
    >
      <FilterGroup
        {...mergeTag('filter', props)}
        className={cn(className)}
        style={style}
        ref={ref}
        border={border}
        value={value}
        onChange={setValue}
      />
    </FilterContext>
  )
}
