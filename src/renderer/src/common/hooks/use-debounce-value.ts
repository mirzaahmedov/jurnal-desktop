import { useEffect, useRef, useState } from 'react'

export const useDebounceValue = <T>(value: T, debounceMS: number = 300) => {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = timeoutRef.current
    if (timeout) {
      clearTimeout(timeout)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMS)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, debounceMS])

  return [debouncedValue, setDebouncedValue] as const
}
