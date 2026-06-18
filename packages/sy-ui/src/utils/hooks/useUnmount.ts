import { useEffect, useRef } from 'react'

export function useUnmount(callback: () => Promise<void> | void) {
  const ref = useRef(false)
  return useEffect(
    () => () => {
      if (ref.current) {
        return
      }
      ref.current = true
      callback()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
