import { ReactNode, useRef, useState } from 'react'
import { InsertCursorContext } from './shared'

export interface InsertCursorProviderProps {
  children: ReactNode
}

export const InsertCursorProvider = ({
  children,
}: InsertCursorProviderProps) => {
  const handlerMapRef = useRef({})
  const [insertCursor, setInsertCursor] = useState<string>('')
  const write = async (v: any) => {
    if (insertCursor) {
      await handlerMapRef.current?.[insertCursor]?.(v)
    }
  }
  return (
    <InsertCursorContext
      value={{
        insertCursor,
        setInsertCursor,
        handlerMap: handlerMapRef.current,
        write,
      }}
    >
      {children}
    </InsertCursorContext>
  )
}
