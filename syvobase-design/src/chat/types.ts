import { CSSProperties, ReactNode } from 'react'

/** MCP 工具调用状态 */
export type McpToolStatus =
  | 'pending'
  | 'pending_confirmation'
  | 'running'
  | 'success'
  | 'error'

/** MCP 工具调用结果 */
export interface McpToolCall {
  /** 工具调用唯一ID */
  id: string
  /** 工具名称 */
  name: string
  /** 展示名称（用于 UI 显示中文名等） */
  displayName?: string
  /** 工具参数 */
  args?: Record<string, any>
  /** 调用状态 */
  status: McpToolStatus
  /** 是否需要用户确认 */
  requireConfirmation?: boolean
  /** 调用结果 */
  result?: any
  /** 错误信息 */
  error?: string
  /** 开始时间 */
  startTime?: number
  /** 结束时间 */
  endTime?: number
}

/** 计划步骤状态 */
export type PlanStepStatus = 'pending' | 'running' | 'completed' | 'failed'

/** 计划步骤 */
export interface PlanStep {
  /** 步骤ID */
  id: string
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description?: string
  /** 步骤状态 */
  status: PlanStepStatus
  /** 子步骤 */
  children?: PlanStep[]
}

/** 预设任务 */
export interface ChatTask {
  /** 任务名称（显示文本） */
  name: string
  /** 任务提示词（点击后发送的内容） */
  prompt: string
  /** 任务图标，可以是 ReactNode 或 Icon 名称字符串 */
  icon?: ReactNode | string
}

/** 消息中的附件 */
export interface ChatAttachment {
  /** 附件ID */
  id: string
  /** 附件类型 */
  type: 'image' | 'file' | 'code'
  /** 附件名称 */
  name?: string
  /** 附件URL */
  url?: string
  /** 附件内容 */
  content?: string
  /** 代码语言 */
  language?: string
  /** 解析状态 */
  parseStatus?: 'parsing' | 'success' | 'error'
  /** 解析进度（0-100） */
  parseProgress?: number
  /** 解析后的文本内容 */
  parsedContent?: string
  /** 解析错误信息 */
  parseError?: string
}

/** 自定义交互按钮 */
export interface ChatActionButton {
  /** 按钮ID */
  id: string
  /** 按钮文本 */
  label: string
  /** 按钮图标 */
  icon?: string
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'destructive' | 'outline' | 'ghost'
  /** 是否禁用 */
  disabled?: boolean
  /** 点击回调 */
  onClick?: () => void | Promise<void>
}

/** 消息角色 */
export type ChatRole = 'user' | 'assistant' | 'system'

/** 消息状态 */
export type ChatMessageStatus = 'pending' | 'streaming' | 'completed' | 'error'

/** 单条消息数据 */
export interface ChatMessageData {
  /** 消息ID */
  id: string
  /** 消息角色 */
  role: ChatRole
  /** 消息内容 (支持 Markdown) */
  content: string
  /** 消息状态 */
  status?: ChatMessageStatus
  /** 消息时间 */
  timestamp?: number
  /** MCP 工具调用列表 */
  toolCalls?: McpToolCall[]
  /** 执行计划 */
  plan?: PlanStep[]
  /** 思考过程（用于显示 AI 的思考/推理过程） */
  thinking?: string
  /** 思考状态 */
  thinkingStatus?: 'thinking' | 'done'
  /** 附件列表 */
  attachments?: ChatAttachment[]
  /** 自定义交互按钮 */
  actions?: ChatActionButton[]
  /** 自定义渲染内容 */
  customContent?: ReactNode
  /** 错误信息 */
  error?: string
  /** 头像 */
  avatar?: string
  /** 用户名 */
  username?: string
}

/** 自定义消息渲染器 */
export interface MessageRender {
  /** 类型标识，用于匹配消息中的标签，如 'card'、'form' 等 */
  type: string
  /** 渲染函数，接收匹配到的内部字符串，返回 ReactNode */
  render: (data: string) => ReactNode
}

