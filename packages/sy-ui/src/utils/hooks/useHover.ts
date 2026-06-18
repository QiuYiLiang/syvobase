import { RefObject, useEffect, useState } from 'react'

export function useHover(ref: RefObject<HTMLElement | null>) {
  const [hover, setHover] = useState(false)
  useEffect(() => {
    const el = ref.current
    const handleMouseEnter = () => {
      setHover(true)
    }
    const handleMouseLeave = () => {
      setHover(false)
    }
    if (el) {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    }
    return () => {
      el?.removeEventListener('mouseenter', handleMouseEnter)
      el?.removeEventListener('mouseleave', handleMouseLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current])

  return hover
}
