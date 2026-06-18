import { ReactNode, useState } from 'react'
import { AutoLayoutEditorContext, DraggingInfo } from './shared'

export const AutoLayoutEditorProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [draggingInfo, setDraggingInfo] = useState<null | DraggingInfo>(null)
  return (
    <AutoLayoutEditorContext.Provider
      value={{
        draggingInfo,
        setDraggingInfo,
      }}
    >
      {children}
    </AutoLayoutEditorContext.Provider>
  )
}
