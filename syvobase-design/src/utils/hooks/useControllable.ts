import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { has } from '@syvobase/utils'

export function useControllable<
  P extends Record<string, any>,
  K extends keyof P = 'value',
  S = P[K],
  V = Exclude<S, undefined>,
>({
  value: innerValue,
  props,
  valueKey = 'value',
  onChangeKey = 'onChange',
  defaultValueKey = 'defaultValue',
  manualTriggerUpdate = false,
  onGetValue = (value) => value,
  onSetValue = (value) => value,
}: {
  value: S | (() => S)
  props: P
  valueKey?: keyof P
  onChangeKey?: keyof P
  defaultValueKey?: keyof P
  inlineModeKey?: keyof P
  manualTriggerUpdate?: boolean
  onGetValue?: (value: S) => S
  onSetValue?: (value: S) => S
}): [V, Dispatch<SetStateAction<V>>, () => void] {
  const [_value, _setValue] = useState<S>(() => {
    const defaultValue = has(props, defaultValueKey as string)
      ? (props as any)[defaultValueKey]
      : innerValue
    if (manualTriggerUpdate) {
      const value = props[valueKey]
      return typeof value === 'undefined' ? defaultValue : value
    }
    return onGetValue(defaultValue)
  })

  const setValue = (newValue: any) => {
    _setValue(
      typeof newValue === 'function'
        ? (value) => onSetValue(newValue(value))
        : onSetValue(newValue)
    )
  }

  useEffect(() => {
    if (
      manualTriggerUpdate &&
      has(props, valueKey as string) &&
      props[valueKey] !== _value
    ) {
      // 外部更新值需要同步内部值
      setValue(props[valueKey])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props[valueKey]])

  if (has(props, valueKey as string)) {
    const value = (typeof props[valueKey] === 'undefined'
      ? _value
      : onGetValue(props[valueKey])) as unknown as V
    if (manualTriggerUpdate) {
      return [
        _value,
        setValue,
        () => {
          if (onGetValue(props[valueKey]) === _value) {
            return
          }
          props[onChangeKey]?.(_value)
        },
      ] as any
    }

    return [
      value,
      (newValue: any) => {
        props[onChangeKey]?.(
          onSetValue(
            typeof newValue === 'function' ? newValue(value) : newValue
          )
        )
      },
      () => {},
    ]
  }

  return [_value, _setValue, () => {}] as any
}
