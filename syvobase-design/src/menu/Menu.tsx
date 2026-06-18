import { createContext, ReactNode, useContext, useState } from 'react'
import { Icon } from '@/icon'
import { keyBy, Dict, treeToArray } from '@syvobase/utils'
import { BaseSizeProps, BaseValueProps, cn, useControllable } from '@/utils'
import { $t } from '@/utils/i18n'
import { Button } from '@/button'
import { Badge } from '@/badge'
import { Text } from '@/text'
import { mergeTag } from '@/utils/tag'

interface MenuItemType {
  id: string
  name: string
  icon?: ReactNode
  count?: number
  children?: MenuItemType[]
}

export type MenuMode = 'vertical' | 'horizontal' | 'inline'

export interface MenuProps extends BaseValueProps<string>, BaseSizeProps {
  items?: MenuItemType[]
  onItemClick?: (item: Dict) => void | Promise<void>
  enabledSearch?: boolean
  /** 菜单模式：vertical（垂直悬浮）、horizontal（水平悬浮）、inline（内联展开） */
  mode?: MenuMode
}

interface MenuContextType {
  value: string
  openKeyMap: Record<string, boolean>
  activePath: string[]
  size: Required<MenuProps['size']>
  mode: MenuMode
  handleMenuItemClick: (
    item: MenuItemType,
    options?: {
      isAppItem: boolean
    }
  ) => void
}

const MenuContext = createContext({} as MenuContextType)

export const Menu = (props: MenuProps) => {
  const {
    className,
    size = 'lg',
    items = [],
    style,
    enabledSearch = false,
    mode = 'inline',
    onItemClick,
  } = props
  const [value, setValue] = useControllable({
    props,
    value: '',
  })
  const [openKeyMap, setOpenKeyMap] = useState<Record<string, boolean>>({})
  const [keyword, setKeyword] = useState('')

  const arrayData = treeToArray(items)
  const itemsMap = keyBy(arrayData, 'id')
  const pathMap = (() => {
    const pathMap: Record<string, string[]> = {}
    arrayData.forEach((item: any) => {
      const { id } = item
      pathMap[id] = [id]
      let current = item
      while (current.parentId) {
        pathMap[id].unshift(current.parentId)
        current = itemsMap[current.parentId]
      }
    })
    return pathMap
  })()

  const activePath = pathMap[value] || []

  const handleMenuItemClick: MenuContextType['handleMenuItemClick'] = (
    item,
    options
  ) => {
    const { id, children } = item
    const { isAppItem = false } = options ?? {}

    if (Array.isArray(children)) {
      if (isAppItem) {
        setValue('')
      }
      setOpenKeyMap((openKeyMap) => {
        const newOpenKeyMap = { ...openKeyMap }
        // 使用显式的 true/false 来标记展开/折叠状态
        newOpenKeyMap[id] = !newOpenKeyMap[id]
        return newOpenKeyMap
      })
    } else {
      if (isAppItem) {
        setOpenKeyMap((openKeyMap) => {
          const newOpenKeyMap = { ...openKeyMap }
          items.forEach(({ id }) => {
            delete newOpenKeyMap[id]
          })

          return newOpenKeyMap
        })
      }
      setValue(id)
      onItemClick?.(item)
    }
  }

  const subMenuItems = items

  const { currentSubMenuItems, searchOpenKeyMap } = (() => {
    if (keyword === '') {
      return { currentSubMenuItems: subMenuItems, searchOpenKeyMap: {} }
    }
    const searchOpenKeyMap: Record<string, boolean> = {}
    const filter = (items: MenuItemType[]) => {
      const newItems: MenuItemType[] = []
      items.forEach((item) => {
        const { name, children } = item
        const newItem = { ...item }
        const isLeaf = !Array.isArray(children)
        if (isLeaf) {
          if (name.includes(keyword)) {
            newItems.push(newItem)
          }
        } else {
          newItem.children = filter(children)
          if (newItem.children.length > 0) {
            searchOpenKeyMap[newItem.id] = true
            newItems.push(newItem)
          }
        }
      })
      return newItems
    }
    const newItems = filter(subMenuItems) as MenuItemType[]
    return { currentSubMenuItems: newItems, searchOpenKeyMap }
  })()

  const currentOpenKeyMap = (() => {
    // 先合并搜索打开的和用户手动操作的
    const baseMap = {
      ...searchOpenKeyMap,
      ...openKeyMap,
    }
    // 对于 activePath 的父级，只有当用户没有显式折叠时才自动展开
    activePath.slice(0, -1).forEach((item) => {
      // 只有当用户没有显式设置过该项时，才自动展开
      if (openKeyMap[item] === undefined) {
        baseMap[item] = true
      }
    })
    return baseMap
  })()

  return (
    <MenuContext
      value={{
        size,
        value,
        activePath,
        mode,
        openKeyMap: currentOpenKeyMap,
        handleMenuItemClick,
      }}
    >
      <div
        {...mergeTag('menu', props)}
        className={cn(
          'flex h-full',
          mode === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'flex-1',
            mode === 'horizontal' ? 'flex flex-row items-center' : 'p-2'
          )}
        >
          {enabledSearch && mode !== 'horizontal' && (
            <Text
              className='mb-2'
              placeholder={$t('menu.search')}
              before={<Icon name='Search' />}
              after={
                keyword !== '' && (
                  <div
                    className='text-foreground hover:text-foreground/50 cursor-pointer'
                    onClick={() => setKeyword('')}
                  >
                    <Icon name='X' />
                  </div>
                )
              }
              value={keyword}
              onChange={setKeyword}
            />
          )}
          {currentSubMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} level={0} />
          ))}
        </div>
      </div>
    </MenuContext>
  )
}

