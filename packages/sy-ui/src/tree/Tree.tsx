import { Dict } from '@syvobase/utils'
import { Table, TableModel, TableNode, TableProps } from '@/table'
import {
  BaseSelectProps,
  useControllable,
  getSelectControllableOptions,
  cn,
} from '@/utils'
import { $t } from '@/utils/i18n'
import {
  isValidElement,
  ReactNode,
  RefAttributes,
  useEffect,
  useState,
} from 'react'
import { Toolbar, ToolbarItem } from '@/toolbar'
import { Text, TextProps } from '@/text'
import { mergeTag } from '@/utils/tag'

export interface TreeModel extends TableModel {}
export interface TreeProps<V = any>
  extends
    BaseSelectProps<V>,
    Pick<
      TableProps,
      | 'isTree'
      | 'isTreeData'
      | 'draggable'
      | 'maxExpandLevel'
      | 'rowToolbar'
      | 'defaultOpenKeys'
      | 'openKeys'
      | 'onOpenKeysChange'
      | 'onIconRender'
      | 'checkStrictly'
      | 'virtual'
      | 'onDrag'
      | 'canDrop'
      | 'showEmptyParentNode'
      | 'disabledArrowHover'
      | 'defaultExpandLevel'
      | 'onFetchChildren'
      | 'enabledCheckboxRow'
      | 'toggleMode'
      | 'onDisabledDraggable'
    >,
    RefAttributes<TreeModel> {
  items: Dict[]
  search?: TextProps
  localSearch?: boolean
  toolbar?: ToolbarItem[]
  itemMaxHeight?: number
  onFilter?: (node: TableNode) => boolean
  onItemsChange?: (data: Dict[]) => void
  onNodeClick?: (node: TableNode) => void
  onItemRender?: TableProps['onCellRender']
}

export const Tree = ((props) => {
  const {
    ref = { current: null },
    className,
    style,
    multiple = false,
    isTree = true,
    isTreeData = false,
    draggable = false,
    items,
    commaSplit = false,
    toolbar = [],
    maxExpandLevel = 3,
    search,
    localSearch = false,
    showEmptyParentNode,
    fieldNames: _fieldNames = {},
    disabledArrowHover,
    defaultExpandLevel,
    enabledCheckboxRow,
    toggleMode,
    rowToolbar,
    canDrop,
    checkStrictly,
    virtual,
    itemMaxHeight,
    onFilter,
    onItemsChange,
    onNodeClick,
    onDisabledItem,
    onIconRender,
    onItemRender,
    onDisabledDraggable,
    onDrag,
    onFetchChildren,
  } = props

  const [value, setValue] = useControllable<TreeProps, 'value'>({
    props,
    value: undefined,
    ...getSelectControllableOptions({
      multiple,
      commaSplit,
    }),
  })
  const [openKeys, setOpenKeys] = useControllable<TreeProps, 'openKeys'>({
    props,
    value: [],
    valueKey: 'openKeys',
    onChangeKey: 'onOpenKeysChange',
  })

  const [currentExpandLevel, setCurrentExpandLevel] = useState<number>(
    defaultExpandLevel ?? 1
  )

  const { nameKey = 'name', disabledKey = 'disabled' } = _fieldNames

  const hasToolbar = toolbar.length > 0
  const hasExpandLevel =
    isTree && !(typeof onFetchChildren === 'function') && maxExpandLevel > 1
  const transformToolbarItems = (toolbarItems: ToolbarItem[]) => {
    return toolbarItems.map((toolbarItem) => {
      if (isValidElement(toolbarItem) || typeof toolbarItem !== 'object') {
        return toolbarItem
      }
      return { onlyIcon: true, ...toolbarItem }
    })
  }

  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    ;(ref as any).current?.filter((node: TableNode) => {
      return onFilter ? onFilter(node) : true
    }, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, onFilter])

  const showSearch = search || localSearch

  const showToolbar = hasToolbar || hasExpandLevel

  const fixed = showSearch || showToolbar

  const isDisabledItem = (node: Dict) => {
    const disabledItem =
      node.data?.[disabledKey] ||
      (typeof onDisabledItem === 'function' ? onDisabledItem(node) : false)
    return disabledItem
  }

  const content = (
    <Table
      className='h-full'
      ref={ref}
      isTree={isTree}
      isTreeData={isTreeData}
      draggable={draggable}
      multiple={multiple}
      openKeys={openKeys}
      onOpenKeysChange={setOpenKeys}
      hideHeader
      onCellStyle={() => ({
        paddingTop: 2,
        paddingBottom: 2,
      })}
      readMode
      virtual={virtual}
      checkStrictly={checkStrictly}
      border={'none'}
      checkboxPlacement='cell'
      selects={value}
      fieldNames={_fieldNames}
      defaultExpandLevel={defaultExpandLevel}
      showEmptyParentNode={showEmptyParentNode}
      enabledCheckboxRow={enabledCheckboxRow}
      toggleMode={toggleMode}
      cellMaxHeight={itemMaxHeight}
      columns={[
        {
          id: 'name',
          width: 0,
          onRender: (e) => {
            const { node, createControl, isHover } = e
            return (
              <div
                className={cn(
                  'flex w-full items-center',
                  isDisabledItem(node) &&
                    'text-muted-foreground cursor-not-allowed'
                )}
              >
                <div className='flex-1'>
                  {typeof onItemRender === 'function'
                    ? onItemRender(e)
                    : createControl()}
                </div>
                {rowToolbar && (
                  <Toolbar
                    className={cn(
                      'text-secondary-foreground invisible absolute right-0',
                      isHover && 'visible'
                    )}
                    inlineMode
                    right={transformToolbarItems(rowToolbar(node)!)}
                  />
                )}
              </div>
            )
          },
        },
      ]}
      value={items}
      onChange={onItemsChange}
      onSelectsChange={setValue}
      onCellClick={(cell) => {
        if (isDisabledItem(cell.node)) {
          return
        }

        if (!multiple) {
          setValue([cell.node.id])
        }
        onNodeClick?.(cell.node)
      }}
      onDisabledCheck={onDisabledItem}
      onIconRender={onIconRender}
      onDrag={onDrag}
      canDrop={canDrop}
      disabledArrowHover={disabledArrowHover}
      onFetchChildren={onFetchChildren}
      onDisabledDraggable={onDisabledDraggable}
    />
  )

  return (
    <div
      {...mergeTag('tree', props)}
      className={cn('flex flex-col space-y-2', className)}
      style={style}
    >
      {showSearch && (
        <Text
          placeholder={$t('tree.search')}
          value={keyword}
          onChange={(keyword) => {
            setKeyword(keyword)
            ;(ref as any).current?.filter((node: TableNode) => {
              return (
                node.data[nameKey].includes(keyword) &&
                (onFilter ? onFilter(node) : true)
              )
            })
          }}
          {...search}
        />
      )}
      {showToolbar && (
        <Toolbar
          left={
            Array.from({ length: maxExpandLevel }).map((_, index) => ({
              rounded: true,
              className: cn(
                'size-5',
                currentExpandLevel === index + 1 &&
                  'bg-primary! text-primary-foreground!',
                index === 0 && 'ml-1'
              ),
              name: index + 1,
              onClick: () => {
                const level = index + 1
                setCurrentExpandLevel(level)
                ;(ref as any).current.expandLevel(level)
              },
            })) as unknown as ToolbarItem[]
          }
          right={transformToolbarItems(toolbar)}
          inlineMode
        />
      )}

      {fixed ? <div className='flex-1'>{content}</div> : content}
    </div>
  )
}) as <V = any>(props: TreeProps<V>) => ReactNode
