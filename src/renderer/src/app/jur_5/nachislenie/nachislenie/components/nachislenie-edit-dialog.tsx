import type { VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import type { Nachislenie } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect, useState } from 'react'

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
// import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { YearSelect } from '@/common/components/year-select'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatDate, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'

import { defaultValues } from '../config'
import { NachislenieService } from '../service'

enum TabOptions {
  View = 'view',
  Update = 'update'
}

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

  const budjetId = useRequisitesStore((store) => store.budjet_id)

  const [tabValue, setTabValue] = useState(TabOptions.View)

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

  useEffect(() => {
    if (selectedNachislenie) {
      form.reset({
        ...selectedNachislenie,
        docDate: formatDate(parseLocaleDate(selectedNachislenie.docDate))
      })
    }
  }, [form, selectedNachislenie])

  const Header = () => {
    return (
      <div className="flex items-center gap-5">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(() => {})}
            className="flex flex-row items-center gap-5"
          >
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
          </form>
        </Form>

        <div className="ml-auto flex flex-wrap items-center gap-1">
          <DownloadFile
            isZarplata
            url="Nachislenie/vedemost"
            params={{
              mainId: selectedNachislenie.id
            }}
            fileName={`zarplata_vedemost_${selectedNachislenie.docNum}.xlsx`}
            buttonText={t('vedemost')}
          />
          <DownloadFile
            isZarplata
            url="Excel/svod-otchet"
            params={{
              mainId: selectedNachislenie.id
            }}
            fileName={`zarplata_svod_${selectedNachislenie.docNum}.xlsx`}
            buttonText={t('aggregated_report')}
          />
          <DownloadFile
            isZarplata
            url="Excel/inps-otchet"
            params={{
              spBudnameId: budjetId,
              year: form.watch('nachislenieYear'),
              month: form.watch('nachislenieMonth')
            }}
            fileName={`inps_${selectedNachislenie.docNum}.xlsx`}
            buttonText={t('inps')}
          />
          <DownloadFile
            isZarplata
            url="Excel/podoxod-otchet"
            params={{
              spBudnameId: budjetId,
              year: form.watch('nachislenieYear'),
              month: form.watch('nachislenieMonth')
            }}
            fileName={`podoxod_${selectedNachislenie.docNum}.xlsx`}
            buttonText={t('podoxod')}
          />
          <DownloadFile
            isZarplata
            url="Excel/plastik-otchet"
            params={{
              mainId: selectedNachislenie.id
            }}
            fileName={`plastik_${selectedNachislenie.docNum}.xlsx`}
            buttonText={t('plastik')}
          />
        </div>
      </div>
    )
  }

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-full">
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader className="flex flex-row items-center gap-10">
              <DialogTitle>{t('nachislenie')}</DialogTitle>
              {/* <Tabs
                value={tabValue}
                onValueChange={(value) => setTabValue(value as TabOptions)}
              >
                <TabsList>
                  <TabsTrigger value={TabOptions.View}>{t('view')}</TabsTrigger>
                  <TabsTrigger value={TabOptions.Update}>{t('update')}</TabsTrigger>
                </TabsList>
              </Tabs> */}
            </DialogHeader>

            {tabValue === TabOptions.View && (
              <div className="relative mt-5 flex-1 mih-h-0 flex flex-col gap-5 overflow-hidden">
                <Header />
                <div className="relative overflow-y-auto scrollbar">
                  {isFetching ? <LoadingOverlay /> : null}

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
                            <div>
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
                            </div>
                            <div>
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
                      </div>
                    )}
                  </CollapsibleTable>
                </div>
              </div>
            )}
            {tabValue === TabOptions.Update && (
              <NachislenieUpdateForm
                selectedNachislenie={selectedNachislenie}
                vacant={vacant}
              />
            )}
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export interface NachislenieUpdateFormProps extends Omit<DialogTriggerProps, 'children'> {
  selectedNachislenie: Nachislenie
  vacant: VacantTreeNode
}
const NachislenieUpdateForm: FC<NachislenieUpdateFormProps> = ({ selectedNachislenie, vacant }) => {
  const budjetId = useRequisitesStore((store) => store.budjet_id)

  const { t } = useTranslation(['app'])

  const [currentIndex, setCurrentIndex] = useState(0)

  const { data: nachislenie, isFetching } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetById,
      selectedNachislenie.id,
      { vacantId: vacant.id }
    ],
    queryFn: NachislenieService.getById,
    enabled: !!selectedNachislenie.id
  })
  const currentNachislenie = nachislenie?.[currentIndex]

  const form = useForm({
    defaultValues
  })

  useEffect(() => {
    if (selectedNachislenie) {
      form.reset({
        ...selectedNachislenie,
        docDate: formatDate(parseLocaleDate(selectedNachislenie.docDate))
      })
    }
  }, [form, selectedNachislenie])

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(console.log)}
        className="relative mt-5 flex-1 h-full flex flex-col gap-5 overflow-y-auto scrollbar"
      >
        {isFetching ? <LoadingOverlay /> : null}

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

          <div className="flex flex-wrap items-center gap-1">
            <DownloadFile
              isZarplata
              url="Nachislenie/vedemost"
              params={{
                mainId: selectedNachislenie.id
              }}
              fileName={`zarplata_vedemost_${selectedNachislenie.docNum}.xlsx`}
              buttonText={t('vedemost')}
            />
            <DownloadFile
              isZarplata
              url="Excel/svod-otchet"
              params={{
                mainId: selectedNachislenie.id
              }}
              fileName={`zarplata_svod_${selectedNachislenie.docNum}.xlsx`}
              buttonText={t('aggregated_report')}
            />
            <DownloadFile
              isZarplata
              url="Excel/inps-otchet"
              params={{
                spBudnameId: budjetId,
                year: form.watch('nachislenieYear'),
                month: form.watch('nachislenieMonth')
              }}
              fileName={`inps_${selectedNachislenie.docNum}.xlsx`}
              buttonText={t('inps')}
            />
            <DownloadFile
              isZarplata
              url="Excel/podoxod-otchet"
              params={{
                spBudnameId: budjetId,
                year: form.watch('nachislenieYear'),
                month: form.watch('nachislenieMonth')
              }}
              fileName={`podoxod_${selectedNachislenie.docNum}.xlsx`}
              buttonText={t('podoxod')}
            />
            <DownloadFile
              isZarplata
              url="Excel/plastik-otchet"
              params={{
                mainId: selectedNachislenie.id
              }}
              fileName={`plastik_${selectedNachislenie.docNum}.xlsx`}
              buttonText={t('plastik')}
            />
          </div>
        </div>

        <div className="relative overflow-hidden py-5 flex flex-col gap-2.5">
          <div className="p-5 rounded-lg border">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
              <div>
                <GenericTable
                  data={currentNachislenie?.nachisleniePayrollPayments ?? []}
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
                          currentNachislenie?.nachisleniePayrollPayments?.reduce(
                            (result, { summa }) => result + (summa ?? 0),
                            0
                          ) ?? 0
                        )}
                      />
                    </FooterRow>
                  }
                />
              </div>
              <div>
                <GenericTable
                  data={currentNachislenie?.nachisleniePayrollDeductions ?? []}
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
                          currentNachislenie?.nachisleniePayrollDeductions?.reduce(
                            (result, { summa }) => result + (summa ?? 0),
                            0
                          ) ?? 0
                        )}
                      />
                    </FooterRow>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
