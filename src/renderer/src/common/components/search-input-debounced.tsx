import { useEffect, useRef, useState } from 'react'

import { useEventCallback } from '@/common/hooks'

import { SearchInput, type SearchInputProps } from './search-input'

export interface SpravochnikSearchFieldProps extends SearchInputProps {
  onValueChange: (value: string) => void
  debounceMS?: number
}
export const SearchInputDebounced = ({
  value,
  onChange,
  onValueChange,
  debounceMS = 600,
  ...props
}: SpravochnikSearchFieldProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const onChangeValueEvent = useEventCallback(onValueChange!)

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
      formNoValidate
      {...props}
    />
  )
}
