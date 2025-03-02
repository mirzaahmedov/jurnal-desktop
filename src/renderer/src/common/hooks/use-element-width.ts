import { useEffect, useState } from 'react'

export interface UseElementWidthParams {
  trigger: boolean
}
export const useElementWidth = ({ trigger }: UseElementWidthParams) => {
  const [width, setWidth] = useState<number>()
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (!elementRef) {
        return
      }
      setWidth(elementRef.getBoundingClientRect().width)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [elementRef, trigger])

  return {
    width,
    setElementRef
  }
}
