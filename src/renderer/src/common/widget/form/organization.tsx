import type { FormSpravochnikFieldsComponent } from './types'
import type { Organization } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { useEffect } from 'react'

import { CircleX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Button } from '@/common/components/ui/button'
import { FormField } from '@/common/components/ui/form'
import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

export interface OrganizationFieldsProps {
  displayGazna?: boolean
  readOnly?: boolean
  accountNumberField?: string
  gaznaNumberField?: string
  form?: UseFormReturn<any>
  // form?: UseFormReturn<{
  //   organization_porucheniya_name?: string
  //   organization_by_raschet_schet_id: number
  //   organization_by_raschet_schet_gazna_id: number
  // }>
}

export const OrganizationFields: FormSpravochnikFieldsComponent<
  Organization,
  OrganizationFieldsProps
> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  displayGazna = false,
  form,
  accountNumberField = 'organization_by_raschet_schet_id',
  gaznaNumberField = 'organization_by_raschet_schet_gazna_id',
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik

  const { t } = useTranslation()

  useEffect(() => {
    if (spravochnikProps.selected) {
      form?.setValue(accountNumberField, spravochnikProps.selected.account_numbers[0]?.id ?? 0, {
        shouldValidate: true
      })
    }
  }, [spravochnikProps.selected, accountNumberField])

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
            name={accountNumberField}
            render={({ field }) => (
              <FormElement
                label={t('raschet-schet')}
                grid="2:5"
              >
                <div className="flex items-center gap-2">
                  <JollySelect
                    tabIndex={tabIndex}
                    inputRef={field.ref}
                    onBlur={field.onBlur}
                    isDisabled={disabled || spravochnikProps.loading}
                    items={spravochnikProps.selected?.account_numbers ?? []}
                    selectedKey={field.value || null}
                    onSelectionChange={(value) => {
                      field.onChange(value ?? 0)
                    }}
                    className="flex-1"
                    placeholder=""
                  >
                    {(item) => (
                      <SelectItem
                        id={item.id}
                        key={item.id}
                      >
                        {item.raschet_schet}
                      </SelectItem>
                    )}
                  </JollySelect>
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
              name={gaznaNumberField}
              render={({ field }) => (
                <FormElement
                  label={t('raschet-schet-gazna')}
                  grid="2:5"
                >
                  <div className="flex items-center gap-2">
                    <JollySelect
                      tabIndex={tabIndex}
                      inputRef={field.ref}
                      onBlur={field.onBlur}
                      isDisabled={disabled || spravochnikProps.loading}
                      items={spravochnikProps.selected?.gaznas ?? []}
                      selectedKey={field.value || null}
                      onSelectionChange={(value) => {
                        field.onChange(value ?? 0)
                      }}
                      className="flex-1"
                      placeholder=""
                    >
                      {(item) => (
                        <SelectItem
                          id={item.id}
                          key={item.id}
                        >
                          {item.raschet_schet_gazna}
                        </SelectItem>
                      )}
                    </JollySelect>
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
