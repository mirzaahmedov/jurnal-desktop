import { useCallback, useLayoutEffect, useRef } from 'react'

const useEventCallback = <T extends (...args: any[]) => any>(func: T): T => {
  const ref = useRef(func)
  useLayoutEffect(() => {
    ref.current = func
  }, [func])
  const cb = useCallback((...args: Parameters<T>) => ref.current?.(...args), [])

  if (!func) {
    // @ts-ignore will fix this later
    // Todo: fix this annoying
    return
  }
  return cb as ReturnType<T>
}

export { useEventCallback }