interface MenuItemProps {
  item: MenuItemType
  level: number
}

const MenuItem = ({ item, level }: MenuItemProps) => {
  const { id, name, icon: _icon, count = 0, children } = item
  const { size, value, activePath, openKeyMap, mode, handleMenuItemClick } =
    useContext(MenuContext)

  const isActivePath = activePath.includes(id)
  const isGroup = Array.isArray(children)
  const isInlineMode = mode === 'inline'
  const isOpen = isGroup && !!openKeyMap[id]
  const isTopLevel = level === 0
  const isHorizontalTop = mode === 'horizontal' && isTopLevel
  const icon = typeof _icon === 'string' ? <Icon name={_icon} /> : _icon

  const handleClick = () => {
    if (isGroup && !isInlineMode) {
      // 悬浮模式下，点击有子菜单的项不做处理（通过 hover 展开）
      return
    }
    handleMenuItemClick(item)
  }

  const getChevronIcon = () => {
    if (isHorizontalTop) {
      return 'ChevronDown'
    }
    if (isInlineMode) {
      return isOpen ? 'ChevronDown' : 'ChevronRight'
    }
    return 'ChevronRight'
  }

  const buttonContent = (
    <>
      {/* 横向模式一级菜单：底部下划线 */}
      {isHorizontalTop && isActivePath && (
        <div className='bg-primary absolute right-4 bottom-0 left-4 h-0.5'></div>
      )}
      {/* 非横向一级菜单：左侧竖线 */}
      {!isHorizontalTop && isGroup && isActivePath && (
        <div className='bg-primary absolute left-0 h-[50%] w-0.5'></div>
      )}
      <div className='flex items-center space-x-1'>
        {icon}
        <div>
          {count > 0 ? (
            <Badge
              count={count}
              type='destructive'
              position={{ right: -5, top: -3 }}
            >
              {name}
            </Badge>
          ) : (
            name
          )}
        </div>
      </div>
      {isGroup && <Icon className='ml-1' name={getChevronIcon()} />}
    </>
  )

  // 悬浮模式下的子菜单内容 - 二维布局
  // 第一个分组为父级名称下的叶子菜单，后续分组为子分组
  const submenuContent = (() => {
    if (!isGroup) return undefined

    // 分离叶子节点和分组节点
    const leafItems = children!.filter(
      (child) => !Array.isArray(child.children)
    )
    const groupItems = children!.filter((child) =>
      Array.isArray(child.children)
    )

    // 如果全是叶子节点，不显示父级标题
    const isAllLeaf = groupItems.length === 0

    return (
      <div className='flex gap-4'>
        {leafItems.length > 0 && (
          <div className='min-w-32 space-y-2'>
            {!isAllLeaf && (
              <div className='text-muted-foreground border-border border-b p-2 px-3'>
                {name}
              </div>
            )}
            <div className='flex flex-col'>
              {leafItems.map((leafChild) => (
                <MenuItem
                  key={leafChild.id}
                  item={leafChild}
                  level={level + 1}
                />
              ))}
            </div>
          </div>
        )}
        {/* 后续分组：子分组 */}
        {groupItems.map((groupChild) => (
          <div key={groupChild.id} className='min-w-32 space-y-2'>
            <div className='text-muted-foreground border-border border-b p-2 px-3'>
              {groupChild.name}
            </div>
            <div className='flex flex-col'>
              {groupChild.children!.map((subChild) => (
                <MenuItem key={subChild.id} item={subChild} level={level + 2} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  })()

  // 计算 popover 方向
  const popoverDirection = isHorizontalTop ? 'bottom' : 'right'

  // 悬浮模式：使用 Button 的 popover 功能
  if (isGroup && !isInlineMode) {
    return (
      <Button
        className={cn(
          'relative flex justify-between',
          !isHorizontalTop && 'w-full',
          isHorizontalTop && 'h-8 px-3 py-2'
        )}
        size={size}
        type='ghost'
        popover={submenuContent}
        popoverProps={{
          direction: popoverDirection,
          className: 'p-3',
          align: 'left',
        }}
        trigger='hover'
      >
        {buttonContent}
      </Button>
    )
  }

  return (
    <div>
      <Button
        className={cn(
          'relative flex justify-between',
          !isHorizontalTop && 'w-full',
          isHorizontalTop && 'h-8 px-3 py-2'
        )}
        size={size}
        type={
          !isGroup && value === id && !isHorizontalTop ? 'default' : 'ghost'
        }
        onClick={handleClick}
      >
        {buttonContent}
      </Button>
      {/* Inline 模式：直接展开子菜单 */}
      {isInlineMode && isOpen && (
        <div className='pl-4'>
          {children!.map((child) => (
            <MenuItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
