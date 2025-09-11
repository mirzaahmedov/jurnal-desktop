import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { useConstantsStore } from '@/common/features/constants/store'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks'

export const usePodpisTypeFilter = () => {
  return useLocationState<string | undefined>('podpisType', undefined)
}

export const PodpisFilters = () => {
  const { t } = useTranslation(['app', 'podpis'])
  const { podpisTypes } = useConstantsStore()

  const [podpisType, setPodpisType] = usePodpisTypeFilter()

  const typeOptions = useMemo(() => {
    return [
      {
        key: '',
        name: t('all'),
        id: 0
      },
      ...podpisTypes
    ] satisfies typeof podpisTypes
  }, [podpisTypes])

  return (
    <div className="flex gap-5">
      <SearchFilterDebounced />
      <JollySelect
        items={typeOptions}
        placeholder={t('type-document')}
        onSelectionChange={(value) => setPodpisType(value ? String(value) : undefined)}
        selectedKey={podpisType || ''}
        className="w-full max-w-52"
      >
        {(item) => <SelectItem id={item.key}>{item.name}</SelectItem>}
      </JollySelect>
    </div>
  )
}
