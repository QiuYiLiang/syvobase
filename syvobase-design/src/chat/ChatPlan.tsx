import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Icon } from '@/icon'
import { ChatPlanProps, PlanStep, PlanStepStatus } from './types'
import { Fragment, useState } from 'react'

/** 获取状态对应的图标 */
const getStatusIcon = (status: PlanStepStatus) => {
  switch (status) {
    case 'pending':
      return 'Circle'
    case 'running':
      return 'LoaderCircle'
    case 'completed':
      return 'CircleCheck'
    case 'failed':
      return 'CircleX'
    default:
      return 'Circle'
  }
}

/** 获取状态对应的颜色 */
const getStatusColor = (status: PlanStepStatus) => {
  switch (status) {
    case 'pending':
      return 'text-muted-foreground'
    case 'running':
      return 'text-primary'
    case 'completed':
      return 'text-green-500'
    case 'failed':
      return 'text-destructive'
    default:
      return 'text-muted-foreground'
  }
}

/** 计算完成进度 */
const calculateProgress = (
  steps: PlanStep[]
): { completed: number; total: number } => {
  let completed = 0
  let total = 0

  const countSteps = (items: PlanStep[]) => {
    for (const step of items) {
      total++
      if (step.status === 'completed') {
        completed++
      }
      if (step.children) {
        countSteps(step.children)
      }
    }
  }

  countSteps(steps)
  return { completed, total }
}

interface PlanStepItemProps {
  step: PlanStep
  index: number
  depth?: number
  renderStep?: (step: PlanStep) => React.ReactNode
  collapsed?: boolean
}

const PlanStepItem = ({
  step,
  index,
  depth = 0,
  renderStep,
  collapsed = false,
}: PlanStepItemProps) => {
  const { id, title, description, status, children } = step
  const hasChildren = children && children.length > 0
  const [isExpanded, setIsExpanded] = useState(!collapsed)
  const isRunning = status === 'running'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'

  if (renderStep) {
    return <Fragment key={id}>{renderStep(step)}</Fragment>
  }

  // 计算子步骤进度
  const childProgress = hasChildren ? calculateProgress(children) : null

  return (
    <div key={id} className='group'>
      {/* 步骤行 */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
          'hover:bg-secondary/50',
          isRunning && 'bg-primary/5',
          depth > 0 && 'ml-5'
        )}
      >
        {/* 状态图标/勾选框 */}
        <div className='shrink-0'>
          <Icon
            name={getStatusIcon(status)}
            className={cn(
              'size-4',
              getStatusColor(status),
              isRunning && 'animate-spin'
            )}
          />
        </div>

        {/* 步骤编号 */}
        <span
          className={cn(
            'shrink-0 text-xs font-medium tabular-nums',
            isCompleted ? 'text-green-500' : 'text-muted-foreground',
            isFailed && 'text-destructive'
          )}
        >
          {depth === 0 ? `${index + 1}.` : `${index + 1}`}
        </span>

        {/* 标题 */}
        <span
          className={cn(
            'flex-1 truncate text-sm',
            isCompleted && 'text-muted-foreground line-through',
            isFailed && 'text-destructive',
            isRunning && 'font-medium'
          )}
        >
          {title}
        </span>

        {/* 子步骤进度 */}
        {hasChildren && childProgress && (
          <span className='text-muted-foreground text-xs tabular-nums'>
            {childProgress.completed}/{childProgress.total}
          </span>
        )}

        {/* 展开/收起按钮 */}
        {hasChildren && (
          <button
            type='button'
            className='hover:bg-secondary shrink-0 rounded p-0.5'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon
              name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
              className='text-muted-foreground size-3.5'
            />
          </button>
        )}
      </div>

      {/* 描述 */}
      {description && depth === 0 && (
        <div className='text-muted-foreground pb-1 pl-8 text-xs'>
          {description}
        </div>
      )}

      {/* 子步骤 */}
      {hasChildren && isExpanded && (
        <div className='border-border/50 ml-[11px] border-l'>
          {children.map((child, childIndex) => (
            <PlanStepItem
              key={child.id}
              step={child}
              index={childIndex}
              depth={depth + 1}
              renderStep={renderStep}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const ChatPlan = (props: ChatPlanProps) => {
  const { className, style, steps, renderStep } = props
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!steps || steps.length === 0) {
    return null
  }

  const progress = calculateProgress(steps)
  const progressPercent =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0
  const isAllCompleted = progress.completed === progress.total
  const hasRunning = steps.some(
    (step) =>
      step.status === 'running' ||
      step.children?.some((child) => child.status === 'running')
  )

  return (
    <div
      {...mergeTag('chat-plan', props)}
      className={cn(
        'chat-plan',
        'border-border overflow-hidden rounded-lg border',
        className
      )}
      style={style}
    >
      {/* 头部 */}
      <div
        className={cn(
          'flex cursor-pointer items-center gap-2 px-3 py-2',
          'bg-secondary/30 hover:bg-secondary/50 transition-colors',
          'border-border border-b'
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {/* 状态图标 */}
        <Icon
          name={
            isAllCompleted
              ? 'CircleCheck'
              : hasRunning
                ? 'LoaderCircle'
                : 'ListTodo'
          }
          className={cn(
            'size-4',
            isAllCompleted
              ? 'text-green-500'
              : hasRunning
                ? 'text-primary animate-spin'
                : 'text-muted-foreground'
          )}
        />

        {/* 标题 */}
        <span className='flex-1 text-sm font-medium'>
          {isAllCompleted ? '任务完成' : hasRunning ? '正在执行' : '待执行任务'}
        </span>

        {/* 进度 */}
        <span className='text-muted-foreground text-xs tabular-nums'>
          {progress.completed}/{progress.total}
        </span>

        {/* 进度条 */}
        <div className='bg-secondary h-1.5 w-16 overflow-hidden rounded-full'>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isAllCompleted ? 'bg-green-500' : 'bg-primary'
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 展开/收起 */}
        <Icon
          name={isCollapsed ? 'ChevronRight' : 'ChevronDown'}
          className='text-muted-foreground size-4'
        />
      </div>

      {/* 步骤列表 */}
      {!isCollapsed && (
        <div className='py-1'>
          {steps.map((step, index) => (
            <PlanStepItem
              key={step.id}
              step={step}
              index={index}
              renderStep={renderStep}
            />
          ))}
        </div>
      )}
    </div>
  )
}
