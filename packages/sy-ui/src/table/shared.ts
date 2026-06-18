import {
  useContext,
  RefObject,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
  CSSProperties,
  RefAttributes,
  Ref,
} from 'react'
import { BaseInputModel, useRect, BaseInputProps, cn,FieldNamesType, OnDisabledItem } from '@/utils'
import { Dict,  } from '@syvobase/utils'
import { ButtonProps } from '@/button'
import { ToolbarItem, ToolbarProps } from '@/toolbar'
import { IconName } from '@/icon'
import { ControlProps } from '@/control'
import { CellProps } from './Cell'
import { PaginationProps } from '@/pagination'
import { FilterProps } from '@/filter'

export interface DragTo {
  id: string
  position: 'before' | 'after' | 'children'
  trRef: Ref<HTMLTableRowElement>
}

export interface TableNode {
  parent?: TableNode
  id: string
  paths: string[]
  level: number
  isLeaf: boolean
  data: Dict
  children?: TableNode[]
  group?: {
    columnId: string
    value: any
  }
}

export interface TableProps
  extends BaseInputProps<Dict[]>, RefAttributes<TableModel> {
  checkboxPlacement?: 'row' | 'cell'
  border?: 'row' | 'cell' | 'none'
  hideHeader?: boolean
  cellPadding?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  columns: (Omit<ColumnType, 'id'> & { id?: string })[]
  openKeys?: string[]
  defaultOpenKeys?: string[]
  multiple?: boolean
  group?: string[]
  levelWidth?: number
  fieldNames?: FieldNamesType
  draggable?: boolean
  hover?: boolean
  isTree?: boolean
  isTreeData?: boolean
  selects?: string[]
  loading?: boolean
  cellMaxHeight?: number
  filterConditions?: FilterConditions
  resize?: boolean
  selectAll?: boolean
  virtual?: {
    vertical?: boolean
    horizontal?: boolean // 暂不支持
  }
  orderStep?: number
  editMode?: 'all' | 'row' | 'cell'
  filter?: FilterProps
  toolbar?: ToolbarProps | ToolbarItem[]
  pagination?: PaginationProps
  maxExpandLevel?: number
  defaultExpandLevel?: number
  showEmptyParentNode?: boolean
  disabledArrowHover?: boolean
  enabledCheckboxRow?: boolean
  toggleMode?: 'row' | 'arrow'
  /** 甘特图视图模式，设置后启用甘特图 */
  ganttMode?: 'day' | 'week' | 'month'
  /** 变更的数据，用于显示变更角标，格式为 [{id: 'xxx', fieldA: 'value'}] */
  changes?: Dict[]
  onRefresh?: ButtonProps['onClick']
  editCell?: EditCell | null
  checkStrictly?: boolean
  onFetchChildren?: (node: TableNode) => Promise<Dict[]> | Dict[]
  rowToolbar?: (node: TableNode) => ToolbarItem[]
  onSelectsChange?: (selects: string[]) => void
  onEditCellChange?: (editCell: EditCell | null) => void
  onOpenKeysChange?: (openKeys: string[]) => void
  onDisabledCheck?: OnDisabledItem
  onIconRender?: (e: {
    node: TableNode
    isOpen: boolean
  }) => ReactNode | IconName
  onCellRender?: (
    cell: CellProps & {
      createControl: () => ReactNode
      isHover: boolean
    }
  ) => ReactNode
  onCellStyle?: (cell: CellProps) => CSSProperties
  onRowClick?: (node: TableNode) => void
  onCellClick?: (cell: CellProps) => void
  onFilterConditionsChange?: (filterConditions: FilterConditions) => void
  onColumnWidthsChange?: (columnWidthConfigMap: Dict<number>) => void
  onDrag?: (e: {
    node: TableNode
    parentNode?: TableNode
    prevNode?: TableNode
    nextNode?: TableNode
    order: number
  }) => Promise<void> | void
  canDrop?: (e: {
    fromNode: TableNode
    toNode: TableNode
    dragTo: DragTo
  }) => Promise<boolean> | boolean
  onDisabledDraggable?: (node: TableNode) => boolean
}

export type GanttViewMode = 'day' | 'week' | 'month'

export interface FilterCondition {
  sort?: 'desc' | 'asc'
  filter?: any
}

export type FilterConditions = Dict<FilterCondition>

export interface ColumnType {
  id: string
  name?: ReactNode
  help?: ReactNode
  width?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  visible?: boolean
  enabledSort?: boolean
  control?: ControlProps & any
  children?: ColumnType[]
  onStyle?: TableProps['onCellStyle']
  onRender?: TableProps['onCellRender']
  onFooterRender?: () => ReactNode
  onClick?: TableProps['onCellClick']
  onFilterRender?: (e: {
    value: any
    setValue: Dispatch<SetStateAction<any>>
    clear: () => void
  }) => ReactNode
}

