import { Row } from './Row'
import { mergeTag } from '@/utils/tag'
import { Dict } from '@syvobase/utils'
import { useVirtualContext } from './shared'

export const Body = (props: Dict) => {
  const { virtualList, paddingTop, paddingBottom, bodyRef } =
    useVirtualContext()

  return (
    <tbody {...mergeTag('table-body', props)} ref={bodyRef}>
      <tr
        style={{
          height: paddingTop,
        }}
      ></tr>
      {virtualList.map((node) => {
        return <Row key={node.id} node={node} />
      })}
      <tr
        style={{
          height: paddingBottom,
        }}
      ></tr>
    </tbody>
  )
}
