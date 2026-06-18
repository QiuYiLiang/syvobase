import { Pagination } from '@/pagination'
import { cn, DataProp, useToolbarProps } from '@/utils'
import { Filter } from '@/filter'
import { Toolbar } from '@/toolbar'
import { mergeTag } from '@/utils/tag'

export interface DataProps extends DataProp {}

export const Data = (props: DataProps) => {
  const {
    className,
    style,
    filter: filterProps,
    toolbar = [],
    pagination: paginationProps,
    children,
  } = props

  const [hasToolbar, toolbarProps] = useToolbarProps(toolbar, {
    align: 'right',
  })

  return (
    <div
      {...mergeTag('data', props)}
      className={cn('flex flex-col space-y-2', className)}
      style={style}
    >
      {filterProps && <Filter className='w-full' {...filterProps} />}
      {hasToolbar && <Toolbar className='w-full' {...toolbarProps} />}
      {children}
      {paginationProps && (
        <Pagination className='w-full' {...paginationProps} />
      )}
    </div>
  )
}
