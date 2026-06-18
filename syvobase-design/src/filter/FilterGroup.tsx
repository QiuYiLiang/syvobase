import { FilterItem, FilterItemValue } from './FilterItem'
import { RefAttributes } from 'react'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { $t } from '@/utils/i18n'
import { Select } from '@/select'
import { Button } from '@/button'
import { useFilterContext } from './shared'
import { mergeTag } from '@/utils/tag'

export interface FilterGroupValue {
  op: 'and' | 'or'
  items: (FilterGroupValue | FilterItemValue)[]
}

export interface FilterGroupProps
  extends BaseValueProps<FilterGroupValue>, RefAttributes<HTMLDivElement> {
  border?: boolean
  onRemoveClick?: () => void
}

export const FilterGroup = (props: FilterGroupProps) => {
  const { ref, className, style, border = true, onRemoveClick } = props
  const [value, setValue] = useControllable<FilterGroupProps, 'value'>({
    props,
    value: {
      op: 'and',
      items: [],
    },
  })
  const { op, items } = value
  const { mode } = useFilterContext()
  const groupOpsItems = [
    {
      id: 'and',
      name: $t('filter.all'),
    },
    {
      id: 'or',
      name: $t('filter.any'),
    },
  ]
  const addItem = () => {
    setValue((value) => ({
      ...value,
      items: [
        ...value.items,
        {
          left: undefined,
          op: undefined,
          right: undefined,
        },
      ],
    }))
  }
  const addGroup = () => {
    setValue((value) => ({
      ...value,
      items: [
        ...value.items,
        {
          op: 'and',
          items: [],
        },
      ],
    }))
  }

  const isAdvanced = mode === 'advanced'
  return (
    <div
      ref={ref}
      {...mergeTag('filter-group', props)}
      className={cn(
        'flex w-full flex-col space-y-2 overflow-auto',
        isAdvanced && 'p-2',
        border && 'border-border rounded-lg border',
        className
      )}
      style={style}
    >
      {isAdvanced && (
        <div className='flex items-center justify-between space-x-1'>
          <div className='flex items-center space-x-2'>
            <div>{$t('filter.satisfy')}</div>
            <Select
              className='w-auto'
              value={op}
              items={groupOpsItems}
              onChange={(_value) => {
                setValue((value) => ({
                  ...value,
                  op: _value as FilterGroupValue['op'],
                }))
              }}
            />
            <div>{$t('filter.condition')}</div>
          </div>
          <div className='space-x-1'>
            <Button onlyIcon icon='Plus' type='ghost' onClick={addItem}>
              {$t('filter.add')}
            </Button>
            <Button onlyIcon icon='FolderPlus' type='ghost' onClick={addGroup}>
              {$t('filter.addGroup')}
            </Button>
            {onRemoveClick && (
              <Button icon='CircleX' type='ghost' onClick={onRemoveClick} />
            )}
          </div>
        </div>
      )}
      <div className={isAdvanced ? 'flex flex-col' : 'flex-wrap'}>
        {items.map((item: any, index) => {
          const props = {
            value: item,
            onChange: (_value) => {
              setValue((value) => {
                value.items[index] = _value
                return {
                  ...value,
                }
              })
            },
            onRemoveClick: () => {
              setValue((value) => {
                value.items.splice(index, 1)
                return {
                  ...value,
                }
              })
            },
          }

          if (item.items) {
            return isAdvanced && <FilterGroup key={index} {...props} />
          }
          // TODO: 根据父容器，响应式宽度
          return <FilterItem key={index} {...props} />
        })}
      </div>
    </div>
  )
}
