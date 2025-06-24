import { useEffect } from 'react'

import { useEventCallback } from './use-event-callback'

export interface UseKeyUpParams {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  handler: (e: KeyboardEvent) => void
}
export const useKeyUp = ({
  key,
  ctrlKey,
  altKey,
  shiftKey,
  metaKey,
  handler: handler
}: UseKeyUpParams) => {
  const handlerCallback = useEventCallback(handler)

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        (ctrlKey === undefined || e.ctrlKey === ctrlKey) &&
        (altKey === undefined || e.altKey === altKey) &&
        (shiftKey === undefined || e.shiftKey === shiftKey) &&
        (metaKey === undefined || e.metaKey === metaKey)
      ) {
        handlerCallback(e)
      }
    }

    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [key, ctrlKey, altKey, shiftKey, metaKey, handlerCallback])
}
