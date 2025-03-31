import type { InputHTMLAttributes } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@renderer/common/hooks'
import { useTranslation } from 'react-i18next'

import { SelectField } from '@/common/components/select-field'

export const useGroupNumberFilter = () => {
  return useLocationState('group_number', 'all')
}

export const SmetaFilters = () => {
  const [groupNumber, setGroupNumber] = useGroupNumberFilter()

  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-start gap-5">
      <SearchFilterDebounced />
      <SelectField
        name="group_number"
        value={groupNumber}
        onValueChange={setGroupNumber}
        options={smetaFilterOptions}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.value}
        placeholder={t('choose', { what: t('group') })}
        triggerClassName="w-96"
      />
    </div>
  )
}

type SmetaSpravochnikFilterProps = InputHTMLAttributes<HTMLInputElement> & {
  getValue: (key: string) => string | undefined
  setValue: (key: string, value: string) => void
}
export const SmetaGroupFilter = ({ getValue, setValue }: SmetaSpravochnikFilterProps) => {
  const value = getValue('group_number') || 'all'

  return (
    <SelectField
      name="group_number"
      value={value}
      onValueChange={(option) => setValue('group_number', option || '1')}
      options={smetaFilterOptions}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.value}
      placeholder="Guruhni tanlang"
    />
  )
}

export const smetaFilterOptions = [
  {
    name: 'Barchasi',
    value: 'all'
  },
  {
    name: 'I-guruh “Ish haqi va unga tenglashtirilgan to‘lovlar”',
    value: 1
  },
  {
    name: 'II-guruh “Ish haqiga qo‘shimchalar”',
    value: 2
  },
  {
    name: 'III-guruh “Kapital qo‘yilmalar”',
    value: 3
  },
  {
    name: 'IV-guruh “Boshqa xarajatlar”',
    value: 4
  }
]
