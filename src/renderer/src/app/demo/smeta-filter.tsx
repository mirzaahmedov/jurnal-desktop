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

type SmetaFilterProps = {
  value?: number
  onChange?: (value: number) => void
}
const SmetaFilter = ({ value, onChange }: SmetaFilterProps) => {
  return (
    <SelectField
      value={String(value)}
      onValueChange={(option) => onChange?.(Number(option))}
      options={smetaFilterOptions}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.value}
      placeholder="Guruhni tanlang"
    />
  )
}

export { SmetaFilter }
