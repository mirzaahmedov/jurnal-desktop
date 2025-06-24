import { useEffect, useRef, useState } from 'react'

import { useEventCallback } from '../hooks'

export interface DebouncerProps<T> {
  delay?: number
  value: T
  onChange: (value: T) => void
  children?: (props: { value: T; onChange: (value: T) => void }) => React.ReactNode
}
export const Debouncer = <T,>({ value, onChange, delay = 500, children }: DebouncerProps<T>) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onChangeEvent = useEventCallback(onChange)

  const [innerValue, setInnerValue] = useState(value)

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      onChangeEvent(innerValue)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [innerValue, onChangeEvent, delay])

  return children?.({
    value: innerValue,
    onChange: setInnerValue
  })
}
