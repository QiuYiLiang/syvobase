import { Icon } from '@/icon/Icon'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { icons } from './shared'
import { iconNames } from '@/icon/shared'
import { Text } from '@/text'
import { useState } from 'react'

export interface IconSelectsProps extends BaseValueProps<string> {
  full?: boolean
}

export const IconSelects = (props: IconSelectsProps) => {
  const { full } = props
  const [value, setValue] = useControllable<IconSelectsProps, 'value'>({
    props,
    value: icons[0],
  })
  const [searchKeyword, setSearchKeyword] = useState('')

  const filteredIcons = (() => {
    const sourceIcons = full ? iconNames : icons
    if (!full || !searchKeyword.trim()) {
      return sourceIcons
    }
    const lowerKeyword = searchKeyword.toLowerCase()
    return sourceIcons.filter((icon) =>
      icon.toLowerCase().includes(lowerKeyword)
    )
  })()

  const content = (
    <div className={cn('grid grid-cols-8 gap-1', full && 'grid-cols-12')}>
      {filteredIcons.map((icon) => (
        <div
          key={icon}
          data-name={icon}
          className={cn(
            'bg-secondary flex size-8 cursor-pointer items-center justify-center rounded-lg',
            value === icon && 'ring-primary ring ring-offset-1'
          )}
          onClick={() => {
            setValue(icon)
          }}
        >
          <Icon className='text-secondary-foreground' name={icon} />
        </div>
      ))}
    </div>
  )
  if (full) {
    return (
      <div className='flex flex-col gap-2'>
        <Text
          placeholder='搜索图标...'
          value={searchKeyword}
          onChange={setSearchKeyword}
          before={<Icon name='Search' className='text-muted-foreground' />}
        />
        <div>{content}</div>
      </div>
    )
  }
  return content
}
