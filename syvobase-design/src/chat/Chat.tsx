import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Icon } from '@/icon'
import { Button } from '@/button'
import { ChatProps } from './types'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ChatPlan } from './ChatPlan'
import { parsePlanStepsFromContent } from './utils'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

export const Chat = (props: ChatProps) => {
  const {
    className,
    style,
    messages = [],
    loading = false,
    placeholder,
    disabled = false,
    autoScroll = true,
    onSend,
    onStop,
    onRegenerate,
    onRetry,
    onEdit,
    renderMessage,
    renderToolCall,
    renderPlanStep,
    customActions,
    inputBefore,
    inputAfter,
    showTimestamp = false,
    maxLength,
    enableAttachments = false,
    acceptedFileTypes,
    onParseFile,
    emptyContent,
    header,
    footer,
    tasks,
    messageRenders,
  } = props

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  // 用户是否手动滚动到上方（取消底部吸附）
  const [isUserScrolled, setIsUserScrolled] = useState(false)
  // 记录上一次消息数量，用于检测新消息发送
  const prevMessagesLengthRef = useRef(messages.length)

  // 获取最后一条助手消息，用于检测流式输出状态
  const lastAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        return messages[i]
      }
    }
    return null
  }, [messages])

  // 检测最后一条消息是否正在流式输出
  const isLastMessageStreaming = lastAssistantMessage?.status === 'streaming'
  const lastAssistantContent = lastAssistantMessage?.content

  // 从流式输出的消息中解析 plan，固定显示在输入框上方
  const streamingPlan = useMemo(() => {
    if (!isLastMessageStreaming || !lastAssistantContent) {
      return []
    }
    return parsePlanStepsFromContent(lastAssistantContent, true)
  }, [isLastMessageStreaming, lastAssistantContent])

  // 检测用户滚动行为
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    // 距离底部的阈值（像素）
    const threshold = 100
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold

    setIsUserScrolled(!isNearBottom)
  }, [])

  // 自动滚动到底部
  useEffect(() => {
    if (!autoScroll || !messagesEndRef.current) return

    // 检测是否是新发送的消息（消息数量增加）
    const isNewMessage = messages.length > prevMessagesLengthRef.current
    prevMessagesLengthRef.current = messages.length

    // 如果是新发送的消息，强制滚动到底部并重置用户滚动状态
    if (isNewMessage) {
      setIsUserScrolled(false)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      return
    }

    // 如果用户没有手动向上滚动，则自动滚动
    if (!isUserScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll, isUserScrolled])

  const isEmpty = messages.length === 0

  return (
    <div
      {...mergeTag('chat', props)}
      className={cn(
        'chat',
        'bg-background flex h-full w-full flex-col',
        className
      )}
      style={style}
    >
      {/* 头部 */}
      {header && (
        <div className='border-border shrink-0 border-b'>{header}</div>
      )}

      {/* 消息列表 */}
      <div
        ref={messagesContainerRef}
        className='scrollbar-thin scrollbar-thumb-secondary flex-1 overflow-y-auto px-4'
        onScroll={handleScroll}
      >
        {isEmpty ? (
          // 空状态
          <div className='text-muted-foreground flex h-full flex-col items-center justify-center'>
            {emptyContent || (
              <div className='text-center'>
                <Icon name='MessageSquare' className='mx-auto mb-2 h-12 w-12' />
                <p>开始一段对话吧</p>
              </div>
            )}
          </div>
        ) : (
          // 消息列表
          <div className='py-4'>
            {messages.map((message) => {
              if (renderMessage) {
                return renderMessage(message)
              }
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  showTimestamp={showTimestamp}
                  renderToolCall={renderToolCall}
                  renderPlanStep={renderPlanStep}
                  messageRenders={messageRenders}
                  onRegenerate={onRegenerate}
                  onRetry={onRetry}
                  onEdit={onEdit}
                />
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 自定义操作区 */}
      {customActions && (
        <div className='border-border shrink-0 border-t px-4 py-2'>
          {customActions}
        </div>
      )}

      {/* 流式输出时固定在输入框上方的 Plan */}
      {streamingPlan.length > 0 && (
        <div className='shrink-0 px-4 pt-3'>
          <ChatPlan
            steps={streamingPlan}
            renderStep={renderPlanStep}
            className='shadow-sm'
          />
        </div>
      )}

      {/* 预设任务列表 */}
      {tasks && tasks.length > 0 && !loading && (
        <div className='shrink-0 px-4 pt-3'>
          <div className='flex flex-wrap gap-2'>
            {tasks.map((task, index) => (
              <Button
                key={index}
                type='secondary'
                rounded
                icon={task.icon}
                onClick={() => onSend?.(task.prompt)}
                disabled={disabled}
              >
                {task.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className='shrink-0 p-4 pt-3'>
        <ChatInput
          placeholder={placeholder}
          disabled={disabled}
          loading={loading}
          maxLength={maxLength}
          enableAttachments={enableAttachments}
          acceptedFileTypes={acceptedFileTypes}
          onParseFile={onParseFile}
          before={inputBefore}
          after={inputAfter}
          onSend={onSend}
          onStop={onStop}
        />
      </div>

      {/* 底部 */}
      {footer && (
        <div className='border-border shrink-0 border-t'>{footer}</div>
      )}
    </div>
  )
}
