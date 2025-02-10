import type { OrganizationFormValues } from './service'

import { type FormEventHandler, type ReactNode, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { bankQueryKeys } from '@/app/super-admin/bank/config'
import { bankService } from '@/app/super-admin/bank/service'
import { AutoComplete } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Form, FormControl, FormField, FormLabel } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

type OrganizationFormProps = {
  form: UseFormReturn<OrganizationFormValues>
  onSubmit: FormEventHandler<HTMLFormElement>
  formActions: ReactNode
}
const OrganizationForm = ({ form, formActions, onSubmit }: OrganizationFormProps) => {
  const [search, setSearch] = useState('')

  const { t } = useTranslation()
  const {
    fields: raschetSchets,
    append: appendRaschetSchet,
    remove: removeRaschetSchet
  } = useFieldArray({
    control: form.control,
    name: 'raschet_schet',
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
    name: 'raschet_schet_gazna'
  })

  const { data: bankList, isFetching } = useQuery({
    queryKey: [bankQueryKeys.getAll, { search }],
    queryFn: bankService.getAll,
    enabled: !!search,
    placeholderData: (prev) => prev
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6 py-4">
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
                        console.log('e.target.value', e.target.value)
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

          <div className="grid grid-cols-6">
            <FormLabel className="col-span-2 text-end">{t('raschet-schet')}</FormLabel>
          </div>
          <ul className="flex flex-col gap-6">
            {raschetSchets.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`raschet_schet.${index}.raschet_schet`}
                render={({ field }) => (
                  <li key={index}>
                    <FormElement
                      grid="2:4"
                      label={(index + 1).toString()}
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

          <div className="grid grid-cols-6">
            <FormLabel className="col-span-2 text-end">{t('raschet-schet-gazna')}</FormLabel>
          </div>
          {raschetSchetsGazna.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`raschet_schet_gazna.${index}.raschet_schet_gazna`}
              render={({ field }) => (
                <FormElement
                  key={index}
                  grid="2:4"
                  label={(index + 1).toString()}
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

          <FormField
            name="raschet_schet"
            control={form.control}
            render={({ field }) => (
              <FormElement
                grid="2:4"
                label={t('raschet-schet')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />

          <FormField
            name="raschet_schet_gazna"
            control={form.control}
            render={({ field }) => (
              <FormElement
                grid="2:4"
                label={t('raschet-schet-gazna')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />

          <FormField
            name="okonx"
            control={form.control}
            render={({ field }) => (
              <FormElement
                grid="2:4"
                label={t('okonx')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />
        </div>
        {formActions}
      </form>
    </Form>
  )
}

export { OrganizationForm }
