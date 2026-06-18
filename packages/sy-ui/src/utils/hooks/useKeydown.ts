import { useEffect } from 'react'

export function useKeydown(
  key?: string,
  callback?: () => Promise<void> | void
) {
  return useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === key) {
        await callback!()
      }
    }

    if (key) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (key) {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [callback, key])
}
