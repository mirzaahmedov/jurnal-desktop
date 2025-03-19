import type { InputHTMLAttributes } from 'react'

import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'

export type SpravochnikSearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  getValue: (key: string) => string | undefined
  setValue: (key: string, value: string) => void
}
export const SpravochnikSearchField = ({
  className,
  name = 'search',
  id,
  getValue,
  setValue,
  ...props
}: SpravochnikSearchFieldProps) => {
  const { t } = useTranslation()
  return (
    <div className="relative w-full max-w-xs">
      <Input
        autoFocus
        autoComplete="off"
        name={name}
        id={id ?? name}
        value={getValue(name) ?? ''}
        onChange={(e) => setValue(name, e.target.value)}
        placeholder={t('search...')}
        className={cn('pl-8 shadow-none', className)}
        {...props}
      />
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
    </div>
  )
}
