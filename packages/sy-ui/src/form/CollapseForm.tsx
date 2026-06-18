import { Collapse, CollapseProps } from '@/collapse'
import { FlowForm } from './FlowForm'
import { GridForm } from './GridForm'
import { filterItems, FormContext, FormItems } from './shared'
import { useContext } from 'react'
import { mergeTag } from '@/utils/tag'

export interface CollapseFormProps extends Pick<
  CollapseProps,
  'multiple' | 'defaultValue'
> {
  size?: CollapseProps['size']
  collapseType?: CollapseProps['type']
  items: {
    id: string
    name: string
    items: FormItems
  }[]
}

export const CollapseForm = (props: CollapseFormProps) => {
  const { size, collapseType = 'group', multiple, defaultValue, items } = props
  const { value } = useContext(FormContext)
  return (
    <Collapse
      {...mergeTag('collapse-form', props)}
      type={collapseType}
      size={size}
      multiple={multiple}
      defaultValue={defaultValue}
      items={filterItems({ items, value }).map(({ id, name, items }) => ({
        id,
        name,
        content: Array.isArray(items) ? (
          <FlowForm items={items} />
        ) : typeof items === 'object' ? (
          <GridForm {...items} />
        ) : null,
      }))}
      border={false}
    />
  )
}
