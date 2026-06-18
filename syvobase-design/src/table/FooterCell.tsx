import { cn } from '@/utils'
import { ColumnType, useFixed, useTableContext } from './shared'
import { useRef } from 'react'
import { mergeTag } from '@/utils/tag'

export interface FooterCell {
  column: ColumnType
}

export const FooterCell = (props: FooterCell) => {
  const {
    column: { id, fixed, align = 'left', onFooterRender },
  } = props
  const { border, borderClassName, cellPadding } = useTableContext()
  const ref = useRef(null)
  const { fixedClassName, fixedStyle } = useFixed({ columnId: id })
  return (
    <td
      {...mergeTag('table-footer-cell', props)}
      className={cn(
        'bg-background',
        borderClassName,
        border !== 'none' && 'border-t',
        fixed === 'left' && 'z-51',
        fixed === 'right' && 'z-50',
        fixedClassName
      )}
      ref={ref}
      style={{
        paddingTop: cellPadding.top,
        paddingRight: cellPadding.right,
        paddingBottom: cellPadding.bottom,
        paddingLeft: cellPadding.left,
        ...fixedStyle,
      }}
    >
      <div
        className={cn(
          'flex',
          {
            left: 'justify-start',
            center: 'justify-center',
            right: 'justify-end',
          }[align as string]
        )}
      >
        {typeof onFooterRender === 'function' && onFooterRender()}
      </div>
    </td>
  )
}
