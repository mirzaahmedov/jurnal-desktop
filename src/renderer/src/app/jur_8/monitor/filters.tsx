import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}

export const JUR8MonitorFilters = () => {
  const [year, setYear] = useYearFilter()
  return (
    <YearSelect
      selectedKey={year}
      onSelectionChange={(value) => setYear(value ? Number(value) : new Date().getFullYear())}
      className="w-24"
    />
  )
}
