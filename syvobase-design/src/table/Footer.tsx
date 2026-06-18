import { useTableContext } from './shared'
import { FooterCell } from './FooterCell'
import { Dict } from '@syvobase/utils'
import { mergeTag } from '@/utils/tag'

export const Footer = (props: Dict) => {
  const { columns } = useTableContext()
  return (
    <tfoot
      {...mergeTag('table-footer', props)}
      className='sticky bottom-0 z-52'
    >
      <tr>
        {columns.map((column) => (
          <FooterCell column={column} key={column.id} />
        ))}
      </tr>
    </tfoot>
  )
}
