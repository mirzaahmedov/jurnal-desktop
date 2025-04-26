import type { InputHTMLAttributes } from 'react'

import { useTranslation } from 'react-i18next'

import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { SelectField } from '@/common/components/select-field'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks'

export const useGroupNumberFilter = () => {
  return useLocationState<string | number>('group_number', 'all')
}

export const SmetaFilters = () => {
  const [groupNumber, setGroupNumber] = useGroupNumberFilter()

  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-start gap-5">
      <JollySelect
        placeholder={t('group')}
        name="group_number"
        items={groupNumberOptions}
        selectedKey={groupNumber}
        onSelectionChange={(value) => setGroupNumber(value)}
        className="w-96 text-start"
      >
        {(item) => <SelectItem id={item.value}>{item.name}</SelectItem>}
      </JollySelect>
      <SearchFilterDebounced />
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
      options={groupNumberOptions}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.value}
      placeholder="Guruhni tanlang"
      triggerClassName="w-96 text-start"
    />
  )
}

export const groupNumberOptions = [
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
] as const
