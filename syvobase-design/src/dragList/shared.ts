import { Dict } from '@syvobase/utils'
import { createContext, ReactNode } from 'react'

export type DragListDataItem = Record<string, any> & { id: string }

export type DragListData = DragListDataItem[]

export interface DragState {
  item: DragListDataItem
  sourceElement: HTMLElement | null
  removeFromSource: () => void
}

export interface DragDropContextType {
  dragState: DragState | null
  setDragState: (state: DragState | null) => void
}

export const DragDropContext = createContext<DragDropContextType>({} as any)

export interface DragDropProviderProps {
  children: ReactNode
}

export type DragHandleProps = {
  onMouseDown: () => void
  style: { cursor: string }
}

export interface DragListProps {
  className?: string
  data: DragListData
  insertCursor?: boolean
  onItemRender: (e: {
    item: DragListDataItem
    dragHandle: ReactNode
    dragHandleProps: DragHandleProps
  }) => ReactNode
  onDividerRender?: ({
    createDivider,
  }: {
    createDivider: () => ReactNode
  }) => ReactNode
  onChange?: (data: DragListData) => void
  onIsCurrentInsertCursorChange?: (IsCurrentInsertCursor: boolean) => void
}

export interface DragListContextType {
  insertCursor: boolean
  activeInsertCursorMap: Dict
  dropTargetIndex: number | null
  clearDropTarget: () => void
  insert: (index: number, item: DragListDataItem) => void
  removeItem: (id: string) => void
  onItemRender: DragListProps['onItemRender']
  onDividerRender: DragListProps['onDividerRender']
  onIsCurrentInsertCursorChange?: DragListProps['onIsCurrentInsertCursorChange']
}

export const DragListContext = createContext<DragListContextType>({} as any)
