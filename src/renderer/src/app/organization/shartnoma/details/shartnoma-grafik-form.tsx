import type { ShartnomaFormValues } from '../service'
import type { FC } from 'react'

import { NumericInput } from '@renderer/common/components'
import { type FieldArrayWithId, type UseFormReturn, useFieldArray } from 'react-hook-form'

export const ShartnomaGrafikForm: FC<{
  form: UseFormReturn<ShartnomaFormValues>
}> = ({ form }) => {
  const { fields } = useFieldArray({
    control: form.control,
    name: 'grafiks'
  })
  return (
    <div>
      <ul>
        {fields.map((field, index) => (
          <GrafikRow
            form={form}
            index={index}
            key={field.id}
            field={field}
          />
        ))}
      </ul>
    </div>
  )
}

export const GrafikRow: FC<{
  form: UseFormReturn<ShartnomaFormValues>
  index: number
  field: FieldArrayWithId<ShartnomaFormValues, 'grafiks', 'id'>
}> = ({ form, index, field }) => {
  return (
    <li key={field.id}>
      <ul className="flex items-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <NumericInput
            key={i}
            {...form.register(`grafiks.${index}.oy_${i}` as any)}
          />
        ))}
      </ul>
    </li>
  )
}
