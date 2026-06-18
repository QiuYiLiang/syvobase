import { Icon, IconName } from '@/icon'
import { BaseAlignProps, BaseDirectionProps, cn, useRect } from '@/utils'
import {
  Root,
  Content,
  Item,
  Label,
  Separator,
  Sub,
  SubContent,
  Trigger,
  SubTrigger,
  DropdownMenuProps,
  Portal,
} from '@radix-ui/react-dropdown-menu'
import { Fragment, ReactNode, useRef, useState } from 'react'
import { mergeTag } from '@/utils/tag'

export type DropdownMenuType = (
  | DropdownMenuItemType
  | DropdownMenuLabelType
  | DropdownMenuSeparatorType
)[]

interface DropdownMenuItemType {
  type?: 'item'
  icon?: IconName
  name: ReactNode
  visible?: () => boolean
  onClick?: () => Promise<void> | void
  items?: DropdownMenuType
}
interface DropdownMenuLabelType {
  type: 'label'
  visible?: () => boolean
  name: string
}
interface DropdownMenuSeparatorType {
  type: 'separator'
  visible?: () => boolean
}

export interface DropdownProps
  extends DropdownMenuProps, BaseDirectionProps, BaseAlignProps {
  disabledIcon?: boolean
  items?: DropdownMenuType
  equalWidth?: boolean
  trigger?: 'click' | 'hover'
}

const DropdownMenuItems = ({
  disabledIcon = true,
  items,
}: {
  disabledIcon?: boolean
  items: DropdownMenuType
}) => {
  return items.map((item, index) => {
    const { type, visible } = item
    if (visible && !visible()) {
      return <Fragment key={index} />
    }
    if (type === 'separator') {
      return <Separator key={index} className='bg-border -mx-1 my-1 h-px' />
    }
    if (type === 'label') {
      return (
        <Label
          key={index}
          className='truncate px-2 py-1.5 text-sm font-semibold'
        >
          {item.name}
        </Label>
      )
    }

    const { icon, name, items: children, onClick } = item

    const title = (
      <>
        {!disabledIcon && icon && <Icon name={icon} className='mr-2 h-4 w-4' />}
        <span className={cn('truncate', !disabledIcon && !icon && 'ml-6')}>
          {name}
        </span>
      </>
    )

    if (Array.isArray(children)) {
      return (
        <Sub key={index}>
          <SubTrigger className='focus:bg-secondary data-[state=open]:bg-secondary flex cursor-default items-center rounded-lg px-2 py-1.5 text-sm outline-none select-none'>
            {title}
            <Icon name='ChevronRight' className='ml-auto h-4 w-4' />
          </SubTrigger>
          <SubContent className='border-border bg-popover text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-9999999 overflow-hidden rounded-lg border p-1 shadow-lg'>
            <DropdownMenuItems items={children} />
          </SubContent>
        </Sub>
      )
    }

    return (
      <Item
        key={index}
        className='focus:bg-secondary focus:text-secondary-foreground relative flex cursor-default items-center rounded-lg px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50'
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
      >
        {title}
      </Item>
    )
  })
}

export const Dropdown = ({
  disabledIcon = true,
  items = [],
  equalWidth = true,
  children,
  trigger = 'hover',
  direction = 'bottom',
  align = 'left',
  ...props
}: DropdownProps) => {
  const triggerRef = useRef(null)
  const { width = 0 } = useRect(triggerRef, ['width'])
  const [open, setOpen] = useState(false)
  const isHoverTrigger = trigger === 'hover'
  return (
    <Root
      {...mergeTag('dropdown', props)}
      {...props}
      open={open}
      onOpenChange={setOpen}
    >
      <Trigger
        ref={triggerRef}
        style={isHoverTrigger ? { pointerEvents: 'auto' } : {}}
        onMouseEnter={() => {
          if (isHoverTrigger) {
            setOpen(true)
          }
        }}
        onMouseLeave={() => {
          if (isHoverTrigger) {
            setOpen(false)
          }
        }}
      >
        {children}
      </Trigger>
      <Portal>
        <Content
          side={direction as any}
          align={
            { left: 'start', center: 'center', right: 'end' }[align] as any
          }
          className='border-border bg-popover text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-9999999 overflow-hidden rounded-lg border p-1 shadow-md'
          style={
            equalWidth
              ? {
                  minWidth: width,
                }
              : {}
          }
          onMouseEnter={() => {
            if (isHoverTrigger) {
              setOpen(true)
            }
          }}
          onMouseLeave={() => {
            if (isHoverTrigger) {
              setOpen(false)
            }
          }}
        >
          <DropdownMenuItems disabledIcon={disabledIcon} items={items} />
        </Content>
      </Portal>
    </Root>
  )
}
