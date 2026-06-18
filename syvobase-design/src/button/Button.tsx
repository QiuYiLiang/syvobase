import {
  ReactNode,
  useRef,
  useState,
  ButtonHTMLAttributes,
  createElement,
  RefAttributes,
} from 'react'
import { Icon, IconName } from '@/icon'
import {
  BaseAlignProps,
  BaseDirectionProps,
  BaseSizeProps,
  cn,
  useKeydown,
} from '@/utils'
import { Dropdown, DropdownMenuType, DropdownProps } from '@/dropdown'
import { Popover, PopoverProps } from '@/popover'
import { mergeTag } from '@/utils/tag'

export interface ButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLDivElement>, 'type' | 'disabled' | 'popover'>,
    BaseSizeProps,
    BaseDirectionProps,
    BaseAlignProps,
    RefAttributes<HTMLDivElement> {
  items?: DropdownMenuType
  type?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  disabled?: boolean
  rounded?: boolean
  className?: string
  icon?: IconName | ReactNode
  children?: ReactNode
  onlyIcon?: boolean
  popover?: ReactNode
  popoverProps?: PopoverProps
  dropdownProps?: DropdownProps
  trigger?: PopoverProps['trigger']
  dropdownTrigger?: DropdownProps['trigger']
  htmlTag?: string
  showChildrenPopover?: boolean
  disabledDropdownIcon?: boolean
  keyboardKey?: string
  rightIcon?: boolean
}

export const Button = ({
  ref,
  className,
  icon,
  type = 'default',
  size = 'default',
  items,
  children,
  disabled,
  rounded,
  onlyIcon,
  popover,
  popoverProps,
  dropdownProps,
  direction,
  align,
  trigger = 'hover',
  dropdownTrigger = 'hover',
  htmlTag = 'div',
  showChildrenPopover = false,
  disabledDropdownIcon = false,
  keyboardKey,
  rightIcon = false,
  onClick,
  ...props
}: ButtonProps) => {
  const [loading, setLoading] = useState(false)
  const dropdownButtonRef = useRef(null)
  const isDropdownButton = Array.isArray(items)
  const showPopover = !!((showChildrenPopover && children) || popover)
  const buttonRef = useRef(null)

  const handleClick = (e) => {
    if (disabled || loading) {
      return
    }
    const promise = onClick?.(e) as any
    if (promise instanceof Promise) {
      const timer = setTimeout(() => {
        setLoading(true)
      }, 500)

      promise.finally(() => {
        clearTimeout(timer)
        setLoading(false)
      })
    }
  }
  useKeydown(keyboardKey, () => {
    ;(buttonRef as any)?.current?.click()
  })
  const iconElement =
    loading || (icon && typeof icon === 'string') ? (
      <Icon
        name={(loading ? 'LoaderCircle' : icon) as IconName}
        className={cn(
          children &&
            !onlyIcon &&
            (rightIcon
              ? size === 'sm'
                ? 'ml-1'
                : 'ml-2'
              : size === 'sm'
                ? 'mr-1'
                : 'mr-2')
        )}
      />
    ) : (
      icon
    )
  const button = createElement(htmlTag, {
    ...mergeTag('button'),
    className: cn(
      'relative cursor-pointer inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
      {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border bg-background hover:bg-secondary hover:text-secondary-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-foreground/10',
        ghost: 'hover:bg-secondary hover:text-secondary-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
      }[type],
      {
        default: children && !onlyIcon ? 'h-8 px-3 py-2' : 'size-8',
        sm: children && !onlyIcon ? 'h-6 rounded-md px-2' : 'size-6 text-xs',
        lg: children && !onlyIcon ? 'h-10 rounded-md px-4' : 'size-10',
      }[size],
      (disabled || loading) && 'cursor-not-allowed',
      rounded && 'rounded-full',
      className
    ),
    role: 'button',
    disabled: disabled || loading,
    onClick: handleClick,
    ref: (el) => {
      buttonRef.current = el
      if (ref) {
        ;(ref as any).current = el
      }
    },
    ...(props as any),
    children: (
      <>
        {disabled && (
          <div className='absolute top-0 left-0 z-50 h-full w-full cursor-not-allowed bg-gray-100 opacity-60'></div>
        )}
        {!rightIcon && iconElement}
        {!onlyIcon && children}
        {rightIcon && iconElement}
        {isDropdownButton && !disabledDropdownIcon && (
          <Icon
            name='ChevronDown'
            className={cn(size === 'sm' ? 'ml-1' : 'ml-2')}
          />
        )}
      </>
    ),
  })

  const buttonWithPopover = showPopover ? (
    <Popover
      trigger={trigger}
      direction={direction}
      align={align}
      {...(popoverProps || {})}
      content={popover ?? children}
    >
      {button}
    </Popover>
  ) : (
    button
  )

  if (isDropdownButton) {
    return (
      <Dropdown
        trigger={dropdownTrigger}
        items={items}
        {...(dropdownProps || {})}
      >
        <div ref={dropdownButtonRef}>{buttonWithPopover}</div>
      </Dropdown>
    )
  }

  return buttonWithPopover
}
