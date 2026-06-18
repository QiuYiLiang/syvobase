import { cn } from '@/utils'
import {
  ColumnType,
  FilterCondition,
  ROW_TOOLBAR_ID,
  useFixed,
  useTableContext,
} from './shared'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/button'
import { Toolbar, ToolbarItem } from '@/toolbar'
import { CellSpacing } from './CellSpacing'
import { Checkbox } from '@/checkbox'
import { mergeTag } from '@/utils/tag'

export interface HeaderCell {
  column: ColumnType
  isFrist: boolean
  rowSpan: number
}

export const HeaderCell = (props: HeaderCell) => {
  const {
    isFrist,
    column: {
      id,
      name,
      align = 'left',
      fixed,
      help,
      enabledSort = false,
      control: { required: _required, rules = [] } = {},
      onFilterRender,
    },
    rowSpan,
  } = props
  const {
    selectAll,
    draggable,
    multiple,
    cellPadding,
    filterConditions,
    resize,
    selectsMap,
    currentTableData,
    tableDataMap,
    borderClassName,
    maxExpandLevel,
    showExpandLevel,
    currentExpandLevel,
    fieldNames,
    expandLevel,
    setFilterConditions,
    resizeColumnWidth,
    setSelects,
    columnWidthConfigMap,
    onDisabledCheck,
  } = useTableContext()
  const ref = useRef(null)

  const required = _required || rules.some(({ required }) => required)

  const { fixedClassName, fixedStyle } = useFixed({
    ref,
    columnId: id,
    updateWidth: true,
  })

  const isRowToolbar = id === ROW_TOOLBAR_ID

  const handleCellClick = () => {
    if (isRowToolbar || !enabledSort) {
      return
    }

    setFilterCondition({
      sort: sort === 'asc' ? 'desc' : 'asc',
    })
  }

  const getFilterCondition = () => {
    return (
      filterConditions[id] ?? {
        sort: 'desc',
      }
    )
  }

  const filterCondition = getFilterCondition()

  const sort = filterCondition.sort

  const filterValue = filterCondition.filter

  const hasFilterValue = Object.prototype.hasOwnProperty.call(
    filterCondition,
    'filter'
  )

  const setFilterCondition = (filterCondition: FilterCondition) => {
    setFilterConditions((filterConditions) => {
      const oldFilterCondition = filterConditions[id]
      if (oldFilterCondition) {
        filterConditions[id] = {}
      }

      filterConditions[id] = {
        ...oldFilterCondition,
        ...filterCondition,
      }
      return { ...filterConditions }
    })
  }

  const setFilterValue = (value: any) => {
    setFilterCondition({
      filter: value,
    })
  }

  const handleFilterReset = () => {
    setFilterConditions((filterConditions) => {
      const filterCondition = filterConditions[id] ?? {}
      delete filterCondition.filter
      filterConditions[id] = { ...filterCondition }
      return { ...filterConditions }
    })
  }

  const [clientX, setClientX] = useState(0)
  const [isResizing, setIsResizing] = useState(false)

  const handleStartResize = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setClientX(e.clientX)
    setIsResizing(true)
    document.body.style.userSelect = 'none'
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleStopResize = (e) => {
    e.stopPropagation()
    setIsResizing(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = (e) => {
    e.stopPropagation()
    if (!isResizing) {
      return
    }
    const offset = e.clientX - clientX
    setClientX(e.clientX)
    resizeColumnWidth(id, offset)
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleStopResize)
    document.addEventListener('mousemove', handleResize)
    return () => {
      document.removeEventListener('mouseup', handleStopResize)
      document.removeEventListener('mousemove', handleResize)
    }
  }, [handleStopResize, handleResize])

  const { disabledKey } = fieldNames

  const isRowDisabled = (node: (typeof currentTableData)[number]) =>
    node.data[disabledKey!] ||
    (typeof onDisabledCheck === 'function' ? onDisabledCheck(node) : false)

  const checkableData = currentTableData.filter((node) => !isRowDisabled(node))

  const selected =
    checkableData.length > 0 && !checkableData.find(({ id }) => !selectsMap[id])
  const indeterminate =
    !selected && !!checkableData.find(({ id }) => selectsMap[id])

  const configWidth = columnWidthConfigMap[id]
  const widthStyle = configWidth ? `${configWidth}px` : undefined

  return (
    <th
      {...mergeTag('table-header-cell', props)}
      className={cn(
        'bg-secondary relative cursor-pointer p-0 font-semibold',
        borderClassName,
        fixed === 'left' && 'z-52',
        fixed === 'right' && 'z-51',
        fixedClassName
      )}
      colSpan={1}
      rowSpan={rowSpan}
      ref={ref}
      style={{
        ...fixedStyle,
        width: widthStyle,
        minWidth: widthStyle,
        maxWidth: widthStyle,
      }}
      onClick={handleCellClick}
    >
      {resize && !isRowToolbar && (
        <div
          className={cn(
            'absolute top-0 right-0 z-50 h-full w-[4px] cursor-col-resize bg-none',
            'hover:bg-foreground',
            isResizing && 'bg-foreground'
          )}
          onMouseDown={handleStartResize}
        ></div>
      )}
      <div className='flex overflow-auto'>
        {isFrist && draggable && <CellSpacing />}
        {isFrist && selectAll && multiple && (
          <CellSpacing>
            <Checkbox
              value={checkableData.length > 0 && selected}
              indeterminate={indeterminate}
              onChange={(value) => {
                if (value) {
                  const checkableIds = Object.keys(tableDataMap).filter(
                    (id) => !isRowDisabled(tableDataMap[id])
                  )
                  setSelects(checkableIds)
                } else {
                  setSelects([])
                }
              }}
            />
          </CellSpacing>
        )}
        <div
          className='flex flex-1'
          style={{
            paddingTop: cellPadding.top,
            paddingRight: cellPadding.right,
            paddingBottom: cellPadding.bottom,
            paddingLeft: cellPadding.left,
          }}
        >
          <div
            className={cn(
              'flex flex-1',
              {
                left: 'justify-start',
                center: 'justify-center',
                right: 'justify-end',
              }[align as string]
            )}
          >
            {name}
            {help && (
              <Button
                className='bg-transparent!'
                popover={help}
                type='ghost'
                size='sm'
                icon='BadgeQuestionMark'
                onlyIcon
              />
            )}
            {required && <div className='text-red-600'>*</div>}
          </div>
          {id !== ROW_TOOLBAR_ID && (
            <Toolbar
              inlineMode
              right={[
                ...(isFrist && showExpandLevel
                  ? [
                      {
                        type: 'ghost',
                        size: 'sm',
                        icon: 'ChevronsUpDown',
                        onlyIcon: true,
                        popover: (
                          <Toolbar
                            inlineMode
                            items={
                              Array.from({
                                length: maxExpandLevel as number,
                              }).map((_, index) => ({
                                rounded: true,
                                className: cn(
                                  'size-5',
                                  currentExpandLevel === index + 1 &&
                                    'bg-primary! text-primary-foreground!',
                                  index === 0 && 'ml-1'
                                ),
                                name: index + 1,
                                onClick: () => {
                                  expandLevel(index + 1)
                                },
                              })) as unknown as ToolbarItem[]
                            }
                          />
                        ),
                      } as ToolbarItem,
                    ]
                  : []),
                ...(enabledSort
                  ? [
                      {
                        type: 'ghost',
                        size: 'sm',
                        icon: sort === 'asc' ? 'ArrowUp' : 'ArrowDown',
                        onlyIcon: true,
                        onClick: () => {
                          setFilterCondition({
                            sort: sort === 'asc' ? 'desc' : 'asc',
                          })
                        },
                      } as ToolbarItem,
                    ]
                  : []),
                ...(typeof onFilterRender === 'function'
                  ? [
                      {
                        className: cn(hasFilterValue && 'text-primary!'),
                        trigger: 'click',
                        popover: (
                          <>
                            {onFilterRender({
                              value: filterValue,
                              setValue: setFilterValue,
                              clear: handleFilterReset,
                            })}
                          </>
                        ),
                        onClick: (e) => {
                          e.stopPropagation()
                        },
                        type: 'ghost',
                        size: 'sm',
                        icon: 'ListFilter',
                        onlyIcon: true,
                      } as ToolbarItem,
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      </div>
    </th>
  )
}
