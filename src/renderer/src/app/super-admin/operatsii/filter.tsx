import { useLocationState } from '@renderer/common/hooks/use-location-state'

import { SelectField } from '@/common/components'
import { SearchField } from '@/common/features/search'
import { TypeSchetOperatsii } from '@/common/models'

import { operatsiiTypeSchetOptions } from './config'

export const OperatsiiFilter = () => {
  const [typeSchet, setTypeSchet] = useLocationState('type_schet', TypeSchetOperatsii.ALL)

  return (
    <div className="flex items-center">
      <div className="px-10 ml-auto w-full flex items-center gap-5">
        <SelectField
          value={typeSchet}
          onValueChange={(value) => setTypeSchet(value as TypeSchetOperatsii)}
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
