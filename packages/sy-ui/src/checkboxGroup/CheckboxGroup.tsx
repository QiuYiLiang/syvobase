import { keyBy, Dict, keysToMap } from '@syvobase/utils'
import {
  cn,
  useControllable,
  BaseOrientationProps,
  BaseSelectProps,
  getSelectControllableOptions,
  BaseInputModel,
} from '@/utils'
import { Checkbox, CheckboxProps } from '@/checkbox'
import { ReactNode, RefAttributes, useImperativeHandle, useRef } from 'react'
import { useValidator, Validator } from '@/validation'
import { TagGroup, TagGroupProps } from '@/tagGroup'
import { mergeTag } from '@/utils/tag'

export interface CheckboxGroupProps<V = any>
  extends
    BaseSelectProps<V>,
    BaseOrientationProps,
    RefAttributes<BaseInputModel> {
  allowClear?: boolean
  tagGroup?: TagGroupProps
  styleType?: CheckboxProps['styleType']
  cacheTextMap?: Dict
}

export const CheckboxGroup = ((props) => {
  const {
    ref,
    className,
    style,
    items = [],
    multiple = true,
    disabled,
    readMode,
    allowClear = false,
    fieldNames = {},
    tagGroup = {},
    orientation = 'horizontal',
    commaSplit = false,
    styleType = 'pills',
    onDisabledItem,
    cacheTextMap = {},
  } = props

  const [value, setValue] = useControllable<CheckboxGroupProps, 'value'>({
    props,
    value: undefined,
    ...getSelectControllableOptions({
      multiple,
      commaSplit,
    }),
  })

  const { validation, errorMsg } = useValidator({
    ...props,
    value,
  })

  const valueMap = keysToMap(value)
  const {
    idKey = 'id',
    nameKey = 'name',
    colorKey = 'color',
    disabledKey = 'disabled',
  } = fieldNames
  const itemsMap = keyBy(items, idKey)
  const cacheTextMapRef = useRef<Record<string, string>>({})
  const getText = (value: string) => {
    const item: any = itemsMap[value] ?? {}
    const text =
      item[nameKey] ??
      cacheTextMapRef.current[value] ??
      cacheTextMap[value] ??
      value ??
      ''
    if (text !== value) {
      cacheTextMapRef.current[value] = text
    }
    return text
  }

  useImperativeHandle(ref, () => ({
    validation,
    getText,
  }))

  if (readMode) {
    return (
      <TagGroup
        value={value}
        getName={(id) => getText(id)}
        getColor={(id) => {
          return itemsMap[id]?.[colorKey]
        }}
        {...tagGroup}
      />
    )
  }

  return (
    <Validator errorMsg={errorMsg} validation={validation}>
      <div
        {...mergeTag('checkbox-group', props)}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-wrap',
          className
        )}
        style={style}
      >
        {items.map((item) => {
          const id = item[idKey]
          return (
            <Checkbox
              key={id}
              styleType={styleType}
              rounded={!multiple}
              className={'mx-2 my-1'}
              value={!!valueMap[id]}
              disabled={
                disabled ||
                readMode ||
                item[disabledKey] ||
                (typeof onDisabledItem === 'function'
                  ? onDisabledItem({ data: item })
                  : false)
              }
              name={item[nameKey]}
              onChange={(checked) => {
                const newValue = multiple
                  ? value.filter((_id) => _id !== id)
                  : []
                if (checked) {
                  newValue.push(id)
                }
                if (!allowClear && !multiple && newValue.length === 0) {
                  return
                }
                setValue(newValue)
              }}
            />
          )
        })}
      </div>
    </Validator>
  )
}) as <V = any>(props: CheckboxGroupProps<V>) => ReactNode
