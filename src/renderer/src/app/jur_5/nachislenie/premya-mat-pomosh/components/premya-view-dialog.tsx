import type { NachislenieOthers, NachislenieOthersProvodka } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { type ColumnDef, GenericTable, NumericInput } from '@/common/components'
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
import { Form } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { YearSelect } from '@/common/components/year-select'
import { DownloadFile } from '@/common/features/file'
import { formatDate, parseLocaleDate } from '@/common/lib/date'

import { defaultValues } from '../config'
import { NachislenieOthersService } from '../service'

export interface PremyaMatPomoshViewDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedPremya: NachislenieOthers | undefined
}
export const PremyaMatPomoshViewDialog = ({
  selectedPremya,
  ...props
}: PremyaMatPomoshViewDialogProps) => {
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const childrenQuery = useQuery({
    queryKey: [NachislenieOthersService.QueryKeys.GetChildren, selectedPremya?.id ?? 0],
    queryFn: NachislenieOthersService.getChildren,
    enabled: !!selectedPremya?.id
  })
  const paymentsQuery = useQuery({
    queryKey: [NachislenieOthersService.QueryKeys.GetPayments, selectedPremya?.id ?? 0],
    queryFn: NachislenieOthersService.getPayments,
    enabled: !!selectedPremya?.id
  })

  const handleSubmit = form.handleSubmit(() => {})

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full p-0">
          <div className="overflow-hidden h-full flex flex-col overflow-y-auto scrollbar">
            <DialogHeader className="p-5">
              <DialogTitle>{t('premya_mat_pomosh')}</DialogTitle>
            </DialogHeader>

            <div className="flex items-end">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-wrap p-5 gap-2.5"
                >
                  <FormElement
                    label={t('doc_num')}
                    direction="column"
                  >
                    <Input
                      readOnly
                      value={selectedPremya?.docNum}
                    />
                  </FormElement>
                  <FormElement
                    label={t('doc_date')}
                    direction="column"
                  >
                    <JollyDatePicker
                      readOnly
                      value={
                        selectedPremya?.docDate
                          ? formatDate(parseLocaleDate(selectedPremya?.docDate ?? ''))
                          : ''
                      }
                    />
                  </FormElement>
                  <FormElement
                    label={t('year')}
                    direction="column"
                  >
                    <YearSelect
                      isReadOnly
                      selectedKey={selectedPremya?.nachislenieYear ?? ''}
                      className="w-40"
                    />
                  </FormElement>
                  <FormElement
                    label={t('month')}
                    direction="column"
                  >
                    <MonthSelect
                      isReadOnly
                      selectedKey={selectedPremya?.nachislenieMonth ?? ''}
                      className="w-48"
                    />
                  </FormElement>
                  <FormElement
                    label={t('given_doc_date')}
                    direction="column"
                  >
                    <JollyDatePicker
                      readOnly
                      value={
                        selectedPremya?.givenDocDate
                          ? formatDate(parseLocaleDate(selectedPremya?.givenDocDate ?? ''))
                          : ''
                      }
                    />
                  </FormElement>

                  <div className="bg-sky-50 border border-sky-200 rounded-lg px-5 py-2 flex items-center gap-5 w-full mr-5">
                    <FormElement
                      label={t('payment_type')}
                      direction="column"
                    >
                      <Input
                        readOnly
                        value={t(selectedPremya?.paymentType ?? '')}
                      />
                    </FormElement>
                    <FormElement
                      label={t('amount')}
                      direction="column"
                    >
                      <NumericInput
                        readOnly
                        value={selectedPremya?.amount ?? 0}
                      />
                    </FormElement>
                    <FormElement
                      label={t('payment')}
                      direction="column"
                      divProps={{
                        className: 'w-full max-w-md'
                      }}
                      className="w-full max-w-md"
                    >
                      <Textarea
                        readOnly
                        rows={2}
                        value={selectedPremya?.paymentName || ''}
                      />
                    </FormElement>
                    <FormElement
                      label={t('opisanie')}
                      direction="column"
                      divProps={{
                        className: 'w-full max-w-md'
                      }}
                      className="w-full max-w-md"
                    >
                      <Textarea
                        readOnly
                        rows={3}
                        value={selectedPremya?.description ?? ''}
                      />
                    </FormElement>
                    {selectedPremya ? (
                      <DownloadFile
                        isZarplata
                        url="Excel/mat-pomoch"
                        params={{
                          mainId: selectedPremya.id
                        }}
                        buttonText={t('vedemost')}
                        fileName={`vedemost_premya_mat_pomosh_${selectedPremya.docNum}.xlsx`}
                        variant="default"
                        className="ml-auto"
                      />
                    ) : null}
                  </div>
                </form>
              </Form>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-5 p-5 pt-0">
              <div className="h-full min-h-[400px] overflow-auto scrollbar">
                <CollapsibleTable
                  data={childrenQuery?.data ?? []}
                  getRowId={(row) => row.id}
                  columnDefs={
                    [
                      {
                        key: 'fio'
                      },
                      {
                        key: 'doljnostName',
                        header: 'doljnost'
                      },
                      {
                        key: 'kartochka',
                        header: 'kartochka'
                      },
                      {
                        key: 'summa',
                        renderCell: (row) => <SummaCell summa={row.summa} />
                      }
                    ] satisfies ColumnDef<NachislenieOthersProvodka>[]
                  }
                  className="table-generic-xs"
                >
                  {({ row }) => (
                    <div className="p-2.5">
                      <GenericTable
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
                        data={row.deductions ?? []}
                      />
                    </div>
                  )}
                </CollapsibleTable>
              </div>
              <div className="h-full min-h-[400px] overflow-auto scrollbar">
                <GenericTable
                  data={paymentsQuery?.data ?? []}
                  columnDefs={[
                    {
                      key: 'paymentName',
                      header: 'name'
                    }
                  ]}
                  className="table-generic-xs"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
