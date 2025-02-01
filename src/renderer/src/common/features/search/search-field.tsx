import { useEffect, useRef, useState } from 'react'

import type { HTMLAttributes } from 'react'
import { Input } from '@/common/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/common/lib/utils'
import { usePagination } from '@/common/components'
import { useSearchParams } from 'react-router-dom'

export type SearchFieldProps = HTMLAttributes<HTMLDivElement>
export const SearchField = (props: SearchFieldProps) => {
  const { className, ...rest } = props

  const [interim, setInterim] = useState('')

  const [, setSearchParams] = useSearchParams()
  const { currentPage, setCurrentPage } = usePagination()

  const timeout = useRef<null | NodeJS.Timeout>(null)
  const callbackRef = useRef((value: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set('search', value)
    setSearchParams(params)
  })

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    timeout.current = setTimeout(() => {
      callbackRef.current(interim)
    }, 1000)
    const timer = timeout.current
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [interim])

  return (
    <div
      {...rest}
      className={cn('flex justify-end items-center gap-2.5 px-5', className)}
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
          className="pl-8 shadow-none focus-visible:ring-2"
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      </div>
    </div>
  )
}
