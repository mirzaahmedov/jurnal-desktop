import { useCallback, useEffect, useRef } from 'react'

export const useOverlay = () => {
  const overlayRef = useRef(document.getElementById('overlay')!)

  const showOverlay = useCallback(() => {
    overlayRef.current.dataset.state = 'open'
  }, [])
  const hideOverlay = useCallback(() => {
    overlayRef.current.dataset.state = 'closed'
  }, [])

  useEffect(() => {
    return () => {
      hideOverlay()
    }
  }, [hideOverlay])

  return {
    showOverlay,
    hideOverlay
  }
}
