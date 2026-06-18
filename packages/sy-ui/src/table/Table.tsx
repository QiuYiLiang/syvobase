import {
  arrayToTree,
  Dict,
  has,
  hasOwnProperty,
  keysToMap,
  keyBy,
  set,
} from '@syvobase/utils'
import {
  ReactNode,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { Body } from './Body'
import { Header } from './Header'
import { useControllable, cn, ValidatorModel } from '@/utils'
import { $t } from '@/utils/i18n'
import { Button } from '@/button'
import { ColGroup } from './ColGroup'
import { RowToolbar } from './RowToolbar'
import {
  ColumnType,
  DragTo,
  GanttViewMode,
  ROW_TOOLBAR_ID,
  TableContext,
  TableContextType,
  TableModel,
  TableNode,
  TableProps,
} from './shared'
import { Loading } from '@/loading'
import { Footer } from './Footer'
import { v4 } from 'uuid'
import { Validation, ValidationModel } from '@/validation'
import { CellProps } from './Cell'
import { Empty } from '@/empty'
import { Data } from '@/data'
import { TableContent } from './TableContent'
import {
  GanttContext,
  useGanttConfig,
  GanttViewModeSwitcher,
} from './GanttColumns'
import './Table.css'
import { mergeTag } from '@/utils/tag'

export const Table = (props: TableProps) => {
  const tableKey = useId()
  const {
    ref,
    className,
    style,
    readMode = true,
    disabled = false,
    border = 'row',
    columns: _rawColumns,
    isTree: _isTree = false,
    isTreeData = false,
    group = [],
    hover = true,
    hideHeader = false,
    loading = false,
    cellMaxHeight = 80,
    selectAll = true,
    editMode = 'row',
    defaultExpandLevel = 1,
    cellPadding = {
      top: 4,
      right: 8,
      bottom: 4,
      left: 8,
    },
    filter: filterProps,
    toolbar = [],
    pagination: paginationProps,
    checkboxPlacement = 'row',
    multiple = false,
    draggable = false,
    levelWidth = 24,
    resize = true,
    virtual = {
      vertical: true,
      horizontal: true,
    },
    maxExpandLevel = 4,
    showEmptyParentNode = true,
    disabledArrowHover = false,
    fieldNames: _fieldNames = {},
    orderStep = 1000,
    enabledCheckboxRow = false,
    toggleMode = 'arrow',
    ganttMode,
    changes = [],
    checkStrictly = false,
    rowToolbar,
    onRefresh,
    onCellStyle,
    onDrag,
    onFetchChildren,
    onColumnWidthsChange,
    canDrop = ({ toNode, dragTo }) => {
      if (dragTo.position === 'children' && toNode.isLeaf) {
        return false
      }
      return true
    },
    onDisabledDraggable,
  } = props

  const {
    idKey = 'id',
    nameKey = 'name',
    parentIdKey = 'parentId',
    orderKey = 'order',
    isLeafKey = 'isLeaf',
    disabledKey = 'disabled',
    startDateKey = 'startDate',
    endDateKey = 'endDate',
    percentageKey = 'percentage',
  } = _fieldNames

  const [value, setValue] = useControllable<TableProps, 'value'>({
    props,
    value: [],
  })

  const [filterConditions, setFilterConditions] = useControllable<
    TableProps,
    'filterConditions'
  >({
    props,
    value: {},
    valueKey: 'filterConditions',
    onChangeKey: 'onFilterConditionsChange',
  })
  const [openKeys, _setOpenKeys] = useControllable<TableProps, 'openKeys'>({
    props,
    value: [],
    valueKey: 'openKeys',
    onChangeKey: 'onOpenKeysChange',
    defaultValueKey: 'defaultOpenKeys',
  })

  const [selects, setSelects] = useControllable<TableProps, 'selects'>({
    props,
    value: [],
    valueKey: 'selects',
    onChangeKey: 'onSelectsChange',
  })
  const [editCell, setEditCell] = useControllable<TableProps, 'editCell'>({
    props,
    value: null,
    valueKey: 'editCell',
    onChangeKey: 'onEditCellChange',
  })
  const [rowToolbarWidthMap, setRowToolbarWidthMap] = useState<Dict<number>>({})
  const [firstOpenEnd, setFirstOpenEnd] = useState(false)

  const scrollRef = useRef(null)

  const changesMap = keyBy(changes, idKey)

  const isCellChanged = (rowId: string, columnId: string): boolean => {
    return has(changesMap[rowId], columnId)
  }

  const setOpenKeys = (value: string[]) => {
    if (openKeys.length === 0 && value.length === 0) {
      return
    }
    _setOpenKeys(value)
  }

  const fieldNames = {
    idKey,
    nameKey,
    parentIdKey,
    orderKey,
    isLeafKey,
    disabledKey,
    startDateKey,
    endDateKey,
    percentageKey,
  }

  const rawColumns = (() => {
    const rawColumns: TableProps['columns'] = [..._rawColumns]
    if (typeof rowToolbar === 'function') {
      rawColumns.push({
        id: ROW_TOOLBAR_ID,
        width: 1,
        name: (
          <div className='flex items-center space-x-1'>
            <div>{$t('table.action')}</div>
            {typeof onRefresh === 'function' && (
              <Button
                type='ghost'
                size='sm'
                icon='RotateCw'
                onlyIcon
                onClick={onRefresh}
              />
            )}
          </div>
        ),
        align: 'right',
        fixed: 'right',
        onRender: ({ node }: CellProps) => <RowToolbar node={node} />,
      })
    }
    return rawColumns
  })()

  const { columns, columnsMap } = (() => {
    const columns: ColumnType[] = []
    const columnsMap: Dict<ColumnType> = {}
    const loop = (tree: any) => {
      tree.forEach((column: ColumnType) => {
        const { children } = column
        if (Array.isArray(children)) {
          loop(children)
        } else {
          const control = column.control ?? {}
          const newControl = { ...control }
          newControl.disabled ??= disabled

          const _column = {
            ...column,
            control: newControl,
            // 甘特图模式下，所有列都固定在左边
            fixed: ganttMode ? ('left' as const) : column.fixed,
          }
          columnsMap[_column.id] = _column
          if (!hasOwnProperty(column, 'visible') || column.visible) {
            columns.push(_column)
          }
        }
      })
    }
    loop(rawColumns)
    return { columns, columnsMap }
  })()

  const selectsMap = keysToMap(selects)
  const openKeysMap = keysToMap(openKeys)
  const validationRef = useRef<ValidationModel>(null)

  const hasFooter = columns.find(
    ({ onFooterRender }) => typeof onFooterRender === 'function'
  )

  const getPrevFixedColumnIdMap = (fixed: 'left' | 'right') => {
    const prevFixedColumnIdMap = {}
    const fixedColumns = columns.filter((column) => column.fixed === fixed)
    if (fixed === 'right') {
      fixedColumns.reverse()
    }
    fixedColumns.forEach(({ id }, index) => {
      if (index === 0) {
        prevFixedColumnIdMap[id] = null
      } else {
        prevFixedColumnIdMap[id] = fixedColumns[index - 1].id
      }
    })
    return prevFixedColumnIdMap
  }

  const leftPrevFixedColumnIdMap = getPrevFixedColumnIdMap('left')
  const rightPrevFixedColumnIdMap = getPrevFixedColumnIdMap('right')

  const lastLeftFixedColumnId = columns
    .toReversed()
    .find(({ fixed }) => fixed === 'left')?.id

  const firstRightFixedColumnId = columns.find(
    ({ fixed }) => fixed === 'right'
  )?.id

  const [columnWidthMap, setColumnWidthMap] = useState<Dict<number>>({})
  const [headerTrHeights, setHeaderTrHeights] = useState<number[]>([])
  const [dragTo, setDragTo] = useState<DragTo | null>(null)

  const updateColumnWidth = (columnId: string, width: number) => {
    const _width = Math.floor(width)
    if (columnWidthMap[columnId] === _width) {
      return
    }
    setColumnWidthMap((columnWidthMap) => ({
      ...columnWidthMap,
      [columnId]: _width,
    }))
  }
  const updateHeaderTrHeight = (index: number, height: number) => {
    const _height = Math.floor(height)
    setHeaderTrHeights((headerTrHeights) => {
      headerTrHeights[index] = _height
      return [...headerTrHeights]
    })
  }

  const isGroup = group.length > 0
  const isTree = _isTree && !isGroup

  const { nodes, nodesMap } = (() => {
    let data: Dict[] = value
      .filter((item) => !!item[idKey])
      .sort((data, data2) => data[orderKey] - data2[orderKey])
    if (isGroup) {
      function groupBy(array: Dict[], props: string[]) {
        return array.reduce((result, obj) => {
          let currentGroup = result
          props.forEach((prop, index) => {
            const value = obj[prop]
            let subGroup = currentGroup.find(
              (group: Dict) => group.__groupValue__ === value
            )

            if (!subGroup) {
              subGroup = {
                [prop]: value,
                [idKey]: `__group_${props
                  .slice(0, index + 1)
                  .map((key) => obj[key])
                  .join('_')}__`.replaceAll('"', ''),
                __groupValue__: value,
                children: [],
              }
              currentGroup.push(subGroup)
            }
            currentGroup = subGroup.children
            if (index === props.length - 1) {
              subGroup.children = subGroup.children || []
              subGroup.children.push(obj)
            }
          })
          return result
        }, []) as Dict[]
      }
      data = groupBy(data, group)
    } else if (isTree) {
      data = isTreeData
        ? data
        : arrayToTree(data, { idKey, parentIdKey, orderKey })
    }

    let nodes: TableNode[] = []
    const nodesMap: Dict<TableNode> = {}
    const hasLeafParentIdsMap: Dict = {}

    const pushNodes = (tree: Dict[], paths: string[]) => {
      tree.forEach((item: Dict) => {
        const newPaths = [...paths, item[idKey]]
        const hasChildren = Array.isArray(item.children)
        const isLeaf = isGroup
          ? !hasChildren
          : typeof item[isLeafKey] !== 'undefined' && item[isLeafKey] !== null
            ? item[isLeafKey] === '0'
              ? false
              : !!item[isLeafKey]
            : !hasChildren
        const id = item[idKey]
        const node: TableNode = {
          id,
          paths: newPaths,
          level: newPaths.length,
          isLeaf,
          data: item,
        }
        nodesMap[id] = node
        nodes.push(node)
        if (!showEmptyParentNode && isLeaf) {
          paths.forEach((path) => {
            hasLeafParentIdsMap[path] = true
          })
        }
        if (!isLeaf && !Array.isArray(item.children)) {
          item.children = []
        }
        if (!isLeaf) {
          pushNodes(item.children, newPaths)
        }
      })
    }
    pushNodes(data, [])
    nodes.forEach((node) => {
      node.parent = nodesMap[node.paths[node.paths.length - 2]] ?? null
      if (node.isLeaf) {
        return
      }
      node.children = node.data.children.map(
        (item: Dict) => nodesMap[item[idKey]]
      )
      if (isGroup && !node.isLeaf) {
        const columnId = group[node.level - 1]
        node.group = {
          columnId,
          value: node.data[columnId],
        }
      }
    })
    if (!showEmptyParentNode) {
      const _nodeMap = {}
      nodes = nodes.filter((node) => {
        const flag = node.isLeaf ? true : hasLeafParentIdsMap[node.id]
        if (flag) {
          _nodeMap[node.id] = node
        }
        return flag
      })
      return {
        nodes,
        nodesMap: _nodeMap,
      }
    }

    return {
      nodes,
      nodesMap,
    }
  })()

  const valueMap = keyBy(value, idKey)

  const [columnWidthConfigMap, setColumnWidthConfigMap] = useState<
    Dict<number>
  >(() =>
    columns.reduce((ret, column) => {
      if (column.id !== ROW_TOOLBAR_ID) {
        ret[column.id] = column.width ?? 100
      }
      return ret
    }, {})
  )

  const resizeColumnWidth = (columnId: string, width: number) => {
    setColumnWidthConfigMap((columnWidthConfigMap) => {
      const columnWidthConfig = columnWidthConfigMap[columnId]
      let newWidth =
        (typeof columnWidthConfig === 'number' ? columnWidthConfig : 120) +
        width
      if (newWidth < 50) {
        newWidth = 50
      }
      if (columnWidthConfig === newWidth) {
        return columnWidthConfigMap
      }
      const newColumnWidthConfigMap = {
        ...columnWidthConfigMap,
        [columnId]: newWidth,
      }
      onColumnWidthsChange?.(newColumnWidthConfigMap)
      return newColumnWidthConfigMap
    })
  }

  const [currentIdsMap, setCurrentIdsMap] = useState<Dict | null>(null)

  const currentTableData = nodes.filter((node) => {
    const { paths, id } = node
    return (
      !paths.slice(0, -1).find((id: string) => !openKeysMap[id]) &&
      (currentIdsMap ? currentIdsMap[id] : true)
    )
  })

  const isEmpty = currentTableData.length === 0

  const getIsOpen = (id: string) => {
    return openKeysMap[id]
  }

  const setNodeOpen = (id: string, open: boolean) => {
    setFirstOpenEnd(true)
    const newOpenKeysMap = { ...openKeysMap }
    if (open) {
      newOpenKeysMap[id] = true
    } else {
      delete newOpenKeysMap[id]
    }
    setOpenKeys(Object.keys(newOpenKeysMap))
  }

  const topNodes = nodes.filter(({ parent }) => !parent)

  const moveTo = async (id: string) => {
    if (!dragTo) {
      return
    }
    const { position, id: toId } = dragTo
    if (id === toId) {
      return
    }
    const node = getNode(id)
    const toNode = getNode(toId)
    let parentNode: TableNode | undefined
    let nextNode: TableNode | undefined
    let prevNode: TableNode | undefined

    if (position === 'children') {
      parentNode = toNode
      nextNode = parentNode?.children?.[0]
    } else {
      parentNode = toNode.parent
      const parentChildren = parentNode?.children ?? topNodes
      const toIndex = parentChildren.findIndex(({ id }) => id === toId)

      if (position === 'before') {
        const prevIndex = toIndex - 1
        prevNode = parentChildren[prevIndex]
        nextNode = toNode
      } else {
        const nextIndex = toIndex + 1
        nextNode = parentChildren[nextIndex]
        prevNode = toNode
      }
    }

    let order = 0
    if (typeof node.data[orderKey] !== 'number') {
      return
    }
    if (nextNode && prevNode) {
      order = (prevNode.data[orderKey] + nextNode.data[orderKey]) / 2
    } else if (!prevNode && nextNode) {
      order = nextNode.data[orderKey] - orderStep
    } else if (prevNode && !nextNode) {
      order = prevNode.data[orderKey] + orderStep
    }
    updateRow(node.id, {
      [parentIdKey]: parentNode?.id,
      [orderKey]: order,
    })
    if (typeof onDrag === 'function') {
      await onDrag({
        node,
        parentNode,
        nextNode,
        prevNode,
        order,
      })
    }
  }

  const getNode = (id: string) => {
    return nodesMap[id]
  }

  const getColumn = (id: string) => {
    return columnsMap[id]
  }

  const updateRow = (id: string, row: Dict) => {
    if (id) {
      for (const key in row) {
        set(valueMap[id], key, row[key])
      }
      setValue((value) => {
        return value.toSorted((a, b) => a[orderKey] - b[orderKey])
      })
      return
    }
  }

  const filter: TableModel['filter'] = (filterCallback, open) => {
    if (!filterCallback) {
      setCurrentIdsMap(null)
      return
    }
    const currentIdsMap: Dict<boolean> = {}
    const openIdsMap: Dict<boolean> = {}

    nodes.forEach((node) => {
      if (filterCallback(node)) {
        node.paths.forEach((id) => {
          if (!getNode(id).isLeaf) {
            openIdsMap[id] = true
          }
          currentIdsMap[id] = true
        })
      }
    })

    if (open) {
      setOpenKeys(Object.keys(openIdsMap))
    }
    setCurrentIdsMap(currentIdsMap)
  }

  const borderClassName = (() => {
    if (border === 'cell') {
      return 'border-e border-b border-border'
    }
    if (border === 'row') {
      return 'border-b border-border'
    }
    return ''
  })()

  const showExpandLevel =
    maxExpandLevel > 1 &&
    (isGroup || (isTree && !(typeof onFetchChildren === 'function')))

  const [currentExpandLevel, setCurrentExpandLevel] = useState<number>(
    defaultExpandLevel ?? 1
  )

  const expandLevel = (level: number) => {
    if (!showExpandLevel) {
      return
    }
    setCurrentExpandLevel(level)
    const openKeys: string[] = []
    nodes.filter((node) => {
      if (node.level < level && !node.isLeaf) {
        openKeys.push(node.id)
      }
    })
    setOpenKeys(openKeys)
  }

  useEffect(() => {
    if (!firstOpenEnd && value.length > 0 && defaultExpandLevel > 1) {
      expandLevel(defaultExpandLevel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExpandLevel, firstOpenEnd, value])

  const tableContext: TableContextType = {
    ...props,
    editMode,
    tableKey,
    borderClassName,
    columns,
    rawColumns,
    isTree,
    group,
    isGroup,
    hideHeader,
    levelWidth,
    checkboxPlacement,
    cellPadding,
    hover,
    tableData: nodes,
    currentTableData,
    tableDataMap: nodesMap,
    draggable,
    dragTo,
    multiple,
    fieldNames,
    readMode,
    selects,
    selectsMap,
    cellMaxHeight,
    columnWidthMap,
    headerTrHeights,
    filterConditions,
    leftPrevFixedColumnIdMap,
    rightPrevFixedColumnIdMap,
    columnWidthConfigMap,
    resize,
    lastLeftFixedColumnId,
    firstRightFixedColumnId,
    selectAll,
    scrollRef,
    rowToolbarWidthMap,
    virtual: {
      vertical: virtual.vertical ?? true,
      horizontal: virtual.horizontal ?? true,
    },
    checkStrictly,
    editCell,
    maxExpandLevel,
    showExpandLevel,
    currentExpandLevel,
    disabledArrowHover,
    enabledCheckboxRow,
    toggleMode,
    ganttMode,
    canDrop,
    isCellChanged,
    expandLevel,
    setEditCell,
    updateHeaderTrHeight,
    setSelects,
    setValue,
    updateRow,
    setDragTo,
    getIsOpen,
    setNodeOpen,
    moveTo,
    getNode,
    getColumn,
    updateColumnWidth,
    setRowToolbarWidthMap,
    onCellStyle,
    setFilterConditions,
    resizeColumnWidth,
    onDisabledDraggable,
  }

  useImperativeHandle(ref, () => ({
    validation: async (options) => {
      if (!(await validationRef.current!.validation(options))) {
        return false
      }

      const validatorModelInfos = columns.reduce(
        (ret, { id, control: { required, rules } = {} }) => {
          if (Array.isArray(rules)) {
            ret[id] = {
              columnId: id,
              validatorModel: new ValidatorModel({
                rules: required ? [...rules, { required: true }] : rules,
                emptyMessage: $t('validation.notEmpty'),
              }),
            }
          }
          return ret
        },
        []
      ) as { columnId: string; validatorModel: ValidatorModel }[]

      for (const node of nodes) {
        if (node.group) {
          continue
        }
        for (const { columnId, validatorModel } of validatorModelInfos) {
          try {
            await validatorModel.validation({
              value: node.data[columnId],
            })
          } catch (error) {
            console.warn((error as any).message)
            return false
          }
        }
      }
      return true
    },
    filter,
    addRow(
      row: Dict = {},
      options: {
        position?: 'first' | 'last'
      } = {}
    ) {
      if (!row[idKey]) {
        row[idKey] = v4()
      }
      const { position = 'first' } = options
      setValue((value) => {
        const parentNode = getNode(row[parentIdKey])
        const parentChildren = parentNode?.children ?? topNodes

        let order = 0
        if (!parentChildren) {
          order = 0
        } else if (position === 'first') {
          order = parentChildren[0][orderKey]
        } else {
          order = parentChildren[parentChildren.length - 1][orderKey]
        }
        row[orderKey] = order

        return position === 'first' ? [row, ...value] : [...value, row]
      })
      setEditCell({
        rowId: row[idKey],
        columnId: columns[0].id,
      })
    },
    expandLevel,
  }))
  return (
    <Validation ref={validationRef}>
      <TableContext value={tableContext}>
        <Data
          {...mergeTag('table', props)}
          className={cn(className)}
          style={style}
          filter={filterProps}
          toolbar={toolbar}
          pagination={paginationProps}
        >
          <GanttContextWrapper ganttMode={ganttMode}>
            <TableContent>
              <div
                ref={scrollRef}
                className={cn(
                  'relative flex w-full flex-1 flex-col overflow-auto',
                  border !== 'none' && 'border-border rounded-lg border'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 甘特图视图切换按钮 - 固定在右上角 */}
                {ganttMode && (
                  <div className='sticky top-0 left-0 z-100 h-0 w-full'>
                    <GanttViewModeSwitcher />
                  </div>
                )}
                <table
                  className={cn(
                    'nk-table border-border relative table-fixed border-separate border-spacing-0',
                    !ganttMode && 'w-full',
                    hasFooter && '[&>tbody>tr:last-child>td]:border-b-0'
                  )}
                >
                  <ColGroup />
                  {!hideHeader && <Header />}
                  {!isEmpty && (
                    <>
                      <Body />
                      {hasFooter && <Footer />}
                    </>
                  )}
                  {loading && <Loading className='absolute' type='mask' />}
                </table>
                {isEmpty && <Empty className={cn('min-h-20 flex-1')}></Empty>}
              </div>
            </TableContent>
          </GanttContextWrapper>
        </Data>
      </TableContext>
    </Validation>
  )
}

// 甘特图 Context 包装器 - 仅在甘特图模式下提供 GanttContext
interface GanttContextWrapperProps {
  ganttMode: GanttViewMode | undefined
  children: ReactNode
}

// 内部组件，确保只有开启甘特图时才调用 useGanttConfig (包含无限滚动逻辑)
const GanttContextProvider = ({ children }: { children: ReactNode }) => {
  const ganttConfig = useGanttConfig()
  return (
    <GanttContext.Provider value={ganttConfig}>
      {children}
    </GanttContext.Provider>
  )
}

const GanttContextWrapper = ({
  ganttMode,
  children,
}: GanttContextWrapperProps) => {
  // 只有开启甘特图时才使用 GanttContextProvider，避免非甘特图模式下启用无限滚动
  if (!ganttMode) {
    return <>{children}</>
  }

  return <GanttContextProvider>{children}</GanttContextProvider>
}

interface TableProviderProps {
  children?: ReactNode
}

export const TableProvider = ({ children }: TableProviderProps) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}
