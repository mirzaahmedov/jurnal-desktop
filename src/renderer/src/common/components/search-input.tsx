import { type HTMLAttributes, type InputHTMLAttributes, useRef } from 'react'

import { type LucideProps, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'

import { useKeyUp } from '../hooks'
import { HotKey } from './hot-key'

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerProps?: HTMLAttributes<HTMLDivElement>
  iconProps?: LucideProps
  debounceMS?: number
  hotKey?: string
}
export const SearchInput = ({
  className,
  containerProps,
  iconProps,
  hotKey = '/',
  ...props
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()

  useKeyUp({
    key: hotKey,
    ctrlKey: true,
    handler: () => {
      inputRef.current?.focus()
    }
  })

  return (
    <div
      {...containerProps}
      className={cn('relative w-80', containerProps?.className)}
    >
      <Input
        required
        autoFocus
        ref={inputRef}
        autoComplete="off"
        name="search"
        id="search"
        placeholder={t('search...')}
        className={cn(
          'rounded-md pl-10 pr-24 font-medium shadow-none focus:ring-red-400 focus-visible:ring-[3px] valid:focus:bg-slate-50 bg-slate-50 valid:bg-brand/10 valid:border-brand/20',
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

      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 space-x-1 z-50 pointer-events-none">
        <HotKey>CTRL</HotKey>
        <HotKey>{hotKey}</HotKey>
      </div>
    </div>
  )
}
