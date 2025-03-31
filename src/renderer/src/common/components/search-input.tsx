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
      className={cn(
        'relative w-80 focus-within:w-96 transition-[width] duration-75',
        containerProps?.className
      )}
    >
      <Input
        required
        autoFocus
        autoComplete="off"
        name="search"
        id="search"
        placeholder={t('search...')}
        className={cn(
          'rounded-md pl-10 font-medium shadow-none focus:ring-red-400 focus-visible:ring-[3px] valid:focus:bg-slate-50 bg-slate-50 valid:bg-brand/10 valid:border-brand/20',
          className
        )}
        {...props}
      />
      <Search
        {...iconProps}
        className={cn(
          'absolute left-2.5 top-1/2 -translate-y-1/2 size-5 text-slate-400',
          iconProps?.className
        )}
      />
    </div>
  )
}
