import { Form, FormControl, FormField } from '@/common/components/ui/form'
import { FormEventHandler, ReactNode, useState } from 'react'

import { AutoComplete } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { OrganizationFormPayload } from './service'
import { UseFormReturn } from 'react-hook-form'
import { bankQueryKeys } from '@/app/super-admin/bank/config'
import { bankService } from '@/app/super-admin/bank/service'
import { useQuery } from '@tanstack/react-query'

type OrganizationFormProps = {
  form: UseFormReturn<OrganizationFormPayload>
  onSubmit: FormEventHandler<HTMLFormElement>
  formActions: ReactNode
}
const OrganizationForm = ({ form, formActions, onSubmit }: OrganizationFormProps) => {
  const [search, setSearch] = useState('')

  const { data: bankList, isFetching } = useQuery({
    queryKey: [bankQueryKeys.getAll, { search }],
    queryFn: bankService.getAll,
    enabled: !!search,
    placeholderData: (prev) => prev
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="Название">
                <Input {...field} />
              </FormElement>
            )}
          />

          <FormField
            name="inn"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="ИНН">
                <Input {...field} />
              </FormElement>
            )}
          />

          <FormField
            name="mfo"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="МФО">
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
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      console.log('e.target.value', e.target.value)
                      setSearch(e.target.value)
                    }}
                    onBlur={() => {
                      setSearch('')
                      field.onBlur()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                      }
                    }}
                  />
                </AutoComplete>
              </FormElement>
            )}
          />

          <FormField
            name="bank_klient"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="Название банка">
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
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setSearch(e.target.value)
                      }}
                      onBlur={() => {
                        setSearch('')
                        field.onBlur()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                        }
                      }}
                    />
                  </AutoComplete>
                </FormControl>
              </FormElement>
            )}
          />

          <FormField
            name="raschet_schet"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="Расчетный счет">
                <Input {...field} />
              </FormElement>
            )}
          />

          <FormField
            name="raschet_schet_gazna"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="Расчетный счет газна">
                <Input {...field} />
              </FormElement>
            )}
          />

          <FormField
            name="okonx"
            control={form.control}
            render={({ field }) => (
              <FormElement grid="2:4" label="Оконкс">
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
