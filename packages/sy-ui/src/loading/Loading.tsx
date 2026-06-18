import { Icon } from '@/icon'
import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { CSSProperties, ReactNode } from 'react'

export interface LoadingProps {
  className?: string
  style?: CSSProperties
  type?: 'default' | 'mask' | 'skeleton'
  children?: ReactNode
  size?: 'sm' | 'default' | 'lg'
}

export const Loading = (props: LoadingProps) => {
  const {
    className,
    style,
    type = 'default',
    size = 'default',
    children,
  } = props
  const skeletons = ['w-[38.2%]', 'w-full', 'w-full', 'w-[61.8%]']
  const isMask = type === 'mask'
  return type === 'skeleton' ? (
    <div
      {...mergeTag('loading', props)}
      className={cn('space-y-2 p-1', className)}
      style={style}
    >
      {skeletons.map((className, index) => (
        <div
          key={index}
          className={cn('bg-secondary h-4 animate-pulse rounded-md', className)}
        />
      ))}
    </div>
  ) : (
    <div
      {...mergeTag('loading', props)}
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
        isMask && 'bg-secondary/30 absolute top-0 left-0 z-50'
      )}
      style={style}
    >
      <div className='flex flex-col items-center'>
        <Icon
          className={cn(
            'text-muted-foreground text-5xl',
            size === 'sm' && 'text-2xl',
            size === 'default' && 'text-3xl',
            size === 'lg' && 'text-5xl'
          )}
          name='LoaderCircle'
        />
        {children}
      </div>
    </div>
  )
}
