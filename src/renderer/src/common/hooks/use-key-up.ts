import { useEffect } from 'react'

import { useEventCallback } from './use-event-callback'

export interface UseKeyUpParams {
  key: string
  ctrlKey?: boolean
  handler: (e: KeyboardEvent) => void
}
export const useKeyUp = ({ key, ctrlKey, handler: handler }: UseKeyUpParams) => {
  const handlerCallback = useEventCallback(handler)

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (typeof ctrlKey === 'boolean' && e.ctrlKey !== ctrlKey) {
        return
      }

      if (e.key === key) {
        handlerCallback(e)
      }
    }

    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [key, ctrlKey, handlerCallback])
}
