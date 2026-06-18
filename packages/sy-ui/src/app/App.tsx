import { ReactNode, Suspense, useState } from 'react'
import { Menu, MenuProps } from '@/menu'
import { Toolbar, ToolbarProps } from '@/toolbar'
import { Fold } from '@/fold'
import { Button } from '@/button'
import { cn } from '@/utils'
import { mergeTag } from '@/utils/tag'

export interface AppItem {
  id: string
  name: string
  icon?: ReactNode
  children: MenuProps['items']
}
export interface AppProps extends MenuProps {
  children?: ReactNode
  toolbar?: ToolbarProps
  type?: 'line' | 'rounded'
  foldMode?: boolean
  apps?: AppItem[]
}

export const App = (props: AppProps) => {
  const {
    className,
    style,
    children,
    toolbar,
    type = 'line',
    foldMode = true,
    apps = [],
    items = [],
    ...menuProps
  } = props

  const [foldValue, setFoldValue] = useState(true)
  const [activeAppId, setActiveAppId] = useState<string | null>(
    apps.length > 0 ? apps[0].id : null
  )

  // 获取当前激活 app 的菜单项
  const activeApp = apps.find((app) => app.id === activeAppId)
  const currentMenuItems = activeApp?.children ?? items

  return (
    <div
      {...mergeTag('app', props)}
      className={cn(
        'bg-background flex h-full flex-col',
        type === 'rounded' && 'bg-secondary/50',
        className
      )}
      style={style}
    >
      {toolbar && (
        <div
          className={cn(
            'border-border flex items-center px-3 py-2',
            type === 'line' && 'border-b'
          )}
        >
          <Toolbar {...toolbar} />
        </div>
      )}
      <div className='flex flex-1'>
        {apps.length > 0 && (
          <div
            className={cn(
              'border-border flex flex-col items-center gap-1 p-2',
              type === 'line' && 'border-r'
            )}
          >
            {apps.map((app) => (
              <Button
                key={app.id}
                type={activeAppId === app.id ? 'default' : 'ghost'}
                size='sm'
                title={app.name}
                onClick={() => setActiveAppId(app.id)}
              >
                {app.icon}
              </Button>
            ))}
          </div>
        )}
        {currentMenuItems.length > 0 && (
          <Fold
            disabled={!foldMode}
            className={cn(
              'w-50',
              type === 'line' && 'border-border border-r',
              type === 'rounded' && 'px-1'
            )}
            value={foldValue}
            onChange={setFoldValue}
          >
            <Menu items={currentMenuItems} {...menuProps} />
          </Fold>
        )}
        <div
          className={cn(
            'h-full flex-1',
            type === 'rounded' && 'pr-4 pb-4',
            type === 'rounded' && (!foldValue || items.length === 0) && 'pl-4'
          )}
        >
          <div
            className={cn(
              'border-border h-full w-full border shadow',
              type === 'rounded' && 'bg-background rounded-2xl p-1'
            )}
          >
            <Suspense>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
