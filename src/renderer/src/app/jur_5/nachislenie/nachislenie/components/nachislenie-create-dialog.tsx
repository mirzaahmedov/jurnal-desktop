import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TabelColumnDefs } from '@/app/jur_5/nachislenie/tabel/columns'
import { TabelService } from '@/app/jur_5/nachislenie/tabel/service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { DialogContent, DialogOverlay, DialogTrigger } from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { YearSelect } from '@/common/components/year-select'
import { parseDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { defaultValues } from '../config'
import { NachislenieService } from '../service'

export interface NachislenieCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainSchetId: number
  spravochnikBudjetNameId: number
}
export const NachislenieCreateDialog = ({
  mainSchetId,
  spravochnikBudjetNameId,
  ...props
}: NachislenieCreateDialogProps) => {
  const { t } = useTranslation(['app'])

  const [search, setSearch] = useState<string>('')

  const { data: tabels, isFetching } = useQuery({
    queryKey: [
      TabelService.QueryKeys.GetAll,
      {
        page: 1,
        limit: 10,
        budjetId: spravochnikBudjetNameId,
        docNum: search ? search : undefined,
        status: false
      }
    ],
    queryFn: TabelService.getAll
  })
  const { mutate: createNachislenie, isPending } = useMutation({
    mutationFn: NachislenieService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      props?.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('create_error'))
    }
  })

  const form = useForm({
    defaultValues
  })

  const handleSubmit = form.handleSubmit((values) => {
    createNachislenie({
      ...values,
      docDate: formatLocaleDate(values.docDate),
      mainSchetId,
      spravochnikBudjetNameId
    })
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[700px]">
          <Form {...form}>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="h-full flex flex-col gap-5"
            >
              <div className="flex flex-wrap gap-5">
                <FormField
                  control={form.control}
                  name="docNum"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('doc_num')}
                    >
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="docDate"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('doc_date')}
                    >
                      <JollyDatePicker
                        {...field}
                        onChange={(value) => {
                          field.onChange(value)
                          if (value) {
                            const date = parseDate(value)
                            form.setValue('nachislenieYear', date.getFullYear())
                            form.setValue('nachislenieMonth', date.getMonth() + 1)
                          }
                        }}
                      />
                    </FormElement>
                  )}
                />

                <div className="flex items-center gap-5">
                  <FormField
                    control={form.control}
                    name="nachislenieYear"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('year')}
                      >
                        <YearSelect
                          isReadOnly
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nachislenieMonth"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('month')}
                      >
                        <MonthSelect
                          isReadOnly
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                          className="w-32"
                        />
                      </FormElement>
                    )}
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 rounded-lg border p-2.5 flex flex-col gap-2.5">
                <div>
                  <SearchInputDebounced
                    value={search}
                    onValueChange={setSearch}
                  />
                </div>
                <div className="flex-1 overflow-y-auto scrollbar">
                  {isFetching ? <LoadingOverlay /> : null}
                  <GenericTable
                    columnDefs={TabelColumnDefs}
                    data={tabels?.data ?? []}
                    selectedIds={form.watch('tabelMainId') ? [form.watch('tabelMainId')] : []}
                    onClickRow={(value) => form.setValue('tabelMainId', value.id)}
                    className="table-generic-xs"
                  />
                </div>
              </div>

              <div className="px-5 text-end">
                <Button
                  type="submit"
                  isPending={isPending}
                >
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
