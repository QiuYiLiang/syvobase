import {
  createContext,
  CSSProperties,
  Fragment,
  isValidElement,
  ReactNode,
  RefAttributes,
  useContext,
} from 'react'
import { Button, ButtonProps } from '../button'
import { BaseProps, BaseSizeProps, cn, InlineModeProps } from '@/utils'
import { mergeTag } from '@/utils/tag'

interface ToolbarButtonItem extends Omit<ButtonProps, 'children'> {
  id?: string
  visible?: () => boolean
  name?: string
}

export type ToolbarItem = ToolbarButtonItem | ReactNode

export interface ToolbarProps
  extends
    BaseProps,
    BaseSizeProps,
    InlineModeProps,
    RefAttributes<HTMLDivElement> {
  left?: ToolbarItem[]
  items?: ToolbarItem[]
  right?: ToolbarItem[]
  context?: Record<string, any>
  onlyIcon?: boolean
  type?: ButtonProps['type']
  rounded?: ButtonProps['rounded']
  disabled?: boolean
  hover?: boolean
  fullMode?: boolean
  stopPropagation?: boolean
  emptySpacing?: boolean
}

const ToolbarContext = createContext(
  {} as ButtonProps &
    InlineModeProps & {
      emptySpacing: boolean
      stopPropagation: boolean
    }
)

export const Toolbar = (props: ToolbarProps) => {
  const {
    ref,
    className,
    style,
    fullMode = false,
    left = [],
    items = [],
    right = [],
    onlyIcon,
    type,
    size,
    rounded,
    disabled,
    emptySpacing = false,
    inlineMode = false,
    stopPropagation = true,
  } = props
  const hasCenter = items.length > 0
  return (
    left.length + items.length + right.length > 0 && (
      <ToolbarContext
        value={{
          onlyIcon,
          type,
          size,
          rounded,
          disabled,
          inlineMode,
          emptySpacing,
          stopPropagation,
        }}
      >
        <div
          {...mergeTag('toolbar', props)}
          className={cn([
            'flex justify-between',
            !inlineMode && 'w-full',
            !inlineMode && !emptySpacing && 'space-x-2',
            className,
          ])}
          ref={ref}
          style={style}
        >
          <ToolbarGroup items={left} className={cn(hasCenter && 'flex-1')} />
          {hasCenter && (
            <ToolbarGroup
              items={items}
              fullMode={fullMode}
              className={cn([
                'justify-center',
                fullMode && left.length === 0 && right.length === 0 && 'w-full',
              ])}
            />
          )}
          <ToolbarGroup
            items={right}
            className={cn('justify-end', hasCenter && 'flex-1')}
          />
        </div>
      </ToolbarContext>
    )
  )
}

interface ToolbarGroupProps {
  className?: string
  items: ToolbarItem[]
  fullMode?: boolean
  style?: CSSProperties
}

const ToolbarGroup = ({
  className,
  style,
  items,
  fullMode = false,
}: ToolbarGroupProps) => {
  const { inlineMode, stopPropagation, emptySpacing, ...buttonProps } =
    useContext(ToolbarContext)
  return (
    <div
      className={cn(
        'flex items-center',
        !emptySpacing && 'space-x-2',
        !emptySpacing && inlineMode && 'space-x-1',
        className
      )}
      style={style}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation()
        }
      }}
    >
      {items.map((toolbarItem: ToolbarItem, index) => {
        if (isValidElement(toolbarItem) || typeof toolbarItem !== 'object') {
          return <Fragment key={index}>{toolbarItem}</Fragment>
        }
        const toolbarButtonItem = toolbarItem as ToolbarButtonItem
        if (toolbarButtonItem.visible && !toolbarButtonItem.visible()) {
          return <Fragment key={index}></Fragment>
        }
        return (
          <Button
            className={cn(fullMode && 'w-full')}
            key={index}
            {...buttonProps}
            {...toolbarButtonItem}
            {...(inlineMode ? { type: 'ghost', size: 'sm' } : {})}
          >
            {toolbarButtonItem?.name}
          </Button>
        )
      })}
    </div>
  )
}
