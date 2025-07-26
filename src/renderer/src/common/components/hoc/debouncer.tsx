import { type ReactNode, useEffect, useRef, useState } from 'react'

import { useEventCallback } from '@/common/hooks'

export interface DebouncerProps<T> {
  value: T
  onChange: (value: T) => void
  delay?: number
  children: (props: { value: T; onChange: (innerValue: T) => void }) => ReactNode
}

export const Debouncer = <T,>({ value, onChange, delay = 500, children }: DebouncerProps<T>) => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const [innerValue, setInnerValue] = useState(value)

  const onChangeEvent = useEventCallback(onChange)

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      onChangeEvent(innerValue)
    }, delay)

    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [innerValue, onChangeEvent, delay])

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  return children({
    value: innerValue,
    onChange: setInnerValue
  })
}
