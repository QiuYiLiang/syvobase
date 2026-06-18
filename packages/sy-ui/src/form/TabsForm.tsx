import { useContext } from 'react'
import { FlowForm } from './FlowForm'
import { GridForm } from './GridForm'
import { filterItems, FormContext, FormItems } from './shared'
import { Tabs, TabsProps } from '@/tabs'
import { mergeTag } from '@/utils/tag'

export interface TabsFormProps {
  full?: TabsProps['full']
  tabsType?: TabsProps['type']
  items: {
    id: string
    name: string
    items: FormItems
  }[]
}

export const TabsForm = (props: TabsFormProps) => {
  const { full = false, tabsType: tabType = 'pills', items } = props
  const { value } = useContext(FormContext)
  return (
    <Tabs
      {...mergeTag('tabs-form', props)}
      full={full}
      type={tabType}
      items={filterItems({ items, value }).map(({ id, name, items }) => ({
        id,
        name,
        content: Array.isArray(items) ? (
          <FlowForm items={items} />
        ) : typeof items === 'object' ? (
          <GridForm {...items} />
        ) : null,
      }))}
    />
  )
}
