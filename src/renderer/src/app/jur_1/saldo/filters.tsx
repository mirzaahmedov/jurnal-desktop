import { YearSelect } from '@/common/components/year-select'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  const date = useSelectedMonthStore((store) => store.startDate)
  return useLocationState<number | undefined>('year', date.getFullYear())
}

export const KassaSaldoFilters = () => {
  const [year, setYear] = useYearFilter()

  return (
    <div className="flex items-center gap-5">
      <YearSelect
        value={year}
        onValueChange={setYear}
        triggerClassName="w-24"
      />
    </div>
  )
}
