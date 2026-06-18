import { cn } from '@/utils'
import { Icon } from '@/icon'
import { useState } from 'react'
import { ChatMarkdown } from './ChatMarkdown'

export interface ChatThinkingProps {
  /** 思考内容 */
  content: string
  /** 思考状态 */
  status?: 'thinking' | 'done'
  /** 自定义类名 */
  className?: string
}

export const ChatThinking = (props: ChatThinkingProps) => {
  const { content, status = 'done', className } = props
  const [isExpanded, setIsExpanded] = useState(false)

  const isThinking = status === 'thinking'

  return (
    <div
      className={cn(
        'chat-thinking',
        'border-border bg-muted/30 w-full rounded-lg border',
        className
      )}
    >
      {/* 头部 - 可折叠 */}
      <button
        type='button'
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-left',
          'hover:bg-muted/50 transition-colors',
          'rounded-lg'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isThinking ? (
          <Icon
            name='Loader2'
            className='text-muted-foreground size-4 animate-spin'
          />
        ) : (
          <Icon name='Brain' className='text-muted-foreground size-4' />
        )}
        <span className='text-muted-foreground flex-1 text-sm font-medium'>
          {isThinking ? '思考中...' : '思考过程'}
        </span>
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          className='text-muted-foreground size-4'
        />
      </button>

      {/* 内容区域 */}
      {isExpanded && (
        <div className='border-border border-t px-3 py-2'>
          <ChatMarkdown
            content={content}
            isStreaming={isThinking}
            className='text-muted-foreground text-sm'
          />
        </div>
      )}
    </div>
  )
}
