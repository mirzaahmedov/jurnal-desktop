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
  const [budjet, setBudjet] = useBudjetFilter()

  return (
    <div className="flex items-center gap-5">
      <YearSelect
        selectedKey={year}
        onSelectionChange={(value) => setYear(value ? Number(value) : undefined)}
        className="w-24"
      />
      <MonthSelect
        selectedKey={month}
        onSelectionChange={(value) => setMonth(value ? Number(value) : new Date().getMonth() + 1)}
        className="w-32"
      />
      <BudjetSelect
        withOptionAll
        selectedKey={budjet}
        onSelectionChange={(value) => setBudjet(value ? (value as number) : undefined)}
        className="w-96"
      />
    </div>
  )
}
