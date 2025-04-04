import { MonthSelect } from '@/common/components/month-select'
import { YearSelect } from '@/common/components/year-select'
import { useSelectedMonthStore } from '@/common/features/selected-month/store'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>(
    'year',
    useSelectedMonthStore.getState().startDate.getFullYear()
  )
}
export const useMonthFilter = () => {
  return useLocationState<number | undefined>(
    'month',
    useSelectedMonthStore.getState().startDate.getMonth() + 1
  )
}

export const KassaOstatokFilters = () => {
  const [year, setYear] = useYearFilter()
  const [month, setMonth] = useMonthFilter()

  return (
    <div className="flex items-center gap-5">
      <YearSelect
        value={year}
        onValueChange={setYear}
        triggerClassName="w-24"
      />
      <MonthSelect
        value={month}
        onValueChange={setMonth}
        triggerClassName="w-32"
      />
    </div>
  )
}
