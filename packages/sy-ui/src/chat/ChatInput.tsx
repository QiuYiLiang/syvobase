import { cn, useFocusClassName } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Icon } from '@/icon'
import { message } from '@/message'
import { ChatInputProps, ChatAttachment } from './types'
import { useState, useRef, KeyboardEvent, ChangeEvent, DragEvent } from 'react'

export const ChatInput = (props: ChatInputProps) => {
  const {
    className,
    style,
    value: controlledValue,
    placeholder = '输入消息...',
    disabled = false,
    loading = false,
    maxLength,
    enableAttachments = false,
    acceptedFileTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'],
    before,
    after,
    onSend,
    onStop,
    onChange,
    onParseFile,
  } = props

  const [internalValue, setInternalValue] = useState('')
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [focus, setFocus] = useState(false)
  const [isMultiLine, setIsMultiLine] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue ?? internalValue
  const focusClassName = useFocusClassName(focus)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) {
      return
    }
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleSend = () => {
    const trimmedValue = value.trim()
    if (!trimmedValue && attachments.length === 0) return
    if (loading) return

    // 先清空输入框，再调用 onSend（避免等待流式响应完成）
    const currentAttachments =
      attachments.length > 0 ? [...attachments] : undefined
    setInternalValue('')
    setAttachments([])
    onChange?.('')

    onSend?.(trimmedValue, currentAttachments)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const skippedFiles: string[] = []

    for (const file of Array.from(files)) {
      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        skippedFiles.push(file.name)
        continue
      }

      const isImage = file.type.startsWith('image/')
      const attachment: ChatAttachment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: isImage ? 'image' : 'file',
        name: file.name,
        url: URL.createObjectURL(file),
      }

      // 如果是文件类型且提供了解析函数，立即开始解析
      if (!isImage && onParseFile) {
        attachment.parseStatus = 'parsing'
        attachment.parseProgress = 0
        setAttachments((prev) => [...prev, attachment])

        // 异步解析文件
        try {
          const result = await onParseFile(file)
          if (result.success && result.data) {
            setAttachments((prev) =>
              prev.map((a) =>
                a.id === attachment.id
                  ? {
                      ...a,
                      parseStatus: 'success',
                      parseProgress: 100,
                      parsedContent: result.data,
                    }
                  : a
              )
            )
          } else {
            throw new Error(result.error || '解析失败')
          }
        } catch (error: any) {
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === attachment.id
                ? {
                    ...a,
                    parseStatus: 'error',
                    parseError: error.message,
                  }
                : a
            )
          )
          message.error(`文件 ${file.name} 解析失败: ${error.message}`)
        }
      } else {
        // 图片直接添加
        setAttachments((prev) => [...prev, attachment])
      }
    }

    if (skippedFiles.length > 0) {
      message.error(
        `以下文件大小超过 5MB，已被跳过: ${skippedFiles.join(', ')}`
      )
    }
  }

  const handleDragOver = (e: DragEvent) => {
    if (!enableAttachments) return
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    if (!enableAttachments) return
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id)
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url)
      }
      return prev.filter((a) => a.id !== id)
    })
  }

  // 自动调整文本框高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`

      // 判断是否多行（高度超过单行）
      // 单行高度约24px + 行间距，当超过30px时认为是多行
      setIsMultiLine(newHeight > 30)
    }
  }

  return (
    <div
      {...mergeTag('chat-input', props)}
      className={cn('chat-input', 'relative', className)}
      style={style}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 拖拽提示 */}
      {isDragging && (
        <div className='bg-primary/10 border-primary absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed'>
          <div className='text-primary flex flex-col items-center gap-2'>
            <Icon name='Upload' className='size-8' />
            <span className='text-sm font-medium'>放开以添加文件</span>
          </div>
        </div>
      )}

      {/* 附件预览 */}
      {attachments.length > 0 && (
        <div className='bg-secondary/50 mb-2 flex flex-wrap gap-2 rounded-lg p-2'>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='group bg-background relative flex min-w-32 flex-col gap-1 rounded-lg px-2 py-1.5'
            >
              <div className='flex items-center gap-2'>
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className='size-8 rounded object-cover'
                  />
                ) : (
                  <div className='flex items-center gap-1'>
                    {attachment.parseStatus === 'parsing' ? (
                      <Icon
                        name='Loader2'
                        className='text-primary size-4 animate-spin'
                      />
                    ) : attachment.parseStatus === 'error' ? (
                      <Icon
                        name='AlertCircle'
                        className='text-destructive size-4'
                      />
                    ) : attachment.parseStatus === 'success' ? (
                      <Icon
                        name='CheckCircle'
                        className='size-4 text-green-500'
                      />
                    ) : (
                      <Icon
                        name='File'
                        className='text-muted-foreground size-4'
                      />
                    )}
                  </div>
                )}
                <span className='max-w-24 truncate text-xs'>
                  {attachment.name}
                </span>
                <button
                  type='button'
                  className='bg-destructive text-destructive-foreground absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100'
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <Icon name='X' className='size-3' />
                </button>
              </div>
              {/* 显示解析进度或错误 */}
              {attachment.parseStatus === 'parsing' && (
                <div className='w-full'>
                  <div className='bg-secondary h-1 w-full overflow-hidden rounded-full'>
                    <div
                      className='bg-primary h-full transition-all duration-300'
                      style={{ width: `${attachment.parseProgress || 0}%` }}
                    />
                  </div>
                  <span className='text-muted-foreground text-[10px]'>
                    解析中...
                  </span>
                </div>
              )}
              {attachment.parseStatus === 'error' && (
                <span className='text-destructive text-[10px]'>
                  {attachment.parseError || '解析失败'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 输入区域 */}
      <div
        className={cn(
          'bg-background border-border rounded-3xl border shadow-sm',
          focusClassName,
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {/* 输入行 */}
        <div className='flex items-center gap-2 px-3 py-2'>
          {/* 前置内容 */}
          {before}

          {/* 单行时的附件按钮 */}
          {!isMultiLine && enableAttachments && (
            <button
              type='button'
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className='text-foreground hover:bg-secondary flex size-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50'
            >
              <Icon name='Paperclip' className='size-4' />
            </button>
          )}

          {/* 文本输入 */}
          <textarea
            ref={textareaRef}
            className={cn(
              'max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-sm',
              'placeholder:text-muted-foreground focus:outline-none',
              'scrollbar-thin scrollbar-thumb-secondary'
            )}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            rows={1}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onInput={adjustTextareaHeight}
          />

          {/* 后置内容 */}
          {after}

          {/* 单行时的发送按钮 */}
          {!isMultiLine &&
            (loading ? (
              <button
                type='button'
                onClick={onStop}
                className='bg-foreground text-background flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all hover:opacity-80'
              >
                <Icon name='Square' className='size-4' />
              </button>
            ) : (
              <button
                type='button'
                disabled={
                  disabled || (!value.trim() && attachments.length === 0)
                }
                onClick={handleSend}
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full transition-all',
                  !disabled && (value.trim() || attachments.length > 0)
                    ? 'bg-foreground text-background cursor-pointer hover:opacity-80'
                    : 'text-foreground cursor-not-allowed opacity-50'
                )}
              >
                <Icon name='Send' className='size-4' />
              </button>
            ))}
        </div>

        {/* 多行时的按钮行 */}
        {isMultiLine && (
          <div className='flex items-center justify-between px-3 pb-2'>
            {/* 附件按钮 */}
            {enableAttachments && (
              <button
                type='button'
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className='text-foreground hover:bg-secondary flex size-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50'
              >
                <Icon name='Paperclip' className='size-4' />
              </button>
            )}

            <div className='flex-1' />

            {/* 发送/停止按钮 */}
            {loading ? (
              <button
                type='button'
                onClick={onStop}
                className='bg-foreground text-background flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all hover:opacity-80'
              >
                <Icon name='Square' className='size-4' />
              </button>
            ) : (
              <button
                type='button'
                disabled={
                  disabled || (!value.trim() && attachments.length === 0)
                }
                onClick={handleSend}
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full transition-all',
                  !disabled && (value.trim() || attachments.length > 0)
                    ? 'bg-foreground text-background cursor-pointer hover:opacity-80'
                    : 'text-foreground cursor-not-allowed opacity-50'
                )}
              >
                <Icon name='Send' className='size-4' />
              </button>
            )}
          </div>
        )}

        {/* 隐藏的文件输入 */}
        {enableAttachments && (
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept={acceptedFileTypes.join(',')}
            className='hidden'
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        )}
      </div>

      {/* 字数统计 */}
      {maxLength && (
        <div className='text-muted-foreground absolute right-14 bottom-1 text-xs'>
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  )
}
