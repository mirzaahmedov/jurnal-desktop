import { t } from 'i18next'
import { Trans } from 'react-i18next'

import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks/use-location-state'
import { TypeSchetOperatsii } from '@/common/models'

import { operatsiiTypeSchetOptions } from './config'

export const useTypeSchetFilter = () => {
  return useLocationState('type_schet', TypeSchetOperatsii.ALL)
}

export const OperatsiiFilter = () => {
  const [typeSchet, setTypeSchet] = useTypeSchetFilter()

  return (
    <div className="flex items-center justify-start gap-5">
      <JollySelect
        items={operatsiiTypeSchetOptions}
        placeholder={t('type')}
        selectedKey={typeSchet}
        onSelectionChange={(value) => setTypeSchet(value as TypeSchetOperatsii)}
        className="w-64"
      >
        {(item) => (
          <SelectItem id={item.value}>
            <Trans
              ns="app"
              i18nKey={item.transKey}
            />
          </SelectItem>
        )}
      </JollySelect>
      <SearchFilterDebounced />
    </div>
  )
}
