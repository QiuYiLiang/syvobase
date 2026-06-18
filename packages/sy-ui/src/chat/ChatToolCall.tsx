import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Icon } from '@/icon'
import { ChatToolCallProps, McpToolStatus } from './types'
import { Popover } from '@/popover'
import { Button } from '@/button'
import { useState } from 'react'

const getStatusIcon = (status: McpToolStatus) => {
  switch (status) {
    case 'pending':
      return 'Clock'
    case 'pending_confirmation':
      return 'CircleHelp'
    case 'running':
      return 'LoaderCircle'
    case 'success':
      return 'CircleCheck'
    case 'error':
      return 'CircleX'
    default:
      return 'Clock'
  }
}

const getStatusColor = (status: McpToolStatus) => {
  switch (status) {
    case 'pending':
      return 'text-muted-foreground'
    case 'pending_confirmation':
      return 'text-warning'
    case 'running':
      return 'text-primary animate-spin'
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-destructive'
    default:
      return 'text-muted-foreground'
  }
}

const formatDuration = (startTime?: number, endTime?: number) => {
  if (!startTime) return null
  const end = endTime || Date.now()
  const duration = end - startTime
  if (duration < 1000) {
    return `${duration}ms`
  }
  return `${(duration / 1000).toFixed(1)}s`
}

/** 等待确认状态的工具调用组件 - 参数默认折叠 */
const PendingConfirmationToolCall = ({
  toolCall,
  lineContent,
  onConfirm,
}: {
  toolCall: ChatToolCallProps['toolCall']
  lineContent: React.ReactNode
  onConfirm?: (id: string, confirmed: boolean) => void
}) => {
  const { id, args } = toolCall
  const [showArgs, setShowArgs] = useState(false)
  const hasArgs = args && Object.keys(args).length > 0

  return (
    <div className='space-y-2'>
      {lineContent}
      {hasArgs && (
        <div className='bg-muted/50 rounded-md p-2'>
          <div
            className='text-muted-foreground flex cursor-pointer items-center gap-1 text-xs font-medium'
            onClick={() => setShowArgs(!showArgs)}
          >
            <Icon
              name={showArgs ? 'ChevronDown' : 'ChevronRight'}
              className='size-3'
            />
            <span>参数</span>
          </div>
          {showArgs && (
            <pre className='mt-1 overflow-x-auto text-xs'>
              {JSON.stringify(args, null, 2)}
            </pre>
          )}
        </div>
      )}
      <div className='flex items-center gap-2'>
        <Button size='sm' onClick={() => onConfirm?.(id, true)}>
          确认执行
        </Button>
        <Button size='sm' type='outline' onClick={() => onConfirm?.(id, false)}>
          取消
        </Button>
      </div>
    </div>
  )
}

export const ChatToolCall = (props: ChatToolCallProps) => {
  const { className, style, toolCall, onConfirm } = props
  const { name, displayName, args, status, result, error, startTime, endTime } =
    toolCall

  const duration = formatDuration(startTime, endTime)
  const hasDetails = args || result || error
  const isPendingConfirmation = status === 'pending_confirmation'

  // 单行显示样式 - 只显示工具名称
  const lineContent = (
    <div
      {...mergeTag('chat-tool-call', props)}
      className={cn(
        'chat-tool-call',
        'flex items-center gap-1.5 py-0.5 text-sm',
        'text-muted-foreground',
        hasDetails &&
          !isPendingConfirmation &&
          'hover:text-foreground cursor-pointer',
        className
      )}
      style={style}
    >
      <Icon
        name={getStatusIcon(status)}
        className={cn('size-3.5', getStatusColor(status))}
      />
      <span className='font-medium'>{displayName || name}</span>
      {duration &&
        status !== 'running' &&
        status !== 'pending_confirmation' && (
          <span className='text-xs opacity-60'>({duration})</span>
        )}
      {isPendingConfirmation && (
        <span className='text-warning text-xs'>等待确认</span>
      )}
    </div>
  )

  // 如果是等待确认状态，显示确认/取消按钮
  if (isPendingConfirmation) {
    return (
      <PendingConfirmationToolCall
        toolCall={toolCall}
        lineContent={lineContent}
        onConfirm={onConfirm}
      />
    )
  }

  // 如果没有详情，直接返回
  if (!hasDetails) {
    return lineContent
  }

  // 有详情时使用 Popover 展示
  return (
    <Popover
      trigger='click'
      content={
        <div className='max-h-80 max-w-sm space-y-2 overflow-auto p-2'>
          {/* 参数 */}
          {args && Object.keys(args).length > 0 && (
            <div>
              <div className='text-muted-foreground mb-1 text-xs font-medium'>
                参数
              </div>
              <pre className='bg-muted overflow-x-auto rounded p-2 text-xs'>
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}

          {/* 结果 */}
          {result !== undefined && (
            <div>
              <div className='text-muted-foreground mb-1 text-xs font-medium'>
                结果
              </div>
              <pre className='bg-muted max-h-40 overflow-auto rounded p-2 text-xs'>
                {typeof result === 'string'
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* 错误 */}
          {error && (
            <div>
              <div className='text-destructive mb-1 text-xs font-medium'>
                错误
              </div>
              <pre className='bg-destructive/10 text-destructive overflow-x-auto rounded p-2 text-xs'>
                {error}
              </pre>
            </div>
          )}
        </div>
      }
    >
      {lineContent}
    </Popover>
  )
}
