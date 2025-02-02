import { useCallback, useLayoutEffect, useRef } from 'react'

const useEventCallback = <T extends (...args: any[]) => any>(func?: T): T | undefined => {
  const ref = useRef(func)
  useLayoutEffect(() => {
    ref.current = func
  }, [func])
  const cb = useCallback((...args: Parameters<T>) => ref.current?.(...args), [])

  if (!func) {
    return
  }
  return cb as ReturnType<T>
}

export { useEventCallback }
