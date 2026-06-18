import { Icon } from '@/icon'
import { cn, useHover } from '@/utils'
import { Control } from '@/control/Control'
import {
  ColumnType,
  getChildrenNodes,
  ROW_TOOLBAR_ID,
  TableNode,
  useFixed,
  useTableContext,
} from './shared'
import { CellSpacing } from './CellSpacing'
import { Checkbox } from '@/checkbox'
import { RefAttributes, useRef, useState } from 'react'
import { mergeTag } from '@/utils/tag'

export interface CellProps {
  isFrist: boolean
  dragRef: any
  node: TableNode
  columnId: string
  column?: ColumnType
  value: any
  contentRef: RefAttributes<HTMLDivElement>['ref']
}

export const Cell = (props: CellProps) => {
  const { columnId, dragRef, isFrist, contentRef, node, value: _value } = props
  const { level, isLeaf, group } = node
  const {
    multiple,
    cellPadding,
    checkboxPlacement,
    draggable,
    isTree,
    isGroup,
    hover,
    selectsMap,
    cellMaxHeight,
    selects,
    borderClassName,
    readMode: tableReadMode,
    editMode,
    checkStrictly,
    editCell,
    fieldNames,
    disabledArrowHover,
    enabledCheckboxRow,
    toggleMode,
    setValue,
    setEditCell,
    setSelects,
    updateRow,
    getIsOpen,
    setNodeOpen,
    getColumn,
    onIconRender,
    onDisabledCheck,
    onFetchChildren,
    onCellClick,
    onCellRender,
    onCellStyle,
    onDisabledDraggable,
    isCellChanged,
  } = useTableContext()
  const { parentIdKey, disabledKey } = fieldNames
  const isGroupRow = !isLeaf && group
  const isGroupColumn = isGroup && isFrist && isGroupRow
  const value = isGroupColumn ? group.value : _value
  const rowId = node.id
  const column = getColumn(columnId)
  const {
    control: _control = {},
    fixed,
    onRender: _onRender = onCellRender,
    onClick = onCellClick,
    onStyle,
  } = column

  const [loadingChildren, setLoadingChildren] = useState(false)

  const data = {
    ...props,
    column,
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const groupColumn = getColumn(group?.columnId!)

  const control = isGroupColumn ? groupColumn.control : _control

  const { readMode: controlReadMode } = control

  const canEdit = !controlReadMode && !tableReadMode

  const readMode = (() => {
    if (editMode === 'all') {
      return !canEdit
    }
    if (!editCell || editCell.rowId !== rowId) {
      return true
    }
    if (editMode === 'cell') {
      return editCell.columnId && editCell.columnId !== columnId
    }
    return false
  })()

  const onRender = isGroupColumn
    ? (groupColumn.onRender ?? onCellRender)
    : _onRender
  const isOpen = getIsOpen(rowId)
  const placementRow = checkboxPlacement === 'row'
  const selected = !!selectsMap[rowId]

  const { fixedClassName, fixedStyle } = useFixed({ columnId })

  const createSpacing = () => <CellSpacing widthCount={level - 1} />

  const ref = useRef(null)
  const isHover = useHover(ref)
  const warpperRef = useRef<HTMLDivElement>(null)

  const disabledCheck =
    node.data[disabledKey!] ||
    (typeof onDisabledCheck === 'function' ? onDisabledCheck(node) : false)

  const onCheck = (value: boolean) => {
    if (disabledCheck || !multiple) {
      return
    }
    const isCheckChildren = !checkStrictly && isTree
    const changedNodes = [
      node,
      ...(isCheckChildren ? getChildrenNodes(node) : []),
    ]

    const newSelectedKeysMap = { ...selectsMap }
    changedNodes.forEach((node) => {
      const nodeId = node.id
      if (value) {
        newSelectedKeysMap[nodeId] = true
      } else {
        delete newSelectedKeysMap[nodeId]
      }
    })

    const newIndeterminateMap: Record<string, boolean> = {}
    if (value && !node.isLeaf) {
      newIndeterminateMap[node.id] = false
    }

    if (isCheckChildren) {
      let parent = node.parent
      while (parent) {
        const children = parent.children!
        const selectChildrenLength = children.filter(
          (node: TableNode) => !!newSelectedKeysMap[node.id]
        ).length
        const parentNodeId = parent.id
        const childrenLength = children.length

        if (selectChildrenLength !== childrenLength) {
          delete newSelectedKeysMap[parentNodeId]
        } else {
          newSelectedKeysMap[parentNodeId] = true
        }
        newIndeterminateMap[parentNodeId] =
          selectChildrenLength > 0 && selectChildrenLength < childrenLength
        parent = parent.parent
      }
    }

    const newSelectsMap = { ...newSelectedKeysMap }
    const oldSelects = selects.filter((nodeId) => {
      const selectNode = newSelectsMap[nodeId]
      if (selectNode) {
        delete newSelectsMap[nodeId]
      }
      return !!selectNode
    })
    setSelects([...oldSelects, ...Object.keys(newSelectsMap)])
  }

  const createCheckbox = () => {
    const indeterminate = (() => {
      if (checkStrictly) {
        return false
      }
      if (!multiple || isLeaf || !isTree) {
        return false
      }
      const children = node.children
      const childrenLength = children!.length
      const childrenSelectsLength = children!.filter(
        (node: TableNode) => selectsMap[node.id]
      ).length
      return childrenSelectsLength > 0 && childrenSelectsLength < childrenLength
    })()
    return (
      multiple && (
        <CellSpacing>
          <Checkbox
            disabled={disabledCheck}
            value={selected}
            indeterminate={indeterminate}
            onChange={onCheck}
          />
        </CellSpacing>
      )
    )
  }

  const createDragHandle = () =>
    draggable &&
    (onDisabledDraggable ? !onDisabledDraggable(node) : true) && (
      <CellSpacing ref={dragRef} className='cursor-move'>
        <Icon name='GripVertical' />
      </CellSpacing>
    )

  const toggle = async () => {
    if (loadingChildren) {
      return
    }
    const needFetchChildren =
      !isOpen && !isGroup && typeof onFetchChildren === 'function'
    if (needFetchChildren) {
      setLoadingChildren(true)
      const children = await onFetchChildren?.(node)
      if (Array.isArray(children)) {
        setValue((value) => [
          ...value.filter((item) => item[parentIdKey!] !== node.id),
          ...children.map((item) => ({
            ...item,
            [parentIdKey!]: node.id,
          })),
        ])
      }
      setLoadingChildren(false)
    }
    if (!isLeaf) {
      setNodeOpen(rowId, !isOpen)
    }
  }

  const createTreeArrow = () =>
    (isTree || isGroup) && (
      <CellSpacing
        className='cursor-pointer justify-end'
        onClick={async (e) => {
          e.stopPropagation()
          toggle()
        }}
      >
        {!isLeaf && (
          <div
            className={cn(
              !disabledArrowHover &&
                'hover:bg-foreground/10 flex size-5 items-center justify-center rounded'
            )}
          >
            <Icon
              name={
                loadingChildren
                  ? 'LoaderCircle'
                  : isOpen
                    ? 'ChevronDown'
                    : 'ChevronRight'
              }
            />
          </div>
        )}
      </CellSpacing>
    )
  const createIcon = () => {
    const iconName = onIconRender?.({ node, isOpen })
    return (
      iconName && (
        <CellSpacing>
          {typeof iconName === 'string' ? <Icon name={iconName} /> : iconName}
        </CellSpacing>
      )
    )
  }

  const createContent = () => {
    const createControl = () => (
      <Control
        {...control}
        value={value}
        inlineMode
        readMode={readMode}
        canEdit={canEdit}
        rowData={node.data}
        cell={data}
        onChange={(value: any) => {
          updateRow(rowId, { [columnId]: value })
        }}
        onExitEditMode={() => {
          setEditCell(null)
        }}
      />
    )

    return (
      <div
        className={cn('nk-table-cell flex flex-1')}
        ref={(el) => {
          warpperRef.current = el
          if (el) {
            const isText =
              el.childNodes.length === 1 &&
              el.childNodes[0].nodeType === Node.TEXT_NODE
            if (isText) {
              el.style.maxHeight = 'unset'
              el.classList.add('nk-table-text-cell')
              el.style['webkitLineClamp'] = Math.floor(
                (cellMaxHeight - cellPadding.top - cellPadding.bottom) / 24
              ) as any as string
              const isOverflow = el.clientHeight > cellMaxHeight
              if (isOverflow) {
                el.title = el.innerText
              } else {
                el.title = ''
              }
              el.style.maxHeight = `${cellMaxHeight}px`
            } else {
              el.classList.remove('nk-table-text-cell')
            }
          }
          if (isFrist) {
            ;(contentRef as any).current = el
          }
        }}
        style={{
          paddingTop: cellPadding.top,
          paddingRight: cellPadding.right,
          paddingBottom: cellPadding.bottom,
          paddingLeft: cellPadding.left,
          ...(cellMaxHeight === 0
            ? {}
            : {
                maxHeight: cellMaxHeight,
              }),
        }}
      >
        {typeof onRender === 'function'
          ? onRender({ ...data, createControl, isHover })
          : createControl()}
      </div>
    )
  }

  return (
    <td
      {...mergeTag('table-cell', props)}
      ref={ref}
      className={cn(
        'bg-background relative p-0',
        borderClassName,
        placementRow && onClick && 'cursor-pointer',
        fixed === 'left' && 'z-51',
        fixed === 'right' && 'z-50',
        fixedClassName,
        canEdit && 'cursor-pointer'
      )}
      style={{
        ...fixedStyle,
        ...(!isGroupRow && typeof onCellStyle === 'function'
          ? onCellStyle(data)
          : {}),
        ...(!isGroupRow && typeof onStyle === 'function' ? onStyle(data) : {}),
      }}
      onClick={() => {
        if ((!isGroupRow || isGroupColumn) && toggleMode === 'row') {
          toggle()
        }
        if (!isGroupRow && placementRow) {
          onClick?.(data)
        }
        if (canEdit && readMode) {
          setEditCell({
            rowId,
            columnId,
          })
        }
        if (enabledCheckboxRow) {
          onCheck(!selected)
        }
      }}
    >
      {isCellChanged(rowId, columnId) && (
        <div
          className='absolute top-0 right-0 size-0 border-t-4 border-r-4 border-t-yellow-400 border-r-yellow-400'
          style={{
            borderLeft: '4px solid transparent',
            borderBottom: '4px solid transparent',
          }}
        />
      )}
      {(!isGroupRow || isGroupColumn) && (
        <div className='flex items-center'>
          {placementRow ? (
            <>
              {isFrist && (
                <>
                  {createDragHandle()}
                  {createCheckbox()}
                  {createSpacing()}
                  {createTreeArrow()}
                  {createIcon()}
                </>
              )}
              {createContent()}
            </>
          ) : (
            <>
              {isFrist && createSpacing()}
              <div
                className={cn(
                  'flex flex-1 items-center rounded-lg',
                  columnId !== ROW_TOOLBAR_ID && hover && 'hover:bg-secondary',
                  !multiple && selected && 'bg-secondary',
                  !placementRow && onClick && 'cursor-pointer'
                )}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  !placementRow && onClick?.(props)
                }}
              >
                {isFrist && (
                  <>
                    {createDragHandle()}
                    {createTreeArrow()}
                    {createCheckbox()}
                    {createIcon()}
                  </>
                )}
                {createContent()}
              </div>
            </>
          )}
        </div>
      )}
    </td>
  )
}
