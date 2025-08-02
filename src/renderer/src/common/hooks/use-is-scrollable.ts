import { useEffect, useState } from 'react'

export function useIsScrollable(direction: 'vertical' | 'horizontal' = 'vertical') {
  const [elementRef, setElementRef] = useState<HTMLDivElement>()
  const [isScrollable, setIsScrollable] = useState(false)

  useEffect(() => {
    const el = elementRef
    if (!el) return

    const checkScrollable = () => {
      if (direction === 'vertical') {
        setIsScrollable(el.scrollHeight > el.clientHeight)
      } else {
        setIsScrollable(el.scrollWidth > el.clientWidth)
      }
    }

    checkScrollable()

    const observer = new ResizeObserver(checkScrollable)
    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [direction, elementRef])

  return { setElementRef, isScrollable }
}
