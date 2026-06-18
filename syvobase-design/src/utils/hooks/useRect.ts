import { RefObject, useEffect, useRef, useState } from 'react'

interface Rect {
  width: number
  height: number
  top: number
  left: number
  bottom: number
  right: number
  x: number
  y: number
}

export function useRect(
  ref?: RefObject<HTMLElement | null>,
  watchKeys: string[] = []
): Rect {
  const [rect, setRect] = useState<Rect>({} as Rect)
  const observerRef = useRef<ResizeObserver | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (watchKeys.length === 0) {
      return
    }

    const element = ref?.current
    if (!element) return

    const updateRect = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const newRect = element.getBoundingClientRect()
        setRect({
          width: newRect.width,
          height: newRect.height,
          top: newRect.top,
          left: newRect.left,
          bottom: newRect.bottom,
          right: newRect.right,
          x: newRect.x,
          y: newRect.y,
        })
      })
    }

    updateRect()

    if (typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver(updateRect)
      observerRef.current.observe(element)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, watchKeys)

  return rect as Rect
}
