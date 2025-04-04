import type { FormSpravochnikFieldsComponent } from './types'
import type { Shartnoma } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { SelectField } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'
import { formatLocaleDate } from '@/common/lib/format'

export const ShartnomaFields: FormSpravochnikFieldsComponent<
  Shartnoma,
  {
    form?: UseFormReturn<{
      shartnoma_grafik_id?: number
    }>
  }
> = ({ tabIndex, disabled, spravochnik, name, error, form, ...props }) => {
  const { inputRef, ...spravochnikProps } = spravochnik

  const { t } = useTranslation()

  const shartnoma_grafik_id = form?.watch('shartnoma_grafik_id')

  useEffect(() => {
    if (spravochnikProps.selected) {
      form?.setValue('shartnoma_grafik_id', spravochnikProps.selected.grafiks[0]?.id ?? 0)
    }
  }, [spravochnikProps.selected])

  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('shartnoma')}
    >
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          inputRef={inputRef}
          tabIndex={tabIndex}
          disabled={disabled}
          getInputValue={(selected) => selected?.doc_num ?? ''}
          error={!!error?.message}
          label={t('shartnoma-number')}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => formatLocaleDate(selected?.doc_date)}
          error={!!error?.message}
          label={t('shartnoma-date')}
        />

        {form ? (
          <FormElement label={t('smeta')}>
            <SelectField
              tabIndex={tabIndex}
              withFormControl
              disabled={spravochnikProps.loading}
              options={spravochnikProps.selected?.grafiks ?? []}
              getOptionValue={(o) => o.id}
              getOptionLabel={(o) => `${o.smeta?.smeta_number} - ${o.smeta?.smeta_name}`}
              value={shartnoma_grafik_id ? String(shartnoma_grafik_id) : ''}
              onValueChange={(value) => {
                form?.setValue('shartnoma_grafik_id', value ? Number(value) : 0)
              }}
            />
          </FormElement>
        ) : null}
      </div>
    </SpravochnikFields>
  )
}
