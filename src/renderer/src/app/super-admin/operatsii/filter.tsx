import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@renderer/common/hooks/use-location-state'

import { SelectField } from '@/common/components'
import { TypeSchetOperatsii } from '@/common/models'

import { operatsiiTypeSchetOptions } from './config'

export const useTypeSchetFilter = () => {
  return useLocationState('type_schet', TypeSchetOperatsii.ALL)
}

export const OperatsiiFilter = () => {
  const [typeSchet, setTypeSchet] = useTypeSchetFilter()

  return (
    <div className="flex items-center justify-start gap-5">
      <SearchFilterDebounced />
      <div className="w-64">
        <SelectField
          value={typeSchet}
          onValueChange={(value) => setTypeSchet(value as TypeSchetOperatsii)}
          placeholder="Выберите тип операции"
          options={operatsiiTypeSchetOptions}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      </div>
    </div>
  )
}
