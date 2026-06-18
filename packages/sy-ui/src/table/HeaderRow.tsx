import { HeaderGroupCell } from './HeaderGroupCell'
import { HeaderCell } from './HeaderCell'
import { useTableContext } from './shared'
import { ReactNode, useEffect, useRef } from 'react'
import { useRect } from '@/utils'
import { mergeTag } from '@/utils/tag'

export interface Col {
  id: string
  name?: ReactNode
  level: number
  help?: ReactNode
  firstChildrenColumnId?: string
  isGroup: boolean
  colspan: number
}

export interface HeaderRowProps {
  rowIndex: number
  cols: Col[]
  rowCount: number
  ganttCells?: ReactNode
}

export const HeaderRow = (props: HeaderRowProps) => {
  const { rowIndex, cols, rowCount, ganttCells } = props
  const { getColumn, headerTrHeights, updateHeaderTrHeight } = useTableContext()
  const ref = useRef(null)
  const { height } = useRect(ref, ['height'])
  useEffect(() => {
    if (ref && height) {
      updateHeaderTrHeight(rowIndex, height)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height])
  const top = headerTrHeights.slice(0, rowIndex).reduce((ret, item) => {
    return ret + item
  }, 0)
  // 第一行需要更高的 z-index，确保 rowSpan 跨行的单元格不被后面的行覆盖
  const zIndex = 52 + (rowCount - rowIndex)
  return (
    <tr
      {...mergeTag('table-header-row', props)}
      className='sticky'
      ref={ref}
      style={{
        top,
        zIndex,
      }}
    >
      {cols.map(
        (
          { id, name, level, help, firstChildrenColumnId, isGroup, colspan },
          index
        ) => {
          const rowSpan = rowCount - level
          if (isGroup) {
            return (
              <HeaderGroupCell
                key={id + index}
                colSpan={colspan}
                name={name}
                help={help}
                firstChildrenColumnId={firstChildrenColumnId}
              />
            )
          }
          return (
            <HeaderCell
              key={id}
              isFrist={index === 0}
              column={getColumn(id)}
              rowSpan={rowSpan}
            />
          )
        }
      )}
      {/* 甘特图列 */}
      {ganttCells}
    </tr>
  )
}
