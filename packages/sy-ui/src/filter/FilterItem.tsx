import { Button } from '@/button'
import { Control as _Control } from '@/control'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { FilterControl, useFilterContext } from './shared'
import { CheckboxGroup } from '@/checkboxGroup'
import { pick } from '@syvobase/utils'
import { mergeTag } from '@/utils/tag'

export interface FilterItemValue {
  left: any
  op: any
  right: any
}
export interface FilterItemProps extends BaseValueProps<FilterItemValue> {
  className?: string
  onRemoveClick?: () => void
}

const Control = _Control as any

function getControlProps(filterControl: FilterControl, value: FilterItemValue) {
  return typeof filterControl === 'function'
    ? filterControl(value)
    : filterControl
}

export const FilterItem = (props: FilterItemProps) => {
  const { className, onRemoveClick } = props
  const [value, setValue] = useControllable<FilterItemProps, 'value'>({
    props,
    value: {
      left: '',
      op: '',
      right: '',
    },
  })

  const {
    left: _left,
    op: _op,
    right: _right,
    mode,
    getPresets,
  } = useFilterContext()

  const isAdvanced = mode === 'advanced'

  const left = getControlProps(_left, value) ?? {}
  const op = getControlProps(_op, value)
  const right = getControlProps(_right, value)

  const presets = getPresets(value) ?? []

  const hasPresets = presets.length > 0

  return (
    <>
      <div
        {...mergeTag('filter-item', props)}
        className={cn(
          'inline-flex items-center space-x-2 p-1',
          hasPresets && 'w-full!',
          !isAdvanced && 'px-4',
          className
        )}
      >
        <Control
          {...left}
          readMode={!isAdvanced}
          className={cn(isAdvanced ? 'w-[160px]' : 'mr-2', left.className)}
          value={value.left}
          onChange={(value: any) => {
            setValue({
              left: value,
              op: undefined,
              right: undefined,
            })
          }}
        />
        {hasPresets && (
          <CheckboxGroup
            multiple={false}
            value={JSON.stringify(pick(value, 'op', 'right'))}
            items={presets.map(({ value, name }) => ({
              id: JSON.stringify(pick(value, 'op', 'right')),
              name,
            }))}
            onChange={(value) => {
              const { op, right } = JSON.parse(value)
              setValue((value) => ({
                ...value,
                op,
                right,
              }))
            }}
          />
        )}
        {isAdvanced && op && typeof value.left !== 'undefined' && (
          <Control
            {...op}
            className={cn('w-[130px]', op.className)}
            value={value.op}
            onChange={(_value: any) => {
              setValue((value) => ({
                ...value,
                op: _value,
                right: undefined,
              }))
            }}
          />
        )}
        {right ? (
          <Control
            {...right}
            className={cn('min-w-20 flex-1', right.className)}
            value={value.right}
            onChange={(_value: any) => {
              setValue((value) => ({
                ...value,
                right: _value,
              }))
            }}
          />
        ) : (
          <div className='flex-1'></div>
        )}
        {isAdvanced && (
          <Button
            type='ghost'
            onlyIcon
            icon='CircleX'
            onClick={onRemoveClick}
          />
        )}
      </div>
    </>
  )
}
