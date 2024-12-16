import { useLayoutEffect, useRef, useState } from 'react'

type ScrollDirection = 'up' | 'down'

const useScroll = () => {
  const prevY = useRef<number>(0)

  const [containerRef, getContainerRef] = useState<HTMLElement | null>(null)
  const [direction, setDirection] = useState<ScrollDirection>('down')

  useLayoutEffect(() => {
    const root = containerRef ?? window
    if (!root) {
      throw new Error('containerRef.current is null')
    }
    const handleScroll = (e: Event) => {
      if (!e.currentTarget) {
        return
      }
      const currentY = (e.currentTarget as HTMLElement).scrollTop
      if (currentY > prevY.current) {
        setDirection('down')
      } else {
        setDirection('up')
      }
      prevY.current = currentY
    }

    root.addEventListener('scroll', handleScroll)

    return () => {
      root.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef])

  return { direction, containerRef, getContainerRef }
}

export { useScroll }
