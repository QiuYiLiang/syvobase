import { ROW_TOOLBAR_ID, useTableContext } from './shared'
import { useContext } from 'react'
import { GanttContext } from './GanttColumns'

export const ColGroup = () => {
  const {
    columns,
    cellPadding,
    currentTableData,
    rowToolbarWidthMap,
    columnWidthConfigMap,
    ganttMode,
  } = useTableContext()

  // 甘特图 context（可选）
  const ganttContext = useContext(GanttContext)

  return (
    <colgroup>
      {columns.map(({ id }) => {
        let styleWidth: number = columnWidthConfigMap[id]
        if (id === ROW_TOOLBAR_ID) {
          styleWidth =
            currentTableData.length > 0
              ? ((Object.values(rowToolbarWidthMap)
                  .toSorted((a, b) => a - b)
                  .pop() as number) ?? 0) +
                cellPadding.left +
                cellPadding.right
              : 15

          if (styleWidth < 15) {
            styleWidth = 15
          }
        }
        return (
          <col
            key={id}
            style={{
              width: styleWidth,
            }}
          />
        )
      })}
      {/* 甘特图列 */}
      {ganttMode &&
        ganttContext &&
        ganttContext.ganttColumns.map((_, index) => (
          <col
            key={`gantt-${index}`}
            style={{ width: ganttContext.columnWidth }}
          />
        ))}
    </colgroup>
  )
}
