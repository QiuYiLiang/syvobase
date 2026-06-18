import { PlateElement, PlateElementProps } from 'platejs/react'
import { cn } from '@/utils'
import { ReactNode } from 'react'

// 段落元素
export const ParagraphElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement
      as='p'
      className={cn('relative m-0 px-0 py-1 leading-7', className)}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 标题元素
export const HeadingElement = ({
  className,
  children,
  variant,
  ...props
}: PlateElementProps & {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) => {
  const { element } = props

  const type = (element?.type as string) || variant || 'h1'

  type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const headingClasses = {
    h1: 'mt-8 mb-2 text-4xl font-bold',
    h2: 'mt-6 mb-2 text-3xl font-semibold',
    h3: 'mt-4 mb-2 text-2xl font-semibold',
    h4: 'mt-4 mb-1 text-xl font-semibold',
    h5: 'mt-3 mb-1 text-lg font-medium',
    h6: 'mt-3 mb-1 text-base font-medium',
  }

  return (
    <PlateElement
      as={type as HeadingType}
      className={cn(
        headingClasses[type as keyof typeof headingClasses],
        className
      )}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 引用块元素
export const BlockquoteElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement
      as='blockquote'
      className={cn(
        'border-primary/50 text-muted-foreground my-2 border-l-2 pl-4 italic',
        className
      )}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 代码块元素
export const CodeBlockElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement
      as='pre'
      className={cn(
        'bg-muted my-2 overflow-x-auto rounded-lg p-4 font-mono text-sm',
        className
      )}
      {...props}
    >
      <code>{children}</code>
    </PlateElement>
  )
}

// 代码行元素
export const CodeLineElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement as='div' className={cn('', className)} {...props}>
      {children}
    </PlateElement>
  )
}

// 水平分割线
export const HorizontalRuleElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement className={cn('py-2', className)} {...props}>
      <hr className='bg-muted hover:bg-muted-foreground/30 h-0.5 cursor-pointer rounded-full border-0 transition-colors' />
      {children}
    </PlateElement>
  )
}

// 链接元素
export const LinkElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const url = (element as { url?: string })?.url || '#'

  return (
    <PlateElement
      as='a'
      className={cn(
        'text-primary decoration-primary/40 hover:decoration-primary font-medium underline underline-offset-2 transition-colors',
        className
      )}
      {...props}
      {...{ href: url, target: '_blank', rel: 'noopener noreferrer' }}
    >
      {children}
    </PlateElement>
  )
}

// 有序列表
export const OrderedListElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement
      as='ol'
      className={cn(
        'my-2 ml-6 list-decimal [&_ol]:list-[lower-alpha]',
        className
      )}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 无序列表
export const UnorderedListElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement
      as='ul'
      className={cn('my-2 ml-6 list-disc [&_ul]:list-[circle]', className)}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 列表项
export const ListItemElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement as='li' className={cn('py-0.5', className)} {...props}>
      {children}
    </PlateElement>
  )
}

// 待办列表项
export const TodoListElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element, editor } = props
  const { checked } = element as { checked?: boolean }

  return (
    <PlateElement
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <div contentEditable={false} className='flex shrink-0 items-center'>
        <input
          type='checkbox'
          checked={!!checked}
          onChange={(e) => {
            const path = (editor as any).api.findPath(element)
            if (path) {
              ;(editor as any).tf.setNodes(
                { checked: e.target.checked },
                { at: path }
              )
            }
          }}
          className='h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500'
        />
      </div>
      <span
        className={cn(
          'flex-1 py-1',
          checked && 'text-muted-foreground line-through'
        )}
      >
        {children}
      </span>
    </PlateElement>
  )
}

// 图片元素
export const ImageElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const { url, alt, caption } = element as {
    url?: string
    alt?: string
    caption?: ReactNode[]
  }

  return (
    <PlateElement className={cn('py-2', className)} {...props}>
      <figure className='group relative m-0' contentEditable={false}>
        <img
          src={url}
          alt={alt || ''}
          className='block h-auto max-w-full rounded-lg'
        />
        {caption && caption.length > 0 && (
          <figcaption className='text-muted-foreground mt-2 text-center text-sm'>
            {caption}
          </figcaption>
        )}
      </figure>
      {children}
    </PlateElement>
  )
}

