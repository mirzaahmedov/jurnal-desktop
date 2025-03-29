import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}

export const MainbookFilters = () => {
  const [year, setYear] = useYearFilter()

  return (
    <div className="flex items-center gap-5 px-5">
      <YearSelect
        value={year}
        onValueChange={setYear}
        triggerClassName="w-24"
      />
    </div>
  )
}
