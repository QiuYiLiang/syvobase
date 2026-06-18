import { PlateLeaf, PlateLeafProps } from 'platejs/react'
import { cn } from '@/utils'

// 粗体
export const BoldLeaf = ({ className, children, ...props }: PlateLeafProps) => {
  return (
    <PlateLeaf as='strong' className={cn('font-bold', className)} {...props}>
      {children}
    </PlateLeaf>
  )
}

// 斜体
export const ItalicLeaf = ({
  className,
  children,
  ...props
}: PlateLeafProps) => {
  return (
    <PlateLeaf as='em' className={cn('italic', className)} {...props}>
      {children}
    </PlateLeaf>
  )
}

// 下划线
export const UnderlineLeaf = ({
  className,
  children,
  ...props
}: PlateLeafProps) => {
  return (
    <PlateLeaf as='u' className={cn('underline', className)} {...props}>
      {children}
    </PlateLeaf>
  )
}

// 删除线
export const StrikethroughLeaf = ({
  className,
  children,
  ...props
}: PlateLeafProps) => {
  return (
    <PlateLeaf as='s' className={cn('line-through', className)} {...props}>
      {children}
    </PlateLeaf>
  )
}

// 行内代码
export const CodeLeaf = ({ className, children, ...props }: PlateLeafProps) => {
  return (
    <PlateLeaf
      as='code'
      className={cn(
        'bg-muted text-primary rounded-md px-1.5 py-0.5 font-mono text-sm',
        className
      )}
      {...props}
    >
      {children}
    </PlateLeaf>
  )
}

// 字体颜色
export const ColorLeaf = ({
  className,
  children,
  leaf,
  ...props
}: PlateLeafProps) => {
  return (
    <PlateLeaf
      as='span'
      className={className}
      style={{ color: (leaf as any)?.color }}
      leaf={leaf}
      {...props}
    >
      {children}
    </PlateLeaf>
  )
}

// 背景颜色
export const BackgroundColorLeaf = ({
  className,
  children,
  leaf,
  ...props
}: PlateLeafProps) => {
  return (
    <PlateLeaf
      as='span'
      className={cn('rounded-sm px-0.5', className)}
      style={{ backgroundColor: (leaf as any)?.backgroundColor }}
      leaf={leaf}
      {...props}
    >
      {children}
    </PlateLeaf>
  )
}