// 表格元素
export const TableElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement className={cn('my-4 overflow-x-auto', className)} {...props}>
      <table className='border-border w-full border-collapse border'>
        <tbody>{children}</tbody>
      </table>
    </PlateElement>
  )
}

// 表格行
export const TableRowElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  return (
    <PlateElement
      as='tr'
      className={cn('border-border border-b', className)}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 表格单元格
export const TableCellElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const { header, background } = element as {
    header?: boolean
    background?: string
  }

  const Tag = header ? 'th' : 'td'

  return (
    <PlateElement
      as={Tag}
      className={cn(
        'border-border relative min-w-[48px] border p-2 text-left align-top',
        header && 'bg-muted font-semibold',
        className
      )}
      style={{ backgroundColor: background }}
      {...props}
    >
      {children}
    </PlateElement>
  )
}

// 折叠块
export const ToggleElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const isOpen = (element as { open?: boolean })?.open ?? true

  return (
    <PlateElement className={cn('my-2', className)} {...props}>
      <details open={isOpen} className='group'>
        <summary className='cursor-pointer list-none py-1 font-medium'>
          <span className='flex items-center gap-2'>
            <span className='transition-transform group-open:rotate-90'>▶</span>
            {children}
          </span>
        </summary>
      </details>
    </PlateElement>
  )
}

// 视频元素
export const VideoElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const { url, name } = element as {
    url?: string
    name?: string
  }

  return (
    <PlateElement className={cn('py-2', className)} {...props}>
      <figure className='group relative m-0' contentEditable={false}>
        <video
          src={url}
          controls
          className='block h-auto max-w-full rounded-lg'
          title={name}
        >
          您的浏览器不支持视频播放
        </video>
        {name && (
          <figcaption className='text-muted-foreground mt-2 text-center text-sm'>
            {name}
          </figcaption>
        )}
      </figure>
      {children}
    </PlateElement>
  )
}

// 音频元素
export const AudioElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const { url, name } = element as {
    url?: string
    name?: string
  }

  return (
    <PlateElement className={cn('py-2', className)} {...props}>
      <figure className='group relative m-0' contentEditable={false}>
        <div className='bg-muted flex items-center gap-3 rounded-lg p-3'>
          <div className='bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
            <svg
              className='text-primary h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
              />
            </svg>
          </div>
          <div className='min-w-0 flex-1'>
            {name && (
              <p className='text-foreground truncate text-sm font-medium'>
                {name}
              </p>
            )}
            <audio src={url} controls className='mt-1 w-full'>
              您的浏览器不支持音频播放
            </audio>
          </div>
        </div>
      </figure>
      {children}
    </PlateElement>
  )
}

// 文件元素
export const FileElement = ({
  className,
  children,
  ...props
}: PlateElementProps) => {
  const { element } = props
  const {
    url,
    name,
    size,
    type: fileType,
  } = element as {
    url?: string
    name?: string
    size?: number
    type?: string
  }

  // 格式化文件大小
  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // 根据文件类型获取图标颜色
  const getFileColor = (type?: string) => {
    if (!type) return 'text-muted-foreground'
    if (type.includes('pdf')) return 'text-red-500'
    if (type.includes('word') || type.includes('document'))
      return 'text-blue-500'
    if (type.includes('excel') || type.includes('sheet'))
      return 'text-green-500'
    if (type.includes('zip') || type.includes('rar') || type.includes('7z'))
      return 'text-yellow-500'
    return 'text-muted-foreground'
  }

  const handleDownload = () => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = name || 'download'
    link.click()
  }

  return (
    <PlateElement className={cn('py-2', className)} {...props}>
      <div
        className='bg-muted hover:bg-muted/80 group relative m-0 cursor-pointer rounded-lg p-3 transition-colors'
        contentEditable={false}
        onClick={handleDownload}
      >
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/50',
              getFileColor(fileType)
            )}
          >
            <svg
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
              />
            </svg>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='text-foreground truncate text-sm font-medium'>
              {name || '未知文件'}
            </p>
            <p className='text-muted-foreground text-xs'>
              {formatSize(size)}
              {fileType &&
                ` · ${fileType.split('/')[1]?.toUpperCase() || fileType}`}
            </p>
          </div>
          <div className='text-muted-foreground group-hover:text-foreground shrink-0 transition-colors'>
            <svg
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
            </svg>
          </div>
        </div>
      </div>
      {children}
    </PlateElement>
  )
}
