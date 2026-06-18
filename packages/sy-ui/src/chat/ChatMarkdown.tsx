import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { ChatMarkdownProps } from './types'
import { defaultRemarkPlugins, Streamdown } from 'streamdown'

export const ChatMarkdown = (props: ChatMarkdownProps) => {
  const { className, style, content, isStreaming } = props

  return (
    <div
      {...mergeTag('chat-markdown', props)}
      className={cn(
        'chat-markdown text-sm',
        isStreaming && 'chat-markdown-streaming',
        className
      )}
      style={style}
    >
      <Streamdown
        remarkPlugins={[...Object.values(defaultRemarkPlugins)] as any}
      >
        {content}
      </Streamdown>
    </div>
  )
}
