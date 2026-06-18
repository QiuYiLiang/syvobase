import { CSSProperties, HTMLAttributes, useState } from 'react'
import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: CSSProperties
  rounded?: boolean
  size?: 'default' | 'sm' | 'lg'
  src?: string
  name?: string
}

const getInitials = (name?: string) => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export const Avatar = ({
  className,
  style,
  size = 'default',
  rounded = true,
  src,
  name,
  ...props
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false)

  const showImage = src && !imgError

  return (
    <div
      {...mergeTag('avatar', props)}
      className={cn(
        'relative flex h-10 w-10 overflow-hidden',
        rounded && 'rounded-full',
        {
          default: 'size-8 text-xs',
          sm: 'size-6 text-sm',
          lg: 'size-10 text-base',
        }[size],
        className
      )}
      style={style}
      {...props}
    >
      {showImage ? (
        // Keep image simple and cover container
        <img
          className='aspect-square h-full w-full object-cover'
          src={src}
          alt={name}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={cn(
            'bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center rounded-lg',
            rounded && 'rounded-full'
          )}
        >
          {getInitials(name) || name}
        </div>
      )}
    </div>
  )
}
