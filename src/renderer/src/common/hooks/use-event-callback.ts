import { useCallback, useLayoutEffect, useRef } from 'react'

export const useEventCallback = <T extends ((...args: any[]) => any) | undefined>(func: T): T => {
  const ref = useRef(func)

  useLayoutEffect(() => {
    ref.current = func
  }, [func])
  const cb = useCallback((...args: any[]) => ref.current?.(...args), [])

  return (func ? cb : undefined) as T
}
