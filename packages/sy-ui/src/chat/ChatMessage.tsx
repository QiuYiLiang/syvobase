import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Icon } from '@/icon'
import { Button } from '@/button'
import { ChatMessageProps } from './types'
import { ChatMarkdown } from './ChatMarkdown'
import { ChatPlan } from './ChatPlan'
import { ChatToolCall } from './ChatToolCall'
import { ChatActions } from './ChatActions'
import { ChatThinking } from './ChatThinking'
import {
  formatTime,
  parseThinkingFromContent,
  filterPlanStepBlocks,
  parsePlanStepsFromContent,
} from './utils'
import { useState, useRef, useEffect } from 'react'
import { ChatErrorBoundary } from './ChatErrorBoundary'

export const ChatMessage = (props: ChatMessageProps) => {
  const {
    className,
    style,
    message,
    showTimestamp = false,
    renderToolCall,
    renderPlanStep,
    messageRenders,
    onRegenerate,
    onRetry,
    onEdit,
  } = props

  const {
    id,
    role,
    content,
    status,
    timestamp,
    toolCalls,
    plan,
    thinking: propThinking,
    thinkingStatus: propThinkingStatus,
    attachments,
    actions,
    customContent,
    error,
  } = message

  const isUser = role === 'user'
  const isAssistant = role === 'assistant'
  const isSystem = role === 'system'
  const isStreaming = status === 'streaming'
  const isError = status === 'error'

  // 编辑模式状态
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 进入编辑模式时聚焦
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      )
    }
  }, [isEditing])

  // 处理编辑提交
  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(id, editContent.trim())
      setIsEditing(false)
    }
  }

  // 处理取消编辑
  const handleEditCancel = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  // 从内容中解析 thinking（优先使用 props 传入的 thinking）
  const parsedThinking = parseThinkingFromContent(content, isStreaming)
  const thinking = propThinking || parsedThinking.thinking
  const thinkingStatus = propThinking
    ? propThinkingStatus || 'done'
    : parsedThinking.thinkingStatus
  const rawDisplayContent = propThinking
    ? content
    : parsedThinking.displayContent

  // 从内容中解析 plan/step（优先使用 props 传入的 plan）
  const parsedPlanSteps = parsePlanStepsFromContent(content, isStreaming)
  const effectivePlan = plan && plan.length > 0 ? plan : parsedPlanSteps

  // 过滤掉 plan/step 代码块（这些只用于内部处理，不显示给用户）
  const displayContent = filterPlanStepBlocks(rawDisplayContent)

  // 解析自定义渲染块和工具标记
  // 支持格式: ```type\n{json}\n``` 或 <type>{json}</type> 或 [tool:id:name]
  // 支持流式渲染：未闭合的标签也会被渲染
  const parseContentBlocks = (
    text: string
  ): Array<{
    type: 'text' | 'custom' | 'tool'
    content: string
    data?: any
    renderType?: string
    toolId?: string
    displayName?: string
    isStreaming?: boolean
  }> => {
    if (!text) return []

    const blocks: Array<{
      type: 'text' | 'custom' | 'tool'
      content: string
      data?: any
      renderType?: string
      toolId?: string
      displayName?: string
      isStreaming?: boolean
    }> = []

    // 合并所有匹配并按位置排序
    const matches: Array<{
      index: number
      length: number
      matchType: 'custom' | 'tool'
      type?: string
      content?: string
      toolId?: string
      displayName?: string
      isStreaming?: boolean
    }> = []

    // 转义正则表达式中的特殊字符
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // 匹配自定义渲染块
    if (messageRenders && messageRenders.length > 0) {
      const typePattern = messageRenders
        .map((r) => escapeRegex(r.type))
        .join('|')

      // 匹配 ```type\n{json}\n``` 格式
      const codeBlockRegex = new RegExp(
        '```(' + typePattern + ')\\n([\\s\\S]*?)\\n```',
        'gi'
      )

      let match
      while ((match = codeBlockRegex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          matchType: 'custom',
          type: match[1].toLowerCase(),
          content: match[2],
        })
      }

      // 匹配 <type>{json}</type> 格式 - 逐个类型单独匹配
      for (const render of messageRenders) {
        const escapedType = escapeRegex(render.type)
        const singleTagRegex = new RegExp(
          '<(' + escapedType + ')>([\\s\\S]*?)</' + escapedType + '>',
          'gi'
        )
        let tagMatch
        while ((tagMatch = singleTagRegex.exec(text)) !== null) {
          matches.push({
            index: tagMatch.index,
            length: tagMatch[0].length,
            matchType: 'custom',
            type: tagMatch[1].toLowerCase(),
            content: tagMatch[2],
          })
        }
      }
    }

    // 匹配工具标记 [tool:id:name]
    const toolMarkerRegex = /\[tool:([^:\]]+):([^\]]+)\]/g
    let toolMatch
    while ((toolMatch = toolMarkerRegex.exec(text)) !== null) {
      matches.push({
        index: toolMatch.index,
        length: toolMatch[0].length,
        matchType: 'tool',
        toolId: toolMatch[1],
        displayName: toolMatch[2],
      })
    }

    // 按位置排序
    matches.sort((a, b) => a.index - b.index)

    // 计算最后一个匹配的结束位置
    let lastMatchEnd = 0
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1]
      lastMatchEnd = lastMatch.index + lastMatch.length
    }

    // 检查剩余文本中是否有未闭合的开始标签（流式渲染场景）
    if (messageRenders && messageRenders.length > 0) {
      const remainingText = text.slice(lastMatchEnd)

      // 检查 <type>... 格式的未闭合标签
      for (const render of messageRenders) {
        const escapedType = escapeRegex(render.type)
        // 匹配开始标签后面没有对应闭合标签的情况
        const unclosedTagRegex = new RegExp(
          '<(' + escapedType + ')>([\\s\\S]*)$',
          'i'
        )
        const unclosedMatch = unclosedTagRegex.exec(remainingText)
        if (unclosedMatch) {
          // 确保这个开始标签后面没有闭合标签
          const hasClosingTag = new RegExp('</' + escapedType + '>', 'i').test(
            unclosedMatch[2]
          )
          if (!hasClosingTag) {
            matches.push({
              index: lastMatchEnd + unclosedMatch.index,
              length: unclosedMatch[0].length,
              matchType: 'custom',
              type: unclosedMatch[1].toLowerCase(),
              content: unclosedMatch[2],
              isStreaming: true,
            })
            break // 只处理最后一个未闭合标签
          }
        }
      }

      // 检查 ```type\n... 格式的未闭合代码块
      const typePattern = messageRenders
        .map((r) => escapeRegex(r.type))
        .join('|')
      const unclosedCodeBlockRegex = new RegExp(
        '```(' + typePattern + ')\\n([\\s\\S]*)$',
        'i'
      )
      const unclosedCodeMatch = unclosedCodeBlockRegex.exec(remainingText)
      if (unclosedCodeMatch) {
        // 确保后面没有闭合的 ```
        const afterTag = unclosedCodeMatch[2]
        if (!afterTag.includes('\n```')) {
          matches.push({
            index: lastMatchEnd + unclosedCodeMatch.index,
            length: unclosedCodeMatch[0].length,
            matchType: 'custom',
            type: unclosedCodeMatch[1].toLowerCase(),
            content: unclosedCodeMatch[2],
            isStreaming: true,
          })
        }
      }

      // 重新按位置排序
      matches.sort((a, b) => a.index - b.index)
    }

    let lastEnd = 0
    for (const m of matches) {
      // 添加匹配之前的普通文本
      if (m.index > lastEnd) {
        const textContent = text.slice(lastEnd, m.index).trim()
        if (textContent) {
          blocks.push({ type: 'text', content: textContent })
        }
      }

      if (m.matchType === 'custom') {
        blocks.push({
          type: 'custom',
          content: m.content || '',
          data: m.content?.trim(),
          renderType: m.type,
          isStreaming: m.isStreaming,
        })
      } else if (m.matchType === 'tool') {
        blocks.push({
          type: 'tool',
          content: '',
          toolId: m.toolId,
          displayName: m.displayName,
        })
      }

      lastEnd = m.index + m.length
    }

    // 添加剩余的普通文本
    if (lastEnd < text.length) {
      const textContent = text.slice(lastEnd).trim()
      if (textContent) {
        blocks.push({ type: 'text', content: textContent })
      }
    }

    // 如果没有匹配到任何块，返回原始文本
    if (blocks.length === 0 && text.trim()) {
      return [{ type: 'text', content: text }]
    }

    return blocks
  }

  const contentBlocks = parseContentBlocks(displayContent)

  // 系统消息样式
  if (isSystem) {
    return (
      <div
        {...mergeTag('chat-message', props)}
        className={cn(
          'chat-message chat-message-system',
          'flex justify-center py-2',
          className
        )}
        style={style}
      >
        <div className='text-muted-foreground bg-secondary/50 rounded-full px-3 py-1 text-xs'>
          {content}
        </div>
      </div>
    )
  }

  return (
    <div
      {...mergeTag('chat-message', props)}
      className={cn(
        'chat-message',
        'flex gap-3 py-4',
        isUser && 'flex-row-reverse',
        className
      )}
      style={style}
    >
      {/* 消息内容 */}
      <div
        className={cn(
          'flex min-w-0 flex-col gap-1',
          isUser ? 'max-w-[80%] items-end' : 'w-full'
        )}
      >
        {/* 时间 */}
        {showTimestamp && timestamp && (
          <div className='text-muted-foreground text-xs'>
            {formatTime(timestamp)}
          </div>
        )}

        {/* 思考过程 */}
        {thinking && (
          <ChatThinking content={thinking} status={thinkingStatus} />
        )}

        {/* 消息气泡 */}
        <div
          className={cn(
            isUser &&
              !isEditing &&
              'bg-secondary text-secondary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5',
            isError && 'border-destructive/50 border'
          )}
        >
          {/* 用户消息编辑模式 */}
          {isUser && isEditing ? (
            <div className='flex flex-col gap-2'>
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className='bg-secondary text-secondary-foreground min-h-[80px] w-full resize-none rounded-lg border-none p-3 text-sm focus:outline-none'
                placeholder='输入消息...'
              />
              <div className='flex justify-end gap-2'>
                <Button type='ghost' size='sm' onClick={handleEditCancel}>
                  取消
                </Button>
                <Button
                  type='default'
                  size='sm'
                  onClick={handleEditSubmit}
                  disabled={!editContent.trim()}
                >
                  发送
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* 附件预览 */}
              {attachments && attachments.length > 0 && (
                <div className='mb-2 flex flex-wrap gap-2'>
                  {attachments.map((attachment) => {
                    if (attachment.type === 'image') {
                      return (
                        <img
                          key={attachment.id}
                          src={attachment.url}
                          alt={attachment.name}
                          className='max-h-48 max-w-xs rounded-lg object-cover'
                        />
                      )
                    }
                    if (attachment.type === 'file') {
                      return (
                        <div
                          key={attachment.id}
                          className='bg-background/50 flex items-center gap-2 rounded-lg px-3 py-2'
                        >
                          <Icon name='File' className='size-4' />
                          <span className='max-w-32 truncate text-sm'>
                            {attachment.name}
                          </span>
                        </div>
                      )
                    }
                    if (attachment.type === 'code') {
                      return (
                        <pre
                          key={attachment.id}
                          className='bg-background/50 w-full overflow-x-auto rounded-lg p-3 text-xs'
                        >
                          <code>{attachment.content}</code>
                        </pre>
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {/* 流式输出等待中的骨架屏动画 */}
              {isStreaming && contentBlocks.length === 0 && (
                <div className='flex flex-col gap-2 py-1'>
                  <div className='bg-muted h-4 w-3/4 animate-pulse rounded' />
                  <div className='bg-muted h-4 w-1/2 animate-pulse rounded' />
                </div>
              )}

              {/* 文本内容、自定义渲染块和工具调用 */}
              {contentBlocks.map((block, index) => {
                // 工具调用
                if (block.type === 'tool' && block.toolId) {
                  // 从 toolCalls 中找到对应的工具调用状态
                  const toolCall = toolCalls?.find(
                    (t) => t.id === block.toolId
                  ) || {
                    id: block.toolId,
                    name: block.displayName || '',
                    displayName: block.displayName,
                    status: 'running' as const,
                    args: {},
                  }
                  return (
                    <div key={index} className='my-1'>
                      {renderToolCall ? (
                        renderToolCall(toolCall)
                      ) : (
                        <ChatToolCall toolCall={toolCall} />
                      )}
                    </div>
                  )
                }
                // 自定义渲染块
                if (block.type === 'custom' && block.renderType) {
                  const renderer = messageRenders?.find(
                    (r) => r.type.toLowerCase() === block.renderType
                  )
                  if (renderer) {
                    return (
                      <ChatErrorBoundary>
                        <div
                          key={index}
                          className='my-2 w-full overflow-x-auto'
                        >
                          {renderer.render(block.data)}
                        </div>
                      </ChatErrorBoundary>
                    )
                  }
                }
                // 普通文本使用 Markdown 渲染
                if (block.type === 'text' && block.content) {
                  return (
                    <ChatMarkdown
                      key={index}
                      content={block.content}
                      isStreaming={isStreaming}
                    />
                  )
                }
                return null
              })}

              {/* 错误信息 */}
              {isError && error && (
                <div className='text-destructive mt-2 flex items-center gap-2 text-sm'>
                  <Icon name='AlertCircle' className='size-4' />
                  <span>{error}</span>
                </div>
              )}

              {/* 自定义内容 */}
              {customContent}
            </>
          )}
        </div>

        {/* 执行计划 - 只在消息完成后显示，流式输出时在 Chat 组件底部固定显示 */}
        {!isStreaming && effectivePlan && effectivePlan.length > 0 && (
          <ChatPlan
            steps={effectivePlan}
            renderStep={renderPlanStep}
            className='w-full'
          />
        )}

        {/* 自定义交互按钮 */}
        {actions && actions.length > 0 && <ChatActions actions={actions} />}

        {/* 用户消息操作按钮 - 编辑 */}
        {isUser && !isEditing && onEdit && (
          <div className='mt-1 flex items-center gap-1'>
            <Button
              type='ghost'
              size='sm'
              icon='Pencil'
              onClick={() => {
                setEditContent(content)
                setIsEditing(true)
              }}
            />
          </div>
        )}

        {/* 助手消息操作按钮 - 复制、重新生成 */}
        {isAssistant && status === 'completed' && !isError && (
          <div className='mt-1 flex items-center gap-1'>
            <Button
              type='ghost'
              size='sm'
              icon='Copy'
              onClick={() => {
                navigator.clipboard.writeText(content)
              }}
            />
            {onRegenerate && (
              <Button
                type='ghost'
                size='sm'
                icon='RefreshCw'
                onClick={() => onRegenerate(id)}
              />
            )}
          </div>
        )}

        {/* 错误状态操作按钮 - 重试 */}
        {isAssistant && isError && onRetry && (
          <div className='mt-2 flex items-center gap-2'>
            <Button
              type='secondary'
              size='sm'
              icon='RefreshCw'
              onClick={() => onRetry(id)}
            >
              重试
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
