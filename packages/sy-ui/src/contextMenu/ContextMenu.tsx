import {
  Content,
  Item,
  Label,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
  Portal,
} from '@radix-ui/react-context-menu'
import { DropdownMenuType } from '@/dropdown'
import { Icon } from '@/icon'
import { cn } from '@/utils'
import { Fragment, ReactNode } from 'react'
import { mergeTag } from '@/utils/tag'

export interface ContextMenuProps {
  children: ReactNode
  items: DropdownMenuType
}

export const ContextMenuItems = ({ items }: { items: DropdownMenuType }) => {
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
          className='text-foreground truncate px-2 py-1.5 text-sm font-semibold'
        >
          {item.name}
        </Label>
      )
    }

    const { icon, name, items: children, onClick } = item

    const title = (
      <>
        {icon && <Icon name={icon} className='mr-2 h-4 w-4' />}
        <span className={cn('truncate', !icon && 'ml-6')}>{name}</span>
      </>
    )

    if (Array.isArray(children)) {
      return (
        <Sub key={index}>
          <SubTrigger className='focus:bg-secondary focus:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground flex cursor-default items-center rounded-lg px-2 py-1.5 text-sm outline-none select-none'>
            {title}
            <Icon name='ChevronRight' className='ml-auto h-4 w-4' />
          </SubTrigger>
          <SubContent className='border-border bg-popover text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-lg border p-1 shadow-md'>
            <ContextMenuItems items={children} />
          </SubContent>
        </Sub>
      )
    }

    return (
      <Item
        key={index}
        className='focus:bg-secondary focus:text-foreground relative flex cursor-default items-center rounded-lg px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50'
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

export const ContextMenu = (props: ContextMenuProps) => {
  const { children, items } = props
  return (
    <Root {...mergeTag('context-menu', props)}>
      <Trigger asChild>{children}</Trigger>
      <Portal>
        <Content className='border-border bg-popover text-foreground animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-lg border p-1 shadow-md'>
          <ContextMenuItems items={items} />
        </Content>
      </Portal>
    </Root>
  )
}
