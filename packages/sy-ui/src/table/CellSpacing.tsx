import { HTMLAttributes, ReactNode, RefAttributes } from 'react'
import { useTableContext } from './shared'
import { cn } from '@/utils'

interface CellSpacingProps
  extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {
  widthCount?: number
  children?: ReactNode
}
export const CellSpacing = ({
  ref,
  className,
  widthCount = 1,
  children,
  ...divProps
}: CellSpacingProps) => {
  const { levelWidth } = useTableContext()
  return (
    <div
      ref={ref}
      style={{
        width: widthCount * levelWidth,
      }}
      {...divProps}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </div>
  )
}
