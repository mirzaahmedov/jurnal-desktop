import { useEffect, useRef, useState } from 'react'

import { useEventCallback } from '@/common/hooks'

import { SearchInput, type SearchInputProps } from './search-input'

const DEFAULT_DEBOUNCE_MS = 600

export interface SpravochnikSearchFieldProps extends SearchInputProps {
  onChangeValue: (value: string) => void
  debounceMS?: number
}
export const SearchInputDebounced = ({
  value,
  onChange,
  onChangeValue,
  debounceMS = DEFAULT_DEBOUNCE_MS,
  ...props
}: SpravochnikSearchFieldProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const onChangeValueEvent = useEventCallback(onChangeValue!)

  const [internalValue, setInternalValue] = useState('')

  useEffect(() => {
    const timeout = timeoutRef.current
    if (timeout) {
      clearTimeout(timeout)
    }

    timeoutRef.current = setTimeout(() => {
      onChangeValueEvent?.(internalValue)
    }, debounceMS)

    return () => {
      clearTimeout(timeout)
    }
  }, [internalValue, debounceMS, onChangeValueEvent])

  useEffect(() => {
    setInternalValue(value as string)
  }, [value])

  return (
    <SearchInput
      value={internalValue}
      onChange={(e) => {
        onChange?.(e)
        setInternalValue(e.target.value)
      }}
      {...props}
    />
  )
}
