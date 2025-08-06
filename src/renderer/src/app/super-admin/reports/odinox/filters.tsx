import { MonthSelect } from '@/common/components/month-select'
import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}
export const useMonthFilter = () => {
  return useLocationState<number | undefined>('month', new Date().getMonth() + 1)
}

export const AdminOdinoxFilters = () => {
  const [year, setYear] = useYearFilter()
  const [month, setMonth] = useMonthFilter()

  return (
    <div className="flex items-center gap-5">
      <YearSelect
        selectedKey={year ?? null}
        onSelectionChange={(value) => setYear(value ? Number(value) : undefined)}
        className="w-24"
      />
      <MonthSelect
        selectedKey={month ?? null}
        onSelectionChange={(value) => setMonth(value ? Number(value) : undefined)}
        className="w-28"
      />
    </div>
  )
}
