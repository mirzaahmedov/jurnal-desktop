import type { FormSpravochnikFieldsComponent } from './types'
import type { Shartnoma } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'
import { useEventCallback } from '@/common/hooks'
import { formatLocaleDate } from '@/common/lib/format'

export const ShartnomaFields: FormSpravochnikFieldsComponent<
  Shartnoma,
  {
    form?: UseFormReturn<{
      shartnoma_grafik_id?: number
    }>
    onGrafikSelected?: (id: number) => void
  }
> = ({ tabIndex, disabled, spravochnik, name, error, form, onGrafikSelected, ...props }) => {
  const { inputRef, ...spravochnikProps } = spravochnik

  const { t } = useTranslation()

  const grafikId = form?.watch('shartnoma_grafik_id')
  const onGrafikSelectedCB = useEventCallback(onGrafikSelected)

  const selected = spravochnikProps.selected
  useEffect(() => {
    if (!selected || selected.grafiks?.find((item) => item.id === grafikId)) {
      return
    }

    if (selected) {
      const firstGrafikId = selected.grafiks[0]?.id ?? 0
      form?.setValue('shartnoma_grafik_id', firstGrafikId)
      if (firstGrafikId) {
        onGrafikSelectedCB?.(firstGrafikId)
      }
    }
  }, [selected, onGrafikSelectedCB, grafikId])

  const handleClear = () => {
    spravochnikProps?.clear()
    form?.setValue('shartnoma_grafik_id', 0)
  }

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
          clear={handleClear}
          error={!!error?.message}
          label={t('shartnoma-number')}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => formatLocaleDate(selected?.doc_date)}
          clear={handleClear}
          error={!!error?.message}
          label={t('shartnoma-date')}
        />

        {form ? (
          <FormElement
            label={t('smeta')}
            className="col-span-2"
          >
            <JollySelect
              tabIndex={tabIndex}
              isDisabled={spravochnikProps.loading}
              items={selected?.grafiks ?? []}
              placeholder=""
              selectedKey={grafikId || null}
              onSelectionChange={(value) => {
                form?.setValue('shartnoma_grafik_id', value ? Number(value) : 0)
                onGrafikSelected?.(value ? Number(value) : 0)
              }}
            >
              {(item) => (
                <SelectItem id={item.id}>
                  {item.smeta?.smeta_number} - {item.smeta?.smeta_name}
                </SelectItem>
              )}
            </JollySelect>
          </FormElement>
        ) : null}
      </div>
    </SpravochnikFields>
  )
}
