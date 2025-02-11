import type { FormSpravochnikFieldsComponent } from './types'
import type { Organization } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { SelectField } from '@renderer/common/components'
import { FormElement } from '@renderer/common/components/form'
import { FormField } from '@renderer/common/components/ui/form'
import { useTranslation } from 'react-i18next'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

export interface OrganizationFieldsProps {
  gazna?: boolean
  form?: UseFormReturn<{
    organization_by_raschet_schet_id: number
    organization_by_raschet_schet_gazna_id: number
  }>
}

const OrganizationFields: FormSpravochnikFieldsComponent<Organization, OrganizationFieldsProps> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  gazna = false,
  form,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik

  const { t } = useTranslation()

  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('organization')}
    >
      <SpravochnikField
        {...spravochnikProps}
        readOnly
        inputRef={inputRef}
        tabIndex={tabIndex}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.name ?? ''}
        label={t('organization')}
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.bank_klient ?? ''}
        label={t('bank')}
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.mfo ?? ''}
        label={t('mfo')}
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.inn ?? ''}
        label={t('inn')}
        formElementProps={{
          grid: '2:6'
        }}
      />

      {form ? (
        <>
          <FormField
            control={form.control}
            name="organization_by_raschet_schet_id"
            render={({ field }) => (
              <FormElement
                label={t('raschet-schet')}
                grid="2:6"
              >
                <SelectField
                  {...field}
                  withFormControl
                  disabled={spravochnikProps.loading}
                  options={spravochnikProps.selected?.account_numbers ?? []}
                  getOptionLabel={(o) => o.raschet_schet}
                  getOptionValue={(o) => o.id}
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                />
              </FormElement>
            )}
          />
          {gazna ? (
            <FormField
              control={form.control}
              name="organization_by_raschet_schet_gazna_id"
              render={({ field }) => (
                <FormElement
                  label={t('raschet-schet-gazna')}
                  grid="2:6"
                >
                  <SelectField
                    {...field}
                    withFormControl
                    disabled={spravochnikProps.loading}
                    options={spravochnikProps.selected?.gaznas ?? []}
                    getOptionLabel={(o) => o.raschet_schet_gazna}
                    getOptionValue={(o) => o.id}
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  />
                </FormElement>
              )}
            />
          ) : null}
        </>
      ) : (
        <>
          <SpravochnikField
            {...spravochnikProps}
            readOnly
            tabIndex={-1}
            disabled={disabled}
            error={!!error?.message}
            getInputValue={(selected) => selected?.account_numbers?.[0]?.raschet_schet ?? ''}
            label={t('raschet-schet')}
            formElementProps={{
              grid: '2:6'
            }}
          />

          {gazna ? (
            <SpravochnikField
              {...spravochnikProps}
              readOnly
              tabIndex={-1}
              disabled={disabled}
              error={!!error?.message}
              getInputValue={(selected) => selected?.gaznas?.[0]?.raschet_schet_gazna ?? ''}
              label={t('raschet-schet-gazna')}
              formElementProps={{
                grid: '2:6'
              }}
            />
          ) : null}
        </>
      )}
    </SpravochnikFields>
  )
}

export { OrganizationFields }
