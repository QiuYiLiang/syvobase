import { createContext, useContext } from 'react'
import { FilterProps } from './Filter'
import { ControlProps } from '@/control'
import { FilterItemValue } from './FilterItem'
import { keyBy, Dict } from '@syvobase/utils'
import { $t } from '@/utils/i18n'

export const FilterContext = createContext(
  {} as Required<
    Pick<FilterProps, 'left' | 'op' | 'right' | 'mode' | 'getPresets'>
  >
)

export type FilterControl =
  | ControlProps
  | ((itemValue: FilterItemValue) => ControlProps)

export const useFilterContext = () => useContext(FilterContext)

// 创建常用的运算符
export const opItems = [
  {
    id: 'eq',
    name: $t('filter.operator.eq'),
  },
  {
    id: 'notEq',
    name: $t('filter.operator.not'),
  },
  {
    id: 'less',
    name: $t('filter.operator.less'),
  },
  {
    id: 'lessEq',
    name: $t('filter.operator.lessEq'),
  },
  {
    id: 'more',
    name: $t('filter.operator.more'),
  },
  {
    id: 'moreEq',
    name: $t('filter.operator.moreEq'),
  },
  {
    id: 'in',
    name: $t('filter.operator.in'),
  },
  {
    id: 'notIn',
    name: $t('filter.operator.notIn'),
  },
  {
    id: 'belong',
    name: $t('filter.operator.belong'),
  },
  {
    id: 'notBelong',
    name: $t('filter.operator.notBelong'),
  },
  {
    id: 'like',
    name: $t('filter.operator.like'),
  },
  {
    id: 'notLike',
    name: $t('filter.operator.notLike'),
  },
  {
    id: 'includes',
    name: $t('filter.operator.includes'),
  },
  {
    id: 'notIncludes',
    name: $t('filter.operator.notIncludes'),
  },
  {
    id: 'null',
    name: $t('filter.operator.null'),
  },
  {
    id: 'notNull',
    name: $t('filter.operator.notNull'),
  },
  {
    id: 'between',
    name: $t('filter.operator.between'),
  },
]

interface FilterOptonsItem {
  opItems: { id: string; name: string }[]
  opRightMap: Dict<ControlProps>
}

export interface GetFilterOptionsItem extends Dict {
  id: string
  control?: ControlProps
}

// 获取兼容 control 类型的 filter 选项
export function getFilterOptionsMap(options: {
  items: GetFilterOptionsItem[]
}) {
  const { items } = options

  const filterOptionsMap: Dict<FilterOptonsItem> = {}
  const opItemsMap = keyBy(opItems, 'id')

  const getOpItems = (ops: string[]) => ops.map((op) => opItemsMap[op])

  items.forEach(({ id, control = {} }) => {
    filterOptionsMap[id] = (() => {
      const { type, multiple = false } = control as {
        type: string
        multiple: boolean
      }

      switch (type) {
        case 'opt':
        case 'password':
        case 'qrcode':
        case 'textarea':
        case 'text': {
          return {
            opItems: getOpItems([
              'eq',
              'notEq',
              'like',
              'notLike',
              'null',
              'notNull',
            ]),
            opRightMap: {
              eq: {},
              notEq: {},
              like: {},
              notLike: {},
            },
          }
        }
        case 'checkbox':
        case 'switch':
        case 'colorPicker': {
          return {
            opItems: getOpItems(['eq', 'notEq', 'null', 'notNull']),
            opRightMap: {
              eq: control,
              notEq: control,
            },
          }
        }
        case 'draw':
        case 'mindmap':
        case 'file': {
          return {
            opItems: getOpItems(['null', 'notNull']),
            opRightMap: {},
          }
        }
        case 'number':
        case 'datePicker': {
          return {
            opItems: getOpItems([
              'eq',
              'notEq',
              'less',
              'lessEq',
              'more',
              'moreEq',
              'like',
              'notLike',
              'null',
              'notNull',
              'between',
            ]),
            opRightMap: {
              eq: control,
              notEq: control,
              less: control,
              lessEq: control,
              more: control,
              moreEq: control,
              like: {},
              notLike: {},
              between: { ...control, range: true },
            },
          }
        }
        case 'checkboxGroup':
        case 'select': {
          const _control =
            type === 'select'
              ? control
              : {
                  type: 'select',
                  isTree: false,
                  items: (control as any).items,
                }
          const eqControl = { ..._control, multiple: false, allowClear: true }
          const inControl = { ..._control, multiple: true, allowClear: true }
          return {
            opItems: getOpItems([
              'eq',
              'notEq',
              ...(multiple ? ['like', 'notLike'] : ['in', 'notIn']),
              'null',
              'notNull',
            ]),
            opRightMap: {
              eq: eqControl,
              notEq: eqControl,
              like: {},
              notLike: {},
              in: inControl,
              notIn: inControl,
            },
          }
        }
        default: {
          return {
            opItems: [],
            opRightMap: {},
          }
        }
      }
    })() as FilterOptonsItem
  })

  return filterOptionsMap
}
