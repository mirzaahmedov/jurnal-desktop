import type { SearchInputProps } from '@/common/components/search-input'

import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { useLocationState, usePagination } from '@/common/hooks'

export const useSearchFilter = () => {
  return useLocationState<string | undefined>('search', undefined)
}

export const SearchFilterDebounced = (props: SearchInputProps) => {
  const pagination = usePagination()

  const [search, setSearch] = useSearchFilter()

  return (
    <SearchInputDebounced
      autoFocus={false}
      value={search ?? ''}
      onValueChange={(value) => {
        setSearch(value ? value : undefined)
        pagination.onChange({
          page: 1
        })
      }}
      {...props}
    />
  )
}
