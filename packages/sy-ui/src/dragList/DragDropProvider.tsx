import { useState } from 'react'
import { DragDropContext, DragDropProviderProps, DragState } from './shared'

export const DragDropProvider = ({ children }: DragDropProviderProps) => {
  const [dragState, setDragState] = useState<DragState | null>(null)

  return (
    <DragDropContext value={{ dragState, setDragState }}>
      {children}
    </DragDropContext>
  )
}
