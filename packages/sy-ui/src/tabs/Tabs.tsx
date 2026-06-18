import { Button } from '@/button'
import {
  BaseDirectionProps,
  BaseValueProps,
  cn,
  useControllable,
} from '@/utils'
import { get } from '@syvobase/utils'
import { ReactNode, RefAttributes, useImperativeHandle } from 'react'
import './Tabs.css'
import { mergeTag } from '@/utils/tag'
import { ContextMenu } from '@/contextMenu'
import { $t } from '@/utils/i18n'

type TabsItems = {
  id: string
  name: ReactNode
  content?: ReactNode
}[]

export interface TabsModel {
  deleteTab: (id: string) => void
}

export interface TabsProps
  extends BaseValueProps<string>, BaseDirectionProps, RefAttributes<TabsModel> {
  type?: 'pills' | 'line'
  value?: string
  items?: TabsItems
  full?: boolean
  enabledClose?: boolean
  headerClassName?: string
  onChange?: (value: string) => void
  onItemsChange?: (items: TabsItems) => void
  before?: ReactNode
  after?: ReactNode
  fixed?: boolean
  disabledPadding?: boolean
}

export const Tabs = (props: TabsProps) => {
  const {
    type = 'pills',
    className,
    headerClassName,
    style,
    full: _full = false,
    direction = 'top',
    enabledClose: _enabledClose = false,
    onItemsChange,
    items = [],
    before,
    after,
    fixed = true,
    disabledPadding = false,
    ref,
  } = props
  const [value, setValue] = useControllable<TabsProps, 'value'>({
    props,
    value: get(items, '0.id', ''),
  })

  const enabledClose = _enabledClose && items.length > 1
  const isVertical = ['left', 'right'].includes(direction)
  const isReverse = ['right', 'bottom'].includes(direction)
  const full = !isVertical && _full
  const deleteTab = (id: string) => {
    const index = items.findIndex(({ id: _id }) => id === _id)
    const newItems = items.filter(({ id: _id }) => id !== _id)
    onItemsChange?.(newItems)
    if (value === id) {
      setValue((newItems[index] || newItems[index - 1])?.id)
    }
  }
  const tabList = (
    <div
      className={cn(
        headerClassName,
        isVertical ? 'flex h-full flex-col' : 'flex flex-row'
      )}
    >
      <div>{before}</div>
      <div
        className={cn(
          'nk-tabs-list items-center overflow-auto',
          full && 'w-full',
          type === 'pills' && 'bg-muted text-muted-foreground rounded-lg p-1',
          type === 'line' && (isVertical ? 'space-y-3' : 'space-x-5'),
          isVertical
            ? 'flex h-auto flex-col justify-start'
            : 'inline-flex h-10',
          items.length === 0 && 'bg-transparent'
        )}
      >
        {items.map(({ id, name }, index) => (
          <div
            className={cn(
              'h-full cursor-pointer',
              isVertical ? 'flex justify-start' : 'inline-flex justify-center',
              'items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50',
              type === 'pills' && 'rounded-lg',
              type === 'line' && 'border-transparent',
              type === 'line' && direction === 'top' && 'border-b-2 px-0',
              type === 'line' && direction === 'bottom' && 'border-t-2 px-0',
              type === 'line' && direction === 'left' && 'border-r-2',
              type === 'line' && direction === 'right' && 'border-l-2',
              enabledClose && 'pr-0!',
              value === id &&
                type === 'pills' &&
                'bg-background text-foreground shadow-sm',
              value === id && type === 'line' && 'border-primary text-primary'
            )}
            key={id}
            onClick={() => setValue(id)}
            style={
              full
                ? {
                    width: `${(1 / items.length) * 100}%`,
                  }
                : {}
            }
          >
            {enabledClose ? (
              <ContextMenu
                items={[
                  {
                    name: $t('tabs.closeOther'),
                    onClick: () => {
                      setValue(id)
                      onItemsChange?.(items.filter((item) => item.id === id))
                    },
                  },
                  ...(index < items.length - 1
                    ? [
                        {
                          name: $t('tabs.closeRight'),
                          onClick: () => {
                            let changeValue = false
                            const newItems = items.filter((item, i) => {
                              if (item.id === value && index < i) {
                                changeValue = true
                              }
                              return i <= index
                            })
                            if (changeValue) {
                              setValue(id)
                            }
                            onItemsChange?.(newItems)
                          },
                        },
                      ]
                    : []),
                ]}
              >
                <div className={'flex flex-row items-center gap-1 pr-1'}>
                  {name}
                  {enabledClose && (
                    <Button
                      rounded
                      type='ghost'
                      size='sm'
                      icon='X'
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTab(id)
                      }}
                    />
                  )}
                </div>
              </ContextMenu>
            ) : (
              name
            )}
          </div>
        ))}
      </div>
      <div>{after}</div>
    </div>
  )
  const tabContent = items.map(
    ({ id, content }) =>
      content && (
        <div
          role='tabpanel'
          className={cn(
            value !== id && 'hidden!',
            content && 'flex-1',
            !disabledPadding && content && 'mt-2'
          )}
          key={id}
          style={style}
        >
          {content}
        </div>
      )
  )
  useImperativeHandle(ref, () => ({
    deleteTab,
  }))
  return (
    <div
      {...mergeTag('tabs', props)}
      className={cn(
        'nk-tabs flex',
        !isVertical && 'flex-col',
        full && 'w-full',
        className
      )}
      style={style}
    >
      {isReverse ? (
        <>
          {fixed ? <div className='flex flex-1'>{tabContent}</div> : tabContent}
          {tabList}
        </>
      ) : (
        <>
          {tabList}
          {fixed ? <div className='flex flex-1'>{tabContent}</div> : tabContent}
        </>
      )}
    </div>
  )
}
