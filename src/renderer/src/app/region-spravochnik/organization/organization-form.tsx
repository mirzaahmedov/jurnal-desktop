import type { OrganizationFormValues } from './config'
import type { SoliqOrganization } from '@/common/features/integrations/soliq/model'

import { type FormEventHandler, type ReactNode, useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAsyncListBank } from '@/app/super-admin/bank/service'
import { AutoComplete, type AutoCompleteMethods } from '@/common/components/auto-complete'
import { FormElement } from '@/common/components/form'
import { ComboboxItem } from '@/common/components/jolly/combobox'
import { Button } from '@/common/components/ui/button'
import { Form, FormControl, FormField, FormLabel } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { SoliqOrganizationModal } from '@/common/features/integrations/soliq/SoliqOrganizationModal'
import { SoliqIntegrationService } from '@/common/features/integrations/soliq/service'
import { normalizeSpaces } from '@/common/lib/text'

interface OrganizationFormProps {
  form: UseFormReturn<OrganizationFormValues>
  onSubmit: FormEventHandler<HTMLFormElement>
  formActions: ReactNode
}
export const OrganizationForm = ({ form, formActions, onSubmit }: OrganizationFormProps) => {
  const autoCompleteMethods = useRef<AutoCompleteMethods>(null)
  const callbackRef = useRef<VoidFunction>()

  const mfoBankList = useAsyncListBank()
  const nameBankList = useAsyncListBank()

  const [foundOrganization, setFoundOrganization] = useState<SoliqOrganization>()

  const { t } = useTranslation()
  const {
    fields: raschetSchets,
    append: appendRaschetSchet,
    remove: removeRaschetSchet
  } = useFieldArray({
    control: form.control,
    name: 'account_numbers',
    rules: {
      minLength: 1
    }
  })
  const {
    fields: raschetSchetsGazna,
    append: appendRaschetSchetGazna,
    remove: removeRaschetSchetGazna
  } = useFieldArray({
    control: form.control,
    name: 'gaznas'
  })

  const findOrganizationByInnMutation = useMutation({
    mutationFn: SoliqIntegrationService.findOrganizationByInn,
    onSuccess: (res) => {
      if (res.data) {
        setFoundOrganization(res.data)
      }
    }
  })

  useEffect(() => {
    if (form.watch('inn').length === 9 && form.watch('inn') !== form.getValues('default_inn')) {
      findOrganizationByInnMutation.mutate(form.watch('inn'))
    }
  }, [form.watch('inn')])

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current?.()
      callbackRef.current = undefined
    }
  }, [mfoBankList.items])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex-1 flex flex-col overflow-y-hidden p-1"
        >
          <div className="flex-1 grid gap-6 py-4 px-1 overflow-y-auto scrollbar">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  grid="2:4"
                  label={t('name')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  grid="2:4"
                  label={t('address')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />

            <FormField
              name="director"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  grid="2:4"
                  label={t('director')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />

            <FormField
              name="inn"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  grid="2:4"
                  label={t('inn')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />

            <FormField
              name="mfo"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  grid="2:4"
                  label={t('mfo')}
                >
                  <AutoComplete
                    methods={autoCompleteMethods}
                    items={mfoBankList.items}
                    inputValue={mfoBankList.filterText}
                    onInputChange={mfoBankList.setFilterText}
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      field.onChange(key)
                      const selectedBank = mfoBankList.items.find((item) => item.mfo === key)
                      if (selectedBank) {
                        form.setValue('bank_klient', selectedBank.bank_name)
                      }
                    }}
                  >
                    {(item) => (
                      <ComboboxItem id={item.mfo}>
                        {item.mfo} - {normalizeSpaces(item.bank_name)}
                      </ComboboxItem>
                    )}
                  </AutoComplete>
                </FormElement>
              )}
            />

            <FormField
              name="bank_klient"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  grid="2:4"
                  label={t('bank')}
                >
                  <FormControl>
                    <AutoComplete
                      items={nameBankList.items}
                      inputValue={nameBankList.filterText}
                      onInputChange={nameBankList.setFilterText}
                      selectedKey={field.value}
                      onSelectionChange={(key) => {
                        field.onChange(key)
                        const selectedBank = nameBankList.items.find(
                          (item) => item.bank_name === key
                        )
                        if (selectedBank) {
                          form.setValue('mfo', selectedBank.mfo)
                        }
                      }}
                    >
                      {(item) => (
                        <ComboboxItem id={item.bank_name}>
                          {item.mfo} - {normalizeSpaces(item.bank_name)}
                        </ComboboxItem>
                      )}
                    </AutoComplete>
                  </FormControl>
                </FormElement>
              )}
            />

            <div className="grid grid-cols-6 gap-5 items-center">
              <FormLabel className="col-span-2 text-end">{t('raschet-schet')}</FormLabel>
            </div>
            <ul className="flex flex-col gap-6">
              {raschetSchets.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`account_numbers.${index}.raschet_schet`}
                  render={({ field }) => (
                    <li key={index}>
                      <FormElement
                        grid="2:4"
                        label={index + 1}
                      >
                        <div className="flex items-center justify-between gap-5">
                          <Input {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="btn-icon !mx-0 hover:text-red-500"
                            disabled={raschetSchets.length === 1}
                            onClick={() => removeRaschetSchet(index)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </FormElement>
                    </li>
                  )}
                />
              ))}
            </ul>
            <div className="grid grid-cols-6 mt-1">
              <div className="col-span-2"></div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendRaschetSchet({
                    raschet_schet: ''
                  })
                }
                className="col-span-4"
              >
                <Plus className="btn-icon icon-start" /> {t('add')}
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-5 items-center">
              <FormLabel className="col-span-2 text-end">{t('raschet-schet-gazna')}</FormLabel>
            </div>
            {raschetSchetsGazna.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`gaznas.${index}.raschet_schet_gazna`}
                render={({ field }) => (
                  <FormElement
                    key={index}
                    grid="2:4"
                    label={index + 1}
                  >
                    <div className="flex items-center justify-between gap-5">
                      <Input {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="btn-icon !mx-0 hover:text-red-500"
                        disabled={raschetSchetsGazna.length === 1}
                        onClick={() => removeRaschetSchetGazna(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </FormElement>
                )}
              />
            ))}
            <div className="grid grid-cols-6">
              <div className="col-span-2"></div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendRaschetSchetGazna({
                    raschet_schet_gazna: ''
                  })
                }
                className="col-span-4"
              >
                <Plus className="btn-icon icon-start" /> {t('add')}
              </Button>
            </div>
          </div>
          <div>{formActions}</div>
        </form>
      </Form>
      <SoliqOrganizationModal
        isOpen={!!foundOrganization}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFoundOrganization(undefined)
          }
        }}
        organization={foundOrganization}
        onConfirm={() => {
          if (!foundOrganization) {
            return
          }
          form.setValue('mfo', foundOrganization.mfo)
          form.setValue('name', foundOrganization.name)
          form.setValue('okonx', foundOrganization.okonx)
          form.setValue('account_numbers', [
            {
              raschet_schet: foundOrganization.account_number
            }
          ])
          form.setValue('address', foundOrganization.address)
          form.setValue('director', foundOrganization.director)

          setFoundOrganization(undefined)
          callbackRef.current = () => {
            autoCompleteMethods.current?.select(foundOrganization.mfo)
          }
        }}
      />
    </>
  )
}
