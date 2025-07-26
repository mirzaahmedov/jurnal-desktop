import type { VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import type { Nachislenie } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { YearSelect } from '@/common/components/year-select'
import { formatDate, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'

import { defaultValues } from '../config'
import { NachislenieService } from '../service'

export interface NachislenieEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedNachislenie: Nachislenie
  vacant: VacantTreeNode
}
export const NachislenieEditDialog = ({
  selectedNachislenie,
  vacant,
  ...props
}: NachislenieEditDialogProps) => {
  const { t } = useTranslation(['app'])

  const { data: nachislenie, isFetching } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetById,
      selectedNachislenie.id,
      { vacantId: vacant.id }
    ],
    queryFn: NachislenieService.getById,
    enabled: !!selectedNachislenie.id
  })

  const form = useForm({
    defaultValues
  })

  const handleSubmit = form.handleSubmit(console.log)

  useEffect(() => {
    if (selectedNachislenie) {
      form.reset({
        ...selectedNachislenie,
        docDate: formatDate(parseLocaleDate(selectedNachislenie.docDate))
      })
    }
  }, [form, selectedNachislenie])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="relative w-full max-w-8xl h-full max-h-[600px]">
          {isFetching ? <LoadingOverlay /> : null}
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('nachislenie')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                noValidate
                onSubmit={handleSubmit}
                className="mt-5 flex-1 h-full flex flex-col gap-5 overflow-y-auto scrollbar"
              >
                <div className="flex items-center gap-5">
                  <FormField
                    control={form.control}
                    name="docNum"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('doc_num')}
                      >
                        <Input
                          readOnly
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
                          readOnly
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

                <CollapsibleTable
                  data={nachislenie ?? []}
                  columnDefs={[
                    {
                      key: 'fio'
                    },
                    {
                      key: 'doljnostName',
                      header: 'doljnost'
                    },
                    {
                      key: 'kartochka'
                    },
                    {
                      width: 200,
                      key: 'totalNachislenie',
                      header: 'nachislenie',
                      renderCell: ({ totalNachislenie }) => <SummaCell summa={totalNachislenie} />
                    },
                    {
                      width: 200,
                      key: 'totalUderjanie',
                      header: 'uderjanie',
                      renderCell: ({ totalUderjanie }) => <SummaCell summa={totalUderjanie} />
                    },
                    {
                      width: 200,
                      key: 'totalNaruki',
                      header: 'na_ruki',
                      renderCell: ({ totalNaruki }) => <SummaCell summa={totalNaruki} />
                    }
                  ]}
                  classNames={{
                    header: 'z-100'
                  }}
                  getRowId={(row) => row.id}
                  className="table-generic-xs"
                >
                  {({ row }) => (
                    <div className="relative overflow-hidden py-5 flex flex-col gap-2.5">
                      <div className="p-5 rounded-lg border">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                          <GenericTable
                            data={row?.nachisleniePayrollPayments ?? []}
                            columnDefs={[
                              {
                                key: 'name'
                              },
                              {
                                key: 'percentage',
                                header: 'foiz'
                              },
                              {
                                key: 'summa',
                                renderCell: (row) => <SummaCell summa={row.summa} />,
                                numeric: true
                              }
                            ]}
                            className="table-generic-xs border-t border-l"
                            footer={
                              <FooterRow>
                                <FooterCell
                                  title={t('total')}
                                  colSpan={3}
                                />
                                <FooterCell
                                  content={formatNumber(
                                    row?.nachisleniePayrollPayments?.reduce(
                                      (result, { summa }) => result + (summa ?? 0),
                                      0
                                    )
                                  )}
                                />
                              </FooterRow>
                            }
                          />
                          <GenericTable
                            data={row?.nachisleniePayrollDeductions ?? []}
                            columnDefs={[
                              {
                                key: 'name'
                              },
                              {
                                key: 'percentage',
                                header: 'foiz'
                              },
                              {
                                key: 'summa',
                                renderCell: (row) => <SummaCell summa={row.summa} />,
                                numeric: true
                              }
                            ]}
                            className="table-generic-xs border-t border-l"
                            footer={
                              <FooterRow>
                                <FooterCell
                                  title={t('total')}
                                  colSpan={3}
                                />
                                <FooterCell
                                  content={formatNumber(
                                    row?.nachisleniePayrollDeductions?.reduce(
                                      (result, { summa }) => result + (summa ?? 0),
                                      0
                                    )
                                  )}
                                />
                              </FooterRow>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleTable>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
