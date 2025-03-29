import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
import { MonthSelect } from '@/common/components/month-select'
import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}
export const useMonthFilter = () => {
  return useLocationState<number | undefined>('month', new Date().getMonth() + 1)
}
export const useBudjetFilter = () => {
  return useLocationState<number | undefined>('budjet_id', undefined)
}

export const MainbookFilters = () => {
  const [year, setYear] = useYearFilter()
  const [month, setMonth] = useMonthFilter()
  const [budjet_id, setBudjetId] = useBudjetFilter()

  return (
    <div className="flex items-center gap-5 px-5">
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
      <BudjetSelect
        withOptionAll
        value={budjet_id}
        onValueChange={(value) => setBudjetId(value ? value : undefined)}
        triggerClassName="w-96"
      />
    </div>
  )
}
