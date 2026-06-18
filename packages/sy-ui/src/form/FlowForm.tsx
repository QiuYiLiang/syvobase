import { useContext } from 'react'
import { Cell, CellProps } from './Cell'
import { filterItems, FormContext } from './shared'
import { mergeTag } from '@/utils/tag'

export interface FlowFormProps {
  items: (CellProps[] | CellProps)[]
}

export const FlowForm = (props: FlowFormProps) => {
  const { items } = props
  const { value } = useContext(FormContext)
  return (
    <div {...mergeTag('flow-form', props)}>
      {filterItems({ items, value }).map((item, index) => (
        <div className='flex' key={(item as any).id ?? index}>
          {filterItems({
            items: Array.isArray(item) ? item : [item],
            value,
          }).map((subItem, subIndex) => (
            <FlowFormCell key={(subItem as any).id ?? subIndex} {...subItem} />
          ))}
        </div>
      ))}
    </div>
  )
}

export type FlowFormCellProps = {
  width?: number
} & CellProps

const FlowFormCell = ({ width = 100, ...cellProps }: FlowFormCellProps) => {
  return (
    <div
      style={{
        width: `${width}%`,
      }}
    >
      <Cell {...cellProps} />
    </div>
  )
}
