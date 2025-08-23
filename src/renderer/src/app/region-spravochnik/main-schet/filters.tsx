import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useLocationState } from '@/common/hooks'

export const useBudjetId = () => {
  const budjetId = useRequisitesStore((store) => store.budjet_id)
  return useLocationState<number | undefined>('budjet_id', budjetId || undefined)
}

export const MainSchetFilters = () => {
  const [budjetId, setBudjetId] = useBudjetId()
  return (
    <div className="flex items-center gap-5">
      <BudjetSelect
        withFirstOptionSelected={budjetId ? false : true}
        selectedKey={budjetId}
        onSelectionChange={(value) => setBudjetId(value ? Number(value) : undefined)}
        className="w-96"
      />
      <SearchFilterDebounced />
    </div>
  )
}
