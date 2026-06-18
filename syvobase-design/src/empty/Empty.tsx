import { cn } from '@/utils'
import { Icon } from '@/icon'
import { ReactNode } from 'react'
import { mergeTag } from '@/utils/tag'

export interface EmptyProps {
  className?: string
  children?: ReactNode
}

export const Empty = (props: EmptyProps) => {
  const { className, children } = props
  return (
    <div
      {...mergeTag('empty', props)}
      className={cn('flex w-full items-center justify-center', className)}
    >
      <div className='flex flex-col items-center p-1'>
        <Icon className='text-4xl' name='Inbox' />
        {children}
      </div>
    </div>
  )
}
