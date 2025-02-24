import type { FormSpravochnikFieldsComponent } from './types'
import type { Organization } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { SelectField } from '@renderer/common/components'
import { FormElement } from '@renderer/common/components/form'
import { Button } from '@renderer/common/components/ui/button'
import { FormField } from '@renderer/common/components/ui/form'
import { Input } from '@renderer/common/components/ui/input'
import { CircleX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

export interface OrganizationFieldsProps {
  displayGazna?: boolean
  displayPorucheniya?: boolean
  readOnly?: boolean
  form?: UseFormReturn<{
    organization_porucheniya_name?: string
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
  displayGazna = false,
  displayPorucheniya = false,
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
          grid: '2:5'
        }}
      />

      {displayPorucheniya && form ? (
        <FormField
          control={form.control}
          name="organization_porucheniya_name"
          render={({ field }) => (
            <FormElement
              label={`${t('organization')} (${t('porucheniya').toLowerCase()})`}
              grid="2:5"
            >
              <Input
                tabIndex={tabIndex}
                {...field}
              />
            </FormElement>
          )}
        />
      ) : null}

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.bank_klient ?? ''}
        label={t('bank')}
        formElementProps={{
          grid: '2:5'
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
          grid: '2:5'
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
          grid: '2:5'
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
                grid="2:5"
              >
                <div className="flex items-center gap-2">
                  <SelectField
                    {...field}
                    withFormControl
                    tabIndex={tabIndex}
                    disabled={disabled || spravochnikProps.loading}
                    options={spravochnikProps.selected?.account_numbers ?? []}
                    getOptionLabel={(o) => o.raschet_schet}
                    getOptionValue={(o) => o.id}
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => {
                      field.onChange(Number(value))
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-slate-400 hover:text-red-500"
                    onClick={() => {
                      field.onChange(undefined)
                    }}
                  >
                    <CircleX />
                  </Button>
                </div>
              </FormElement>
            )}
          />
          {displayGazna ? (
            <FormField
              control={form.control}
              name="organization_by_raschet_schet_gazna_id"
              render={({ field }) => (
                <FormElement
                  label={t('raschet-schet-gazna')}
                  grid="2:5"
                >
                  <div className="flex items-center gap-2">
                    <SelectField
                      {...field}
                      withFormControl
                      tabIndex={tabIndex}
                      disabled={disabled || spravochnikProps.loading || !spravochnikProps.selected}
                      options={spravochnikProps.selected?.gaznas ?? []}
                      getOptionLabel={(o) => o.raschet_schet_gazna}
                      getOptionValue={(o) => o.id}
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => {
                        field.onChange(undefined)
                      }}
                    >
                      <CircleX />
                    </Button>
                  </div>
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
              grid: '2:5'
            }}
          />

          {displayGazna ? (
            <SpravochnikField
              {...spravochnikProps}
              readOnly
              tabIndex={-1}
              disabled={disabled}
              error={!!error?.message}
              getInputValue={(selected) => selected?.gaznas?.[0]?.raschet_schet_gazna ?? ''}
              label={t('raschet-schet-gazna')}
              formElementProps={{
                grid: '2:5'
              }}
            />
          ) : null}
        </>
      )}
    </SpravochnikFields>
  )
}

export { OrganizationFields }
