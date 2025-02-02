import { parseAsString, useQueryStates } from 'nuqs'

import { SelectField } from '@/common/components'
import { SearchField } from '@/common/features/search'
import { TypeSchetOperatsii } from '@/common/models'

import { operatsiiTypeSchetOptions } from './constants'

const OperatsiiFilter = () => {
  const { filters, setFilters } = useOperatsiiFilters()

  return (
    <div className="flex items-center">
      <div className="px-10 ml-auto w-full max-w-xs">
        <SelectField
          value={filters.type_schet}
          onValueChange={(value) => setFilters({ type_schet: value })}
          placeholder="Выберите тип операции"
          options={operatsiiTypeSchetOptions}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      </div>
      <SearchField className="w-full" />
    </div>
  )
}

const useOperatsiiFilters = () => {
  const [filters, setFilters] = useQueryStates({
    type_schet: parseAsString.withDefault(TypeSchetOperatsii.KASSA_PRIXOD)
  })

  return {
    filters,
    setFilters
  }
}

export { OperatsiiFilter, useOperatsiiFilters }
