import { useEffect, useRef } from 'react'

export function useMount<R>(callback: () => Promise<R> | R) {
  const ref = useRef(false)
  const retRef = useRef<R>(null)
  useEffect(() => {
    if (ref.current) {
      return
    }
    ref.current = true
    ;(async () => {
      retRef.current = await callback()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return retRef
}
