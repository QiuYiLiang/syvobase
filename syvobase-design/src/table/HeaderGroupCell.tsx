import { cn } from '@/utils'
import { useFixedStyle, useTableContext } from './shared'
import { Button } from '@/button'
import { ReactNode } from 'react'
import { mergeTag } from '@/utils/tag'

export interface HeaderGroupCellProps {
  name: ReactNode
  help?: ReactNode
  colSpan: number
  firstChildrenColumnId?: string
}

export const HeaderGroupCell = (props: HeaderGroupCellProps) => {
  const { name, help, colSpan, firstChildrenColumnId } = props
  const { borderClassName, cellPadding } = useTableContext()
  const { fixedClassName, fixedStyle } = useFixedStyle(firstChildrenColumnId!)
  return (
    <th
      {...mergeTag('table-header-group-cell', props)}
      className={cn(
        'bg-secondary cursor-pointer p-0 font-semibold',
        borderClassName,
        firstChildrenColumnId && 'z-52',
        fixedClassName
      )}
      style={{
        paddingTop: cellPadding.top,
        paddingRight: cellPadding.right,
        paddingBottom: cellPadding.bottom,
        paddingLeft: cellPadding.left,
        ...fixedStyle,
      }}
      colSpan={colSpan}
      rowSpan={1}
    >
      <div className='flex justify-center'>
        {name}
        {help && (
          <Button
            className='bg-transparent!'
            popover={help}
            type='ghost'
            size='sm'
            icon='BadgeQuestionMark'
            onlyIcon
          />
        )}
      </div>
    </th>
  )
}
