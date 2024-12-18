import type { HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'
import { Input } from '@/common/components/ui/input'
import { Search } from 'lucide-react'
import { useSearch } from './hook'
import { useState, useEffect, useRef } from 'react'
import { usePagination } from '@/common/components'

export type SearchFieldProps = HTMLAttributes<HTMLDivElement>
export const SearchField = (props: SearchFieldProps) => {
  const { className, ...rest } = props

  const timeout = useRef<null | NodeJS.Timeout>(null)
  const [interim, setInterim] = useState('')

  const { setSearch } = useSearch()
  const { currentPage, setCurrentPage } = usePagination()

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(() => {
      setSearch(interim)
    }, 300)

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [setSearch, interim])

  return (
    <div
      {...rest}
      className={cn('flex justify-end items-center gap-2.5 px-10', className)}
    >
      <div className="relative w-full max-w-xs">
        <Input
          name="search"
          id="search"
          value={interim}
          onChange={(e) => {
            setInterim(e.target.value)
            if (currentPage !== 1) {
              setCurrentPage(1)
            }
          }}
          placeholder="Поиск..."
          className="pl-8 shadow-none"
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      </div>
    </div>
  )
}
