import { Toolbar } from '@/toolbar'
import { hasOwnProperty, useRect, useUnmount } from '@/utils'
import { useEffect, useRef } from 'react'
import { TableNode, useTableContext } from './shared'
import { mergeTag } from '@/utils/tag'
export interface RowToolbarProps {
  node: TableNode
}

export const RowToolbar = (props: RowToolbarProps) => {
  const { node } = props
  const { rowToolbarWidthMap, rowToolbar, setRowToolbarWidthMap } =
    useTableContext()
  const items = rowToolbar!(node)
  const ref = useRef(null)
  const { width } = useRect(ref, ['width'])
  const id = node.id
  useEffect(() => {
    if (!width) {
      return
    }
    const _width = Math.floor(width)
    if (_width !== rowToolbarWidthMap[id]) {
      setRowToolbarWidthMap((rowToolbarWidthMap) => ({
        ...rowToolbarWidthMap,
        [id]: _width,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])
  useUnmount(() => {
    if (hasOwnProperty(rowToolbarWidthMap, id)) {
      setRowToolbarWidthMap((rowToolbarWidthMap) => {
        delete rowToolbarWidthMap[id]
        return { ...rowToolbarWidthMap }
      })
    }
  })
  return (
    <div
      {...mergeTag('table-row-toolbar', props)}
      className='flex w-full justify-end'
    >
      <Toolbar ref={ref} inlineMode right={items} />
    </div>
  )
}
