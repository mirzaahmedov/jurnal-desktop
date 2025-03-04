import { useEffect } from 'react'

import { createPortal } from 'react-dom'

export interface HighlightOverlayProps {
  open?: boolean
  clientRect?: DOMRect
}
export const HighlightOverlay = ({ open, clientRect }: HighlightOverlayProps) => {
  const { x = 0, y = 0, width = 0, height = 0 } = clientRect ?? {}

  useEffect(() => {
    if (open) {
      document.body.classList.add('scroll-disabled')
    } else {
      document.body.classList.remove('scroll-disabled')
    }
    return () => {
      document.body.classList.remove('scroll-disabled')
    }
  }, [clientRect, open])

  return open
    ? createPortal(
        <>
          <div
            className="fixed top-0 bg-black/20 z-[100]"
            style={{
              left: x,
              width,
              height: y
            }}
          ></div>
          <div
            className="fixed bottom-0 bg-black/20 z-[100]"
            style={{
              left: x,
              width,
              height: window.innerHeight - (y + height)
            }}
          ></div>
          <div
            className="fixed left-0 top-0 bottom-0 bg-black/20 z-[100]"
            style={{
              width: x
            }}
          ></div>
          <div
            className="fixed right-0 top-0 bottom-0 bg-black/20 z-[100]"
            style={{
              width: window.innerWidth - (x + width)
            }}
          ></div>
        </>,
        document.getElementById('overlays')!
      )
    : null
}
