import type { HTMLAttributes } from 'react'

import { useEffect, useRef, useState } from 'react'

import { useLocationState, usePagination } from '@renderer/common/hooks'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'

export type SearchFieldProps = HTMLAttributes<HTMLDivElement> & {
  containerProps?: HTMLAttributes<HTMLDivElement>
}
export const SearchField = ({ className, containerProps, ...props }: SearchFieldProps) => {
  const pagination = usePagination()

  const [search, setSearch] = useLocationState<string>('search')
  const [interim, setInterim] = useState(search)

  const { t } = useTranslation()

  const timeout = useRef<null | NodeJS.Timeout>(null)

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    timeout.current = setTimeout(() => {
      setSearch(interim)
      pagination.onChange({
        page: 1
      })
    }, 600)
    const timer = timeout.current
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [interim, pagination.onChange, setSearch])

  return (
    <div
      {...props}
      className={cn('flex justify-end items-center gap-2.5 px-5', className)}
    >
      <div
        {...containerProps}
        className={cn('relative w-full max-w-xs', containerProps?.className)}
      >
        <Input
          required
          formNoValidate
          name="search"
          id="search"
          value={interim}
          onChange={(e) => {
            setInterim(e.target.value)
          }}
          placeholder={t('search...')}
          className="rounded-md pl-10 shadow-none focus:ring-red-400 focus-visible:ring-[3px] valid:focus:bg-transparent valid:bg-brand/5"
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
      </div>
    </div>
  )
}
