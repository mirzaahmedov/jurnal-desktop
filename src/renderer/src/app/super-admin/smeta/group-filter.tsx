import type { InputHTMLAttributes } from 'react'
import { SelectField } from '@renderer/common/components/select-field'

const smetaFilterOptions = [
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

type SmetaGroupFilterProps = InputHTMLAttributes<HTMLInputElement> & {
  getValue: (key: string) => string | undefined
  setValue: (key: string, value: string) => void
}
const SmetaGroupFilter = ({ getValue, setValue }: SmetaGroupFilterProps) => {
  const value = getValue('group_number') || '1'

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

export { SmetaGroupFilter }
