import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'
import { Button } from '@/button'
import { ChatActionsProps } from './types'
import { IconName } from '@/icon'

export const ChatActions = (props: ChatActionsProps) => {
  const { className, style, actions } = props

  if (!actions || actions.length === 0) {
    return null
  }

  const getButtonType = (
    type?: 'default' | 'primary' | 'destructive' | 'outline' | 'ghost'
  ) => {
    switch (type) {
      case 'primary':
        return 'default'
      case 'destructive':
        return 'destructive'
      case 'outline':
        return 'outline'
      case 'ghost':
        return 'ghost'
      default:
        return 'secondary'
    }
  }

  return (
    <div
      {...mergeTag('chat-actions', props)}
      className={cn('chat-actions', 'mt-3 flex flex-wrap gap-2', className)}
      style={style}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          type={getButtonType(action.type)}
          size='sm'
          icon={action.icon as IconName}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}
