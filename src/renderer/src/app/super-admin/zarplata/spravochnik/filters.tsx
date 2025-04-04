import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks'

import { SpravochnikTypeSelect } from './spravochnik-type-select'

export const useTypeFilter = () => {
  return useLocationState<undefined | number>('type')
}

export const SpravochnikFilters = () => {
  const [typeCode, setTypeCode] = useTypeFilter()
  return (
    <div className="flex items-center justify-start px-10 gap-5">
      <SearchFilterDebounced />
      <SpravochnikTypeSelect
        value={typeCode}
        onChange={setTypeCode}
      />
    </div>
  )
}
