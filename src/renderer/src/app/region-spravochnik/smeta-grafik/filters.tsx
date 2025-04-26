import { YearSelect } from '@/common/components/year-select'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState('year', new Date().getFullYear())
}

export const SmetaGrafikFilters = () => {
  const [year, setYear] = useYearFilter()
  return (
    <div className="flex items-center gap-5">
      <YearSelect
        selectedKey={year}
        onSelectionChange={(value) => setYear(value ? Number(value) : new Date().getFullYear())}
        className="w-24 gap-0"
      />
      <SearchFilterDebounced />
    </div>
  )
}
