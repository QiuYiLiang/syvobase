import { strToArray } from '@syvobase/utils'

export function getSelectControllableOptions(
  options: {
    multiple?: boolean
    commaSplit?: boolean
  } = {}
): {
  onGetValue?: (value: any) => any
  onSetValue?: (value: any) => any
} {
  const { multiple = false, commaSplit = false } = options
  return {
    onGetValue: (_value: any) => {
      let value: any = _value
      if (!multiple) {
        // 单选值存储的文本，需要转为多选值
        value ??= ''
        return value === '' ? [] : [value]
      } else if (commaSplit) {
        // 开启逗号分割，需要转为多选值
        value ??= ''
        return value === '' ? [] : strToArray(value)
      }
      value ??= []
      return value
    },
    onSetValue: (_newValue: any[]) => {
      const newValue = _newValue
      if (!multiple) {
        return newValue[0]
      } else if (commaSplit) {
        return newValue.join(',')
      }
      return newValue
    },
  }
}
