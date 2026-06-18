import {
  addZIndex,
  BaseAlignProps,
  BaseDirectionProps,
  BaseProps,
  cn,
  useRect,
} from '@/utils'
import {
  PopoverProps as BasePopoverProps,
  Content as ClickContent,
  Root as ClickRoot,
  Trigger as ClickTrigger,
  Portal as ClickPortal,
} from '@radix-ui/react-popover'
import {
  Root as HoverRoot,
  Trigger as HoverTrigger,
  Content as HoverContent,
  Portal as HoverPortal,
} from '@radix-ui/react-hover-card'
import {
  ReactNode,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { mergeTag } from '@/utils/tag'

export interface PopoverProps
  extends
    BaseProps,
    BasePopoverProps,
    BaseDirectionProps,
    BaseAlignProps,
    RefAttributes<PopoverModel> {
  content?: ReactNode | (() => ReactNode)
  equalWidth?: boolean
  disabled?: boolean
  offset?: number
  trigger?: 'click' | 'hover'
  openDelay?: number
  animate?: boolean
}

export interface PopoverModel {
  close: () => void
}

export const Popover = ({
  ref,
  className,
  style,
  children,
  content,
  offset = 4,
  disabled = false,
  equalWidth = false,
  trigger: _trigger = 'hover',
  direction = 'bottom',
  align = 'center',
  openDelay = 300,
  animate = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: PopoverProps) => {
  const triggerRef = useRef<HTMLElement>(null)
  const [internalOpen, setInternalOpen] = useState(false)
  const [zIndex, setZIndex] = useState(() => addZIndex())
  const { width = 0 } = useRect(triggerRef, ['width'])

  // 支持受控模式
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen

  useImperativeHandle(ref, () => ({
    close: () => {
      setOpen(false)
    },
  }))

  // 移动端 hover 时使用 click，避免 passive event listener 问题
  const isMobile =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const trigger = isMobile && _trigger === 'hover' ? 'click' : _trigger

  const { Root, Trigger, Portal, Content } = (() =>
    ({
      hover: {
        Root: HoverRoot,
        Trigger: HoverTrigger,
        Content: HoverContent,
        Portal: HoverPortal,
      },
      click: {
        Root: ClickRoot,
        Trigger: ClickTrigger,
        Content: ClickContent,
        Portal: ClickPortal,
      },
    })[trigger])()
  useEffect(() => {
    setZIndex(addZIndex())
  }, [open])
  return (
    <Root
      {...mergeTag('popover', props)}
      open={!disabled && open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
      openDelay={openDelay}
      {...props}
    >
      <Trigger asChild ref={triggerRef as any}>
        {children}
      </Trigger>
      <Portal>
        <Content
          side={direction as any}
          sideOffset={offset}
          align={
            { left: 'start', center: 'center', right: 'end' }[align] as any
          }
          className={cn(
            'border-border bg-popover text-popover-foreground overflow-auto rounded-lg border p-2 text-sm shadow-md',
            animate &&
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          style={{
            zIndex,
            maxWidth: 'var(--radix-popper-available-width)',
            maxHeight: 'var(--radix-popper-available-height)',
            ...(equalWidth
              ? {
                  width,
                }
              : {}),
            ...style,
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
          collisionPadding={8}
        >
          {typeof content === 'function' ? content() : content}
        </Content>
      </Portal>
    </Root>
  )
}
