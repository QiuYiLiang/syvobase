import { isObject } from './isObject'
import { get, has, set } from 'lodash-es'

export function transformObject(obj: any, createMapping: (v) => any) {
  const v = (defaultValue: any, transform?: (v: any) => any) => {
    return {
      __isProcessConfigV__: true,
      defaultValue,
      transform,
    }
  }
  const mapping = createMapping(v)
  function loop({
    obj,
    mapping,
  }: {
    obj: Record<string, any>
    mapping: Record<string, any>
  }) {
    for (const key in mapping) {
      const mappingItem = mapping[key]
      if (isObject(mappingItem)) {
        if (mappingItem.__isProcessConfigV__) {
          const { defaultValue, transform } = mappingItem
          if (has(obj, key)) {
            if (transform) {
              set(obj, key, transform(get(obj, key)))
            }
          } else {
            set(obj, key, defaultValue)
          }
        } else {
          if (!isObject(get(obj, key))) {
            set(obj, key, {})
          }
          loop({
            obj: get(obj, key),
            mapping: mappingItem,
          })
        }
      }
    }
  }
  loop({ obj, mapping })
  return obj
}