/** Chat 组件 Props */
export interface ChatProps {
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 消息列表 */
  messages?: ChatMessageData[]
  /** 是否正在加载/流式输出 */
  loading?: boolean
  /** 输入框占位符 */
  placeholder?: string
  /** 输入框禁用状态 */
  disabled?: boolean
  /** 是否自动滚动到底部 */
  autoScroll?: boolean
  /** 发送消息回调 */
  onSend?: (
    content: string,
    attachments?: ChatAttachment[]
  ) => void | Promise<void>
  /** 停止生成回调 */
  onStop?: () => void
  /** 重新生成回调 */
  onRegenerate?: (messageId: string) => void
  /** 失败重试回调 */
  onRetry?: (messageId: string) => void
  /** 编辑消息并重发回调（用于用户消息） */
  onEdit?: (messageId: string, newContent: string) => void
  /** 消息渲染自定义 */
  renderMessage?: (message: ChatMessageData) => ReactNode
  /** MCP 工具调用渲染自定义 */
  renderToolCall?: (toolCall: McpToolCall) => ReactNode
  /** 计划步骤渲染自定义 */
  renderPlanStep?: (step: PlanStep) => ReactNode
  /** 自定义交互组件 */
  customActions?: ReactNode
  /** 输入框前置内容 */
  inputBefore?: ReactNode
  /** 输入框后置内容 */
  inputAfter?: ReactNode
  /** 是否显示时间戳 */
  showTimestamp?: boolean
  /** 最大输入长度 */
  maxLength?: number
  /** 是否支持附件 */
  enableAttachments?: boolean
  /** 允许的附件类型 */
  acceptedFileTypes?: string[]
  /** 文件解析回调 - 返回Promise<{success, data?, error?}> */
  onParseFile?: (file: File) => Promise<{
    success: boolean
    data?: string
    error?: string
  }>
  /** 空状态内容 */
  emptyContent?: ReactNode
  /** 头部内容 */
  header?: ReactNode
  /** 底部内容 */
  footer?: ReactNode
  /** 预设任务列表，显示在输入框上方，点击后发送对应 prompt */
  tasks?: ChatTask[]
  /** 自定义消息渲染器列表，根据消息内容中的标签匹配渲染 */
  messageRenders?: MessageRender[]
}

/** ChatInput 组件 Props */
export interface ChatInputProps {
  className?: string
  style?: CSSProperties
  value?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  maxLength?: number
  enableAttachments?: boolean
  acceptedFileTypes?: string[]
  before?: ReactNode
  after?: ReactNode
  onSend?: (
    content: string,
    attachments?: ChatAttachment[]
  ) => void | Promise<void>
  onStop?: () => void
  onChange?: (value: string) => void
  /** 文件解析回调 - 返回Promise<{success, data?, error?}> */
  onParseFile?: (file: File) => Promise<{
    success: boolean
    data?: string
    error?: string
  }>
}

/** ChatMessage 组件 Props */
export interface ChatMessageProps {
  className?: string
  style?: CSSProperties
  message: ChatMessageData
  showTimestamp?: boolean
  renderToolCall?: (toolCall: McpToolCall) => ReactNode
  renderPlanStep?: (step: PlanStep) => ReactNode
  /** 自定义消息渲染器列表 */
  messageRenders?: MessageRender[]
  onRegenerate?: (messageId: string) => void
  /** 失败重试回调 */
  onRetry?: (messageId: string) => void
  /** 编辑消息并重发回调（用于用户消息） */
  onEdit?: (messageId: string, newContent: string) => void
}

/** ChatPlan 组件 Props */
export interface ChatPlanProps {
  className?: string
  style?: CSSProperties
  steps: PlanStep[]
  renderStep?: (step: PlanStep) => ReactNode
}

/** ChatToolCall 组件 Props */
export interface ChatToolCallProps {
  className?: string
  style?: CSSProperties
  toolCall: McpToolCall
  /** 确认执行回调 */
  onConfirm?: (toolCallId: string, confirmed: boolean) => void
}

/** ChatMarkdown 组件 Props */
export interface ChatMarkdownProps {
  className?: string
  style?: CSSProperties
  content: string
  /** 是否正在流式输出 */
  isStreaming?: boolean
}

/** ChatActions 组件 Props */
export interface ChatActionsProps {
  className?: string
  style?: CSSProperties
  actions: ChatActionButton[]
}
