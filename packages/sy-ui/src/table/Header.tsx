import { ColumnType, useTableContext } from './shared'
import { Col, HeaderRow } from './HeaderRow'
import { mergeTag } from '@/utils/tag'
import { Dict } from '@syvobase/utils'
import { GanttMonthHeaderCells, GanttDateHeaderCells } from './GanttColumns'

export const Header = (props: Dict) => {
  const { rawColumns, ganttMode } = useTableContext()
  const headerData = (() => {
    const headerData: Col[][] = []
    let rowCount = 0
    let currentLevelList = rawColumns
    while (currentLevelList) {
      const nextLevelList: ColumnType[] = []
      const currentRowData: Col[] = []
      currentLevelList.forEach((rawColumn) => {
        const { id, name, help, visible = true, children = [] } = rawColumn
        if (!visible) {
          return
        }
        const isGroup = children.length > 0
        const colData: Col = {
          id: id!,
          name,
          help,
          level: rowCount,
          isGroup,
          colspan: isGroup ? children.length : 1,
        }
        if (isGroup) {
          colData.firstChildrenColumnId = children[0].id
        }
        currentRowData.push(colData)
        nextLevelList.push(...children)
      })
      rowCount++
      headerData.push(currentRowData)
      if (nextLevelList.length === 0) {
        break
      }
      currentLevelList = nextLevelList
    }
    return headerData
  })()
  const rowCount = headerData.length

  // 甘特图模式下需要确保表头至少有2行（月份行 + 日期行）
  const ganttRowCount = ganttMode ? Math.max(rowCount, 2) : rowCount

  return (
    <thead {...mergeTag('table-header', props)}>
      {headerData.map((cols, index) => (
        <HeaderRow
          cols={cols}
          key={index}
          rowIndex={index}
          rowCount={ganttRowCount}
          // 甘特图列：第一行显示月份，第二行显示日期
          ganttCells={
            ganttMode ? (
              index === 0 ? (
                <GanttMonthHeaderCells />
              ) : index === rowCount - 1 ? (
                <GanttDateHeaderCells />
              ) : null
            ) : null
          }
        />
      ))}
    </thead>
  )
}
