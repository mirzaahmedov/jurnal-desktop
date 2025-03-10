import { type HTMLAttributes, type InputHTMLAttributes } from 'react'

import { type LucideProps, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerProps?: HTMLAttributes<HTMLDivElement>
  iconProps?: LucideProps
  debounceMS?: number
}
export const SearchInput = ({
  className,
  containerProps,
  iconProps,
  ...props
}: SearchInputProps) => {
  const { t } = useTranslation()

  return (
    <div
      {...containerProps}
      className={cn('relative w-full max-w-xs', containerProps?.className)}
    >
      <Input
        autoFocus
        autoComplete="off"
        name="search"
        id="search"
        placeholder={t('search...')}
        className={cn('pl-8 shadow-none', className)}
        {...props}
      />
      <Search
        {...iconProps}
        className={cn(
          'absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400',
          iconProps?.className
        )}
      />
    </div>
  )
}
