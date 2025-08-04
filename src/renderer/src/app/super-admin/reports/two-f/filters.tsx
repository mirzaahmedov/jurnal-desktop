import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}

export const AdminTwoFFilters = () => {
  const [year, setYear] = useYearFilter()

  return (
    <div className="flex items-center gap-5">
      <YearSelect
        selectedKey={year}
        onSelectionChange={(value) => setYear(value ? Number(value) : undefined)}
        className="w-24"
      />
    </div>
  )
}