export interface TableContextType extends TableProps {
  tableKey: string
  hideHeader: boolean
  checkboxPlacement: Exclude<TableProps['checkboxPlacement'], undefined>
  borderClassName: string
  cellPadding: Exclude<TableProps['cellPadding'], undefined>
  tableDataMap: Dict<TableNode>
  currentTableData: TableNode[]
  tableData: TableNode[]
  dragTo: DragTo | null
  selects: string[]
  selectsMap: Dict<boolean>
  draggable: boolean
  multiple: boolean
  levelWidth: number
  fieldNames: FieldNamesType
  hover: boolean
  virtual: {
    vertical: boolean
    horizontal: boolean
  }
  disabledArrowHover: boolean
  columns: ColumnType[]
  cellMaxHeight: number
  columnWidthMap: Dict<number>
  columnWidthConfigMap: Dict<number>
  leftPrevFixedColumnIdMap: Dict<string | null>
  rightPrevFixedColumnIdMap: Dict<string | null>
  filterConditions: FilterConditions
  resize: boolean
  selectAll: boolean
  rawColumns: TableProps['columns']
  group: string[]
  isGroup: boolean
  firstRightFixedColumnId?: string
  lastLeftFixedColumnId?: string
  scrollRef: RefObject<HTMLDivElement | null>
  headerTrHeights: number[]
  rowToolbarWidthMap: Dict<number>
  editCell?: EditCell | null
  showExpandLevel: boolean
  currentExpandLevel: number
  ganttMode: GanttViewMode | undefined
  isCellChanged: (rowId: string, columnId: string) => boolean
  expandLevel: (level: number) => void
  updateHeaderTrHeight: (index: number, height: number) => void
  updateRow: (id: string, row: Dict) => void
  setSelects: Dispatch<SetStateAction<string[]>>
  setValue: Dispatch<SetStateAction<Dict[]>>
  setDragTo: Dispatch<SetStateAction<DragTo | null>>
  getIsOpen: (id: any) => boolean
  setNodeOpen: (id: string, open: boolean) => void
  moveTo: (id: string) => Promise<void>
  getNode: (id: string) => any
  getColumn: (id: string) => ColumnType
  resizeColumnWidth: (columnId: string, offset: number) => void
  updateColumnWidth: (columnId: string, width: number) => void
  setRowToolbarWidthMap: Dispatch<SetStateAction<Dict<number>>>
  onCellStyle: TableProps['onCellStyle']
  setFilterConditions: Dispatch<SetStateAction<FilterConditions>>
  setEditCell: Dispatch<SetStateAction<EditCell | null>>
}

export const TableContext = createContext({} as TableContextType)

// 虚拟列表 Context - 用于虚拟滚动共享
export interface VirtualContextType {
  virtualList: TableNode[]
  paddingTop: number
  paddingBottom: number
  bodyRef: RefObject<HTMLTableSectionElement | null>
}

export const VirtualContext = createContext<VirtualContextType>(
  {} as VirtualContextType
)

export const useVirtualContext = () => useContext(VirtualContext)

export const useFixed = ({
  ref,
  columnId,
  updateWidth = false,
}: {
  ref?: RefObject<HTMLElement | null>
  columnId: string
  updateWidth?: boolean
} & RefAttributes<HTMLElement>) => {
  const { updateColumnWidth } = useTableContext()

  const { width } = useRect(ref, updateWidth ? ['width'] : [])

  useEffect(() => {
    if (updateWidth && width) {
      updateColumnWidth(columnId, width)
    }
  }, [columnId, width, updateColumnWidth, updateWidth])
  return useFixedStyle(columnId)
}

export function useFixedStyle(columnId: string) {
  const {
    getColumn,
    columnWidthMap,
    leftPrevFixedColumnIdMap,
    rightPrevFixedColumnIdMap,
    firstRightFixedColumnId,
    lastLeftFixedColumnId,
  } = useTableContext()

  const column = getColumn(columnId)
  const { fixed } = column ?? {}

  if (!fixed) {
    return {
      fixedClassName: '',
      fixedStyle: {},
    }
  }
  const prevFixedColumnIdMap =
    fixed === 'left' ? leftPrevFixedColumnIdMap : rightPrevFixedColumnIdMap

  let offset = 0

  let prevColumnId = prevFixedColumnIdMap[columnId]

  while (prevColumnId) {
    const prevColumnWidth = columnWidthMap[prevColumnId]
    offset += prevColumnWidth ?? 0
    prevColumnId = prevFixedColumnIdMap[prevColumnId]
  }

  return {
    fixedClassName: cn([
      fixed && 'sticky',
      columnId === lastLeftFixedColumnId && 'nk-table-fixed-left border-r-0',
      columnId === firstRightFixedColumnId && 'nk-table-fixed-right',
    ]),
    fixedStyle: {
      [fixed]: offset,
    },
  }
}

export function useTableContext() {
  return useContext(TableContext)
}

export const ROW_TOOLBAR_ID = '__syvobaseRowToolbar__'

export function getChildrenNodes(node: TableNode) {
  if (node.isLeaf) {
    return []
  } else {
    const childrenNodes: TableNode[] = []
    node.children?.forEach((childrenNode: TableNode) => {
      childrenNodes.push(childrenNode, ...getChildrenNodes(childrenNode))
    })
    return childrenNodes
  }
}

export interface EditCell {
  rowId: string
  columnId?: string
}
export interface TableModel extends BaseInputModel {
  filter: (
    filterCallback?: (node: TableNode) => boolean,
    open?: boolean
  ) => void
  addRow: (
    row: Dict,
    options: {
      position?: 'first' | 'last'
    }
  ) => void
  expandLevel: (level: number) => void
}
