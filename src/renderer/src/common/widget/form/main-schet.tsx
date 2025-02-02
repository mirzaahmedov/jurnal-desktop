import type { FieldsetProps } from '@/common/components'
import type { MainSchet } from '@/common/models'

import { useTranslation } from 'react-i18next'

import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'

type MainSchetFieldsProps = Omit<FieldsetProps, 'name'> & {
  name?: string
  main_schet?: MainSchet
}
const MainSchetFields = ({ name, main_schet, ...props }: MainSchetFieldsProps) => {
  const { t } = useTranslation()
  return (
    <Fieldset
      {...props}
      name={name ?? t('receiver-info')}
    >
      <FormElement
        label={t('receiver')}
        grid="2:6"
      >
        <Input
          readOnly
          tabIndex={-1}
          value={main_schet?.tashkilot_nomi}
        />
      </FormElement>

      <FormElement
        label={t('bank')}
        grid="2:6"
      >
        <Input
          readOnly
          tabIndex={-1}
          value={main_schet?.tashkilot_bank}
        />
      </FormElement>

      <FormElement
        label={t('mfo')}
        grid="2:6"
      >
        <Input
          readOnly
          tabIndex={-1}
          value={main_schet?.tashkilot_mfo}
        />
      </FormElement>

      <FormElement
        label={t('inn')}
        grid="2:6"
      >
        <Input
          readOnly
          tabIndex={-1}
          value={main_schet?.tashkilot_inn}
        />
      </FormElement>

      <FormElement
        label={t('raschet-schet')}
        grid="2:6"
      >
        <Input
          readOnly
          tabIndex={-1}
          value={main_schet?.account_number}
        />
      </FormElement>
    </Fieldset>
  )
}

export { MainSchetFields }
