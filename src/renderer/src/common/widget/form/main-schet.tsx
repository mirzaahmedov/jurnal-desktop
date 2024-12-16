import type { MainSchet } from '@/common/models'
import type { FieldsetProps } from '@/common/components'

import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'

type MainSchetFieldsProps = Omit<FieldsetProps, 'name'> & {
  name?: string
  main_schet?: MainSchet
}
const MainSchetFields = ({ name, main_schet, ...props }: MainSchetFieldsProps) => {
  return (
    <Fieldset {...props} name={name ?? 'Данные плательщика'}>
      <FormElement label="Получатель" grid="2:6">
        <Input readOnly tabIndex={-1} value={main_schet?.tashkilot_nomi} />
      </FormElement>

      <FormElement label="Банк" grid="2:6">
        <Input readOnly tabIndex={-1} value={main_schet?.tashkilot_bank} />
      </FormElement>

      <FormElement label="МФО" grid="2:6">
        <Input readOnly tabIndex={-1} value={main_schet?.tashkilot_mfo} />
      </FormElement>

      <FormElement label="ИНН" grid="2:6">
        <Input readOnly tabIndex={-1} value={main_schet?.tashkilot_inn} />
      </FormElement>

      <FormElement label="Расчетный счет" grid="2:6">
        <Input readOnly tabIndex={-1} value={main_schet?.account_number} />
      </FormElement>
    </Fieldset>
  )
}

export { MainSchetFields }
