import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useId,
} from 'react'

export const InsertCursorContext = createContext<{
  insertCursor: string
  setInsertCursor: Dispatch<SetStateAction<string>>
  handlerMap: Record<string, any>
  write: (v: any) => Promise<void> | void
}>({} as any)

export function useInsertCursor(handler: (v: any) => void) {
  const { insertCursor, setInsertCursor, handlerMap } =
    useContext(InsertCursorContext)
  const id = useId()

  useEffect(() => {
    handlerMap[id] = handler
    return () => {
      delete handlerMap[id]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, id])

  return {
    isCurrentInsertCursor: id === insertCursor,
    activeInsertCursor: () => setInsertCursor(id),
  }
}

export function useWriteInsertCursor() {
  const { write } = useContext(InsertCursorContext)
  return write
}
