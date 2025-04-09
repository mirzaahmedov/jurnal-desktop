import { useEffect } from 'react'

import { useEventCallback } from './use-event-callback'

export interface UseKeyUpParams {
  key: string
  ctrlKey?: boolean
  onKeyUp: (e: KeyboardEvent) => void
}
export const useKeyUp = ({ key, ctrlKey, onKeyUp }: UseKeyUpParams) => {
  const onKeyUpCallback = useEventCallback(onKeyUp)

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (typeof ctrlKey === 'boolean' && e.ctrlKey !== ctrlKey) {
        return
      }

      if (e.key === key) {
        onKeyUpCallback(e)
      }
    }

    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [key, ctrlKey, onKeyUpCallback])
}
