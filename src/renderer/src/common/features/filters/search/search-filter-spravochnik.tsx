import type { InputHTMLAttributes } from 'react'

import { SearchInput } from '@/common/components/search-input'

export type SpravochnikSearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  getValue: (key: string) => string | undefined
  setValue: (key: string, value: string) => void
}
export const SpravochnikSearchField = ({
  name = 'search',
  id,
  getValue,
  setValue,
  ...props
}: SpravochnikSearchFieldProps) => {
  return (
    <SearchInput
      id={id ?? name}
      value={getValue(name) ?? ''}
      onChange={(e) => setValue(name, e.target.value)}
      {...props}
    />
  )
}
