import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState('year', new Date().getFullYear())
}

export const Jur8MonitorFilters = () => {
  const [year, setYear] = useYearFilter()
  return (
    <YearSelect
      value={year}
      onValueChange={setYear}
      triggerClassName="w-24"
    />
  )
}
