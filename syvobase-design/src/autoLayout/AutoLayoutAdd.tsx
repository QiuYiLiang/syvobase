import { BaseProps, cn } from '../utils'
import { mergeTag } from '@/utils/tag'
import { AutoLayoutEditorContext } from './shared'
import { useContext, useRef } from 'react'
import { v4 } from 'uuid'

interface Size {
  width: number
  height: number
}
export interface AutoLayoutAddProps extends BaseProps {
  onAdd: () => Promise<string> | string
  getSize?: () => Promise<Size> | Size
}

export const AutoLayoutAdd = (props: AutoLayoutAddProps) => {
  const { className, style, onAdd, getSize, children } = props
  const { draggingInfo, setDraggingInfo } = useContext(AutoLayoutEditorContext)
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      {...mergeTag('auto-layout-add', props)}
      className={cn('cursor-grab', className)}
      style={style}
      draggable
      onDragStart={async (e) => {
        e.stopPropagation()
        const { width, height } = (await getSize?.()) || {
          width: 33,
          height: 100,
        }
        const rect = (ref.current as any).getBoundingClientRect()
        const offsetLeft = e.clientX - rect.left
        const offsetTop = e.clientY - rect.top
        setDraggingInfo({
          dropEl: null,
          item: {
            id: v4(),
            x: 0,
            y: 0,
            w: width,
            h: height,
          },
          offsetLeft,
          offsetTop,
        })
      }}
      onDragEnd={async (e) => {
        e.stopPropagation()
        if (!draggingInfo?.dropEl) {
          return
        }
        const dropEl = draggingInfo.dropEl as any
        const setLayoutValue = dropEl.setLayoutValue
        const id = await onAdd()
        if (id) {
          setLayoutValue(
            dropEl.displayLayout.map((item) =>
              item.id === draggingInfo.item.id ? { ...item, id } : item
            )
          )
        }
        setDraggingInfo(null)
      }}
    >
      {children}
    </div>
  )
}
