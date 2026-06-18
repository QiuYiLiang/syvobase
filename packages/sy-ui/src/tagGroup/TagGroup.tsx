import { ReactNode } from 'react'
import { IconName } from '@/icon'
import { Tag, TagProps, tagStyleMap } from '@/tag'
import { BaseProps, BaseSizeProps } from '@/utils'
import { mergeTag } from '@/utils/tag'

export interface TagGroupProps<V = any> extends BaseProps, BaseSizeProps {
  value?: V[]
  rounded?: boolean
  border?: boolean
  noStyle?: boolean
  getName?: (item: V) => string
  getColor?: (item: V) => TagProps['color']
  getIcon?: (item: V) => IconName
}

const tagColors = Object.keys(tagStyleMap)

function getHashPick(str, arr) {
  let hash = 0

  // 遍历字符串，累加字符编码
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }

  // 返回数组中对应的元素
  return arr[hash % arr.length]
}

export const TagGroup = ((props: TagGroupProps) => {
  const {
    value = [],
    rounded,
    border,
    size,
    noStyle = false,
    getName = (item) => item,
    getColor,
    getIcon,
  } = props
  return (
    <div {...mergeTag('tag-group', props)} className='flex flex-wrap'>
      {value.map((item, index) => {
        const name = getName(item)

        return noStyle ? (
          `${index === 0 ? '' : ','}${name}`
        ) : (
          <Tag
            key={index}
            className='m-0.5'
            color={
              getColor?.(item) ||
              (getHashPick(name, tagColors) as TagProps['color'])
            }
            rounded={rounded}
            border={border}
            icon={getIcon?.(item)}
            size={size}
          >
            {name}
          </Tag>
        )
      })}
    </div>
  )
}) as <V = any>(props: TagGroupProps<V>) => ReactNode
