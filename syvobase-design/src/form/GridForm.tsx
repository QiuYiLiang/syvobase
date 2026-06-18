import { useContext } from 'react'
import { Cell, CellProps } from './Cell'
import { filterItems, FormContext } from './shared'
import { mergeTag } from '@/utils/tag'

export interface GridFormProps {
  widths: number[]
  items: CellProps[][]
}

export const GridForm = (props: GridFormProps) => {
  const { widths, items } = props
  const { value } = useContext(FormContext)
  return (
    <div {...mergeTag('grid-form', props)}>
      {filterItems({ items, value }).map((item, index) => {
        return (
          <div className='flex' key={(item as any).id ?? index}>
            {filterItems({ items: item, value }).map(
              (subItem: CellProps, index) => {
                let width: any = widths[index]
                if (typeof width === 'number') {
                  width = `${width}%`
                }
                return (
                  <div
                    key={(subItem as any).id ?? index}
                    style={
                      width && {
                        width,
                      }
                    }
                  >
                    <Cell {...subItem} />
                  </div>
                )
              }
            )}
          </div>
        )
      })}
    </div>
  )
}
