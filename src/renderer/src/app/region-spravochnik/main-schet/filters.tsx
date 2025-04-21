import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks'

export const useBudjetId = () => {
  return useLocationState<number | undefined>('budjet_id')
}

export const MainSchetFilters = () => {
  const [budjetId, setBudjetId] = useBudjetId()
  return (
    <div className="flex items-center gap-5">
      <BudjetSelect
        withFirstOptionSelected
        selectedKey={budjetId}
        onSelectionChange={(value) => setBudjetId(value ? Number(value) : undefined)}
        className="w-96"
      />
      <SearchFilterDebounced />
    </div>
  )
}
