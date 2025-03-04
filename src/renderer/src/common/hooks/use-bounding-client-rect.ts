import { useEffect, useState } from 'react'

export const useBoundingClientRect = () => {
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null)
  const [clientRect, setClientRect] = useState<DOMRect>()

  useEffect(() => {
    if (!elementRef) {
      return
    }

    setClientRect(elementRef.getBoundingClientRect())
  }, [elementRef])

  return { clientRect, setElementRef }
}
