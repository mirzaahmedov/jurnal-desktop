import type { OrganizationFormValues } from './config'

import { type FormEventHandler, type ReactNode, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { bankQueryKeys } from '@/app/super-admin/bank/config'
import { bankService } from '@/app/super-admin/bank/service'
import { AutoComplete } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import { Form, FormControl, FormField, FormLabel } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

interface OrganizationFormProps {
  form: UseFormReturn<OrganizationFormValues>
  onSubmit: FormEventHandler<HTMLFormElement>
  formActions: ReactNode
}
export const OrganizationForm = ({ form, formActions, onSubmit }: OrganizationFormProps) => {
  const [search, setSearch] = useState('')

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

  const { data: bankList, isFetching } = useQuery({
    queryKey: [bankQueryKeys.getAll, { search }],
    queryFn: bankService.getAll,
    enabled: !!search,
    placeholderData: (prev) => prev
  })

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex-1 flex flex-col overflow-y-hidden p-1"
      >
        <div className="flex-1 grid gap-6 py-4 px-1 overflow-y-auto noscroll-bar">
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
                  isFetching={isFetching}
                  disabled={search === ''}
                  options={bankList?.data ?? []}
                  className="col-span-4"
                  getOptionLabel={(option) => `${option.mfo} ${option.bank_name}`}
                  getOptionValue={(option) => option.mfo}
                  onSelect={(option) => {
                    form.setValue('mfo', option.mfo)
                    form.setValue('bank_klient', option.bank_name)
                    setSearch('')
                  }}
                >
                  {({ open, close }) => (
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setSearch(e.target.value)
                      }}
                      onFocus={open}
                      onBlur={() => {
                        setSearch('')
                        close()
                        field.onBlur()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                        }
                      }}
                    />
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
                    isFetching={isFetching}
                    disabled={search === ''}
                    options={bankList?.data ?? []}
                    className="col-span-4"
                    getOptionLabel={(option) => `${option.mfo} ${option.bank_name}`}
                    getOptionValue={(option) => option.mfo}
                    onSelect={(option) => {
                      form.setValue('mfo', option.mfo)
                      form.setValue('bank_klient', option.bank_name)
                      setSearch('')
                    }}
                  >
                    {({ open, close }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setSearch(e.target.value)
                        }}
                        onFocus={open}
                        onBlur={() => {
                          setSearch('')
                          close()
                          field.onBlur()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                          }
                        }}
                      />
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
  )
}
