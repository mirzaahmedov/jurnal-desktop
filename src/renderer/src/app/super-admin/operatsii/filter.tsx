import { useEffect } from 'react'

import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { SelectField } from '@/common/components'
import { SearchField } from '@/common/features/search'
import { TypeSchetOperatsii } from '@/common/models'

import { budgetService, budjetQueryKeys } from '../budjet'
import { operatsiiTypeSchetOptions } from './config'

export const OperatsiiFilter = () => {
  const [budjet, setBudjet] = useLocationState<number | undefined>('budjet_id', undefined)
  const [typeSchet, setTypeSchet] = useLocationState('type_schet', TypeSchetOperatsii.KASSA_PRIXOD)

  const { t } = useTranslation()
  const { data: budjetOptions, isFetching } = useQuery({
    queryKey: [budjetQueryKeys.getAll],
    queryFn: budgetService.getAll
  })

  useEffect(() => {
    setBudjet(budjetOptions?.data?.[0].id ?? undefined)
  }, [budjetOptions?.data, setBudjet])

  return (
    <div className="flex items-center">
      <div className="px-10 ml-auto w-full flex items-center gap-5">
        <SelectField
          disabled={isFetching}
          value={budjet ? String(budjet) : undefined}
          onValueChange={(value) => setBudjet(Number(value))}
          placeholder={t('choose', { what: t('budjet') })}
          options={budjetOptions?.data ?? []}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
        />
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
