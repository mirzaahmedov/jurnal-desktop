import type { InputHTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'
import { Input } from '@/common/components/ui/input'
import { Search } from 'lucide-react'

export type SpravochnikSearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  getValue: (key: string) => string | undefined
  setValue: (key: string, value: string) => void
}
export const SpravochnikSearchField = (props: SpravochnikSearchFieldProps) => {
  const { className, name = 'search', id, getValue, setValue, ...restProps } = props

  return (
    <div className="relative w-full max-w-xs">
      <Input
        autoFocus
        autoComplete="off"
        name={name}
        id={id ?? name}
        value={getValue(name) ?? ''}
        onChange={(e) => setValue(name, e.target.value)}
        placeholder="Поиск..."
        className={cn('pl-8 shadow-none', className)}
        {...restProps}
      />
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
    </div>
  )
}
