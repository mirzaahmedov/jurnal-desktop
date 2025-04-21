import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}

export const FinancialReceiptFilters = () => {
  const [year, setYear] = useYearFilter()
  return (
    <YearSelect
      selectedKey={year}
      onSelectionChange={(value) => setYear(value ? Number(value) : undefined)}
      className="w-24"
    />
  )
}
