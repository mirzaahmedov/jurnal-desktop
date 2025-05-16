import type { MutableRefObject } from 'react'

import { useEffect, useRef, useState } from 'react'

export interface AutoSizerProps {
  children: (size: {
    width: number
    height: number
    ref: MutableRefObject<HTMLDivElement | null>
  }) => React.ReactNode
}
export const AutoSizer = ({ children }: AutoSizerProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [size, setSize] = useState<{
    width: number
    height: number
  }>({
    width: 0,
    height: 0
  })

  useEffect(() => {
    if (!ref.current) return

    const handleResize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(ref.current)

    handleResize()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return children({
    width: size.width,
    height: size.height,
    ref
  })
}
