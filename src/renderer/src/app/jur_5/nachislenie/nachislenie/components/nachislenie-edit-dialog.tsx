import type { MainZarplata, NachislenieProvodka } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect, useState } from 'react'

import { TreeViewIcon } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { Download, Plus, Search, Sigma, UserSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { useMainZarplataList } from '@/app/jur_5/common/features/main-zarplata/use-fetchers'
import { MainZarplataInfo } from '@/app/jur_5/passport-info/components'
import { OtdelniyRaschetColumnDefs } from '@/app/jur_5/passport-info/otdelniy-raschet/columns'
import { OtdelniyRaschetService } from '@/app/jur_5/passport-info/otdelniy-raschet/service'
import {
  FooterCell,
  FooterRow,
  GenericTable,
  LoadingOverlay,
  NumericInput
} from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { ContentStepper } from '@/common/components/content-stepper'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { PDFSaver } from '@/common/components/pdf-saver'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { YearSelect } from '@/common/components/year-select'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { useZarplataStore } from '@/common/features/zarplata/store'
import { useToggle } from '@/common/hooks'
import { formatDate, parseLocaleDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import {
  type NachislenieDeductionDto,
  type NachisleniePaymentDto
} from '@/common/models/nachislenie'

import { defaultValues } from '../config'
import { type NachislenieCreateChildPayload, NachislenieService } from '../service'
import { NachislenieOtdelniyRaschetDialog } from './nachislenie-otdelniy-raschet-dialog'
import { NachisleniePaymentDialog } from './nachislenie-payments-dialog'

enum TabOptions {
  View = 'view',
  Update = 'update',
  OtdelniyRaschet = 'OtdelniyRaschet'
}

export interface NachislenieEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  nachislenieId: number | undefined
  vacant: VacantTreeNode | undefined
  onDateChange?: (date: Date) => void
}
export const NachislenieEditDialog = ({
  nachislenieId,
  vacant,
  onDateChange,
  ...props
}: NachislenieEditDialogProps) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { openMainZarplataView } = useZarplataStore()

  const [tabValue, setTabValue] = useState(TabOptions.View)
  const [comboValue, setComboValue] = useState(null)
  const [mainZarplataId, setMainZarplataId] = useState<number | null>(null)
  const [otdelniyRaschetData, setOtdelniyRaschetData] = useState<any>(null)
  const [, setSearchParams] = useSearchParams()

  const comboModal = useToggle()
  const createChildModal = useToggle()
  const queryClient = useQueryClient()

  const nachislenieMainQuery = useQuery({
    queryKey: [NachislenieService.QueryKeys.GetMainById, nachislenieId!],
    queryFn: NachislenieService.getMainById,
    enabled: !!nachislenieId
  })
  const nachislenieData = nachislenieMainQuery.data
  const nachislenieQuery = useQuery({
    queryKey: [NachislenieService.QueryKeys.GetById, nachislenieId!, { vacantId: vacant?.id }],
    queryFn: NachislenieService.getById,
    enabled: !!nachislenieId
  })
  const nachislenieProvodka = nachislenieQuery?.data ?? []

  const otdelniyRaschetQuery = useQuery({
    queryKey: [
      OtdelniyRaschetService.QueryKeys.GetByMonthly,
      {
        spravochnikBudjetNameId: nachislenieData?.spravochnikBudjetNameId ?? 0,
        nachislenieYear: nachislenieData?.nachislenieYear ?? 0,
        nachislenieMonth: nachislenieData?.nachislenieMonth ?? 0
      }
    ],
    queryFn: () =>
      OtdelniyRaschetService.getByMonthly(
        nachislenieData?.spravochnikBudjetNameId ?? 0,
        nachislenieData?.nachislenieYear ?? 0,
        nachislenieData?.nachislenieMonth ?? 0
      ),
    enabled:
      !!nachislenieData?.spravochnikBudjetNameId &&
      !!nachislenieData?.nachislenieYear &&
      !!nachislenieData?.nachislenieMonth &&
      tabValue === TabOptions.OtdelniyRaschet
  })

  const deleteChildMutation = useMutation({
    mutationFn: NachislenieService.deleteChild,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetById, nachislenieId!]
      })
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetMainById, nachislenieId!]
      })
    }
  })

  const currentIndex =
    nachislenieProvodka.findIndex((i) => i.mainZarplataId === mainZarplataId) ?? 0

  const getChildByDates = useMutation({
    mutationFn: NachislenieService.getChildByDates
  })

  const form = useForm<{
    docNum: number
    docDate: string
    nachislenieYear: number | undefined
    nachislenieMonth: number | undefined
  }>({
    defaultValues: {
      docNum: 0,
      docDate: '',
      nachislenieYear: undefined,
      nachislenieMonth: undefined
    }
  })

  useEffect(() => {
    if (nachislenieData) {
      form.reset({
        ...nachislenieData,
        docDate: formatDate(parseLocaleDate(nachislenieData?.docDate))
      })
    }
  }, [form, nachislenieData])
  useEffect(() => {
    if (nachislenieProvodka?.findIndex((i) => i.mainZarplataId === mainZarplataId) !== -1) {
      return
    }
    if (nachislenieProvodka.length) {
      setMainZarplataId(nachislenieProvodka[0].mainZarplataId)
    }
  }, [nachislenieProvodka, mainZarplataId])
  useEffect(() => {
    if (!props.isOpen) {
      setTabValue(TabOptions.View)
    }
  }, [props?.isOpen])

  const handleSearchMainZarplata = (id: number | null) => {
    if (id) {
      setMainZarplataId(id)
    }
    setComboValue(null)
    comboModal.close()
  }

  const handleChangeDates = ({ year, month }: { year: number; month: number }) => {
    const nachislenie = nachislenieProvodka?.[currentIndex]
    if (!nachislenie?.mainZarplataId || !year || !month) return
    getChildByDates.mutate(
      {
        year,
        month,
        mainZarplataId: nachislenie.mainZarplataId
      },
      {
        onSuccess: (res) => {
          setSearchParams({
            nachislenieId: res.nachislenieMainId.toString()
          })
          onDateChange?.(new Date(year, month - 1, 1))
        }
      }
    )
  }

  const handleDeleteChild = (row: NachislenieProvodka) => {
    confirm({
      onConfirm() {
        deleteChildMutation.mutate(row.id)
      }
    })
  }

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
                    selectedKey={field.value}
                    onSelectionChange={(value) => {
                      const year = value ? Number(value) : 0
                      field.onChange(year)
                      handleChangeDates({
                        year,
                        month: form.getValues('nachislenieMonth') ?? 0
                      })
                    }}
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
                    selectedKey={field.value}
                    onSelectionChange={(value) => {
                      const month = value ? Number(value) : 0
                      handleChangeDates({ year: form.getValues('nachislenieYear') ?? 0, month })
                    }}
                    className="w-32"
                  />
                </FormElement>
              )}
            />
          </form>
        </Form>

        {nachislenieData ? (
          <div className="flex items-center gap-2.5 ml-auto pdf-hidden">
            <DownloadFile
              isZarplata
              url="Nachislenie/vedemost"
              params={{
                mainId: nachislenieId
              }}
              fileName={`zarplata_vedemost_${nachislenieData?.docNum}_${nachislenieData?.docDate}.xlsx`}
              buttonText={t('vedemost')}
            />
            <DownloadFile
              isZarplata
              url="Excel/svod-otchet"
              params={{
                mainId: nachislenieId
              }}
              fileName={`zarplata_svod_${nachislenieData?.docNum}_${nachislenieData?.docDate}.xlsx`}
              buttonText={t('aggregated_report')}
            />
            <DownloadFile
              isZarplata
              url="Excel/inps-otchet-byMainId"
              params={{
                mainId: nachislenieId
              }}
              fileName={`zarplata_inps_${nachislenieData?.docNum}_${nachislenieData?.docDate}.xlsx`}
              buttonText={t('inps')}
            />
            <DownloadFile
              isZarplata
              url="Excel/plastik-otchet-byMainId"
              params={{
                mainId: nachislenieId
              }}
              fileName={`zarplata_plastik_${nachislenieData?.docNum}_${nachislenieData?.docDate}.xlsx`}
              buttonText={t('plastik')}
            />
            <DownloadFile
              isZarplata
              url="Excel/shapka-vedemost"
              params={{
                mainId: nachislenieId
              }}
              fileName={`${t('cap')}_${nachislenieData?.docNum}_${nachislenieData?.docDate}.xlsx`}
              buttonText={t('cap')}
            />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-full h-full max-h-full px-0">
            <div className="h-full flex flex-col overflow-hidden">
              <DialogHeader className="flex flex-row items-center gap-10 px-5">
                <DialogTitle>{t('nachislenie')}</DialogTitle>
                <Tabs
                  value={tabValue}
                  onValueChange={(value) => {
                    setTabValue(value as TabOptions)
                    comboModal.close()
                  }}
                >
                  <TabsList>
                    <TabsTrigger value={TabOptions.View}>{t('view')}</TabsTrigger>
                    <TabsTrigger value={TabOptions.Update}>{t('update')}</TabsTrigger>
                    <TabsTrigger value={TabOptions.OtdelniyRaschet}>
                      {t('otdelniy_raschet')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {tabValue === TabOptions.Update && (
                  <div className="flex items-center bg-gray-100 rounded-md">
                    <JollyComboBox
                      hideLabel
                      defaultItems={nachislenieProvodka}
                      selectedKey={comboValue}
                      menuTrigger="focus"
                      inputProps={{
                        onClick: () => comboModal.open()
                      }}
                      onOpenChange={comboModal.setOpen}
                      onSelectionChange={(value) =>
                        handleSearchMainZarplata(value ? Number(value) : null)
                      }
                      popoverProps={{
                        isOpen: comboModal.isOpen
                      }}
                      className="mt-0"
                    >
                      {(item) => (
                        <ComboboxItem
                          id={item.mainZarplataId}
                          textValue={`${item.kartochka} ${item.fio}`}
                        >
                          №{item.kartochka} {item.fio}
                        </ComboboxItem>
                      )}
                    </JollyComboBox>
                    <div className="size-10 grid place-items-center">
                      <Search className="btn-icon text-gray-400" />
                    </div>
                  </div>
                )}
                {tabValue === TabOptions.View && (
                  <Button
                    IconStart={Plus}
                    className="ml-auto"
                    onPress={() => createChildModal.open()}
                  >
                    {t('add')}
                  </Button>
                )}
              </DialogHeader>

              {tabValue === TabOptions.View && (
                <div className="relative mt-5 flex-1 mih-h-0 flex flex-col gap-5 overflow-hidden">
                  <div className="px-5">
                    <Header />
                  </div>
                  <div className="relative overflow-y-auto scrollbar">
                    {nachislenieQuery.isFetching ? <LoadingOverlay /> : null}

                    <CollapsibleTable
                      data={nachislenieProvodka ?? []}
                      columnDefs={[
                        {
                          key: '',
                          minWidth: (nachislenieProvodka ?? []).length.toString().length * 50,
                          width: (nachislenieProvodka ?? []).length.toString().length * 50,
                          maxWidth: (nachislenieProvodka ?? []).length.toString().length * 50,
                          renderCell: (...args) => args[3] + 1
                        },
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
                          renderCell: ({ totalNachislenie }) => (
                            <SummaCell summa={totalNachislenie} />
                          )
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
                      onDelete={handleDeleteChild}
                      getRowId={(row) => row.id}
                      actions={(row) => (
                        <Button
                          size="icon"
                          variant="ghost"
                          onPress={() => {
                            openMainZarplataView(row.mainZarplataId)
                          }}
                          className="-my-5"
                        >
                          <UserSquare className="btn-icon" />
                        </Button>
                      )}
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
                <PDFSaver
                  filename={`nachislenie_${nachislenieData?.docNum}_${nachislenieData?.docDate}.pdf`}
                >
                  {({ ref, isPending, savePDF }) => (
                    <div
                      ref={ref}
                      className="relative mt-5 flex-1 mih-h-0 flex flex-col gap-5 overflow-hidden"
                    >
                      <div className="px-5">
                        <Header />
                      </div>
                      <NachislenieUpdateForm
                        currentIndex={currentIndex}
                        onNavigateItem={(index) => {
                          setMainZarplataId(nachislenieProvodka?.[index]?.mainZarplataId ?? null)
                        }}
                        nachislenieProvodka={nachislenieProvodka}
                        nachislenieMainId={nachislenieData?.id ?? 0}
                        isDownloading={isPending}
                        downloadPDF={savePDF}
                      />
                    </div>
                  )}
                </PDFSaver>
              )}
              {tabValue === TabOptions.OtdelniyRaschet && (
                <div className="relative mt-5 flex-1 mih-h-0 flex flex-col gap-5 overflow-hidden">
                  <CollapsibleTable
                    getRowId={(row) => row.id}
                    columnDefs={[
                      {
                        key: 'docNum',
                        header: 'doc_num'
                      },
                      {
                        key: 'docDate',
                        header: 'doc_date'
                      },
                      {
                        key: 'fio'
                      },
                      {
                        key: 'doljnost'
                      },
                      {
                        key: 'nachislenieYear',
                        header: 'year'
                      },
                      {
                        key: 'nachislenieMonth',
                        header: 'month'
                      },
                      {
                        key: 'rabDni',
                        header: 'workdays'
                      },
                      {
                        key: 'otrabDni',
                        header: 'worked_days'
                      },
                      {
                        numeric: true,
                        key: 'nachislenieSum',
                        header: 'nachislenie',
                        className: 'font-black'
                      },
                      {
                        numeric: true,
                        key: 'uderjanieSum',
                        header: 'uderjanie',
                        className: 'font-black'
                      },
                      {
                        numeric: true,
                        key: 'naRukiSum',
                        header: 'na_ruki',
                        className: 'font-black'
                      }
                    ]}
                    data={otdelniyRaschetQuery?.data ?? []}
                    className="table-generic-xs"
                  >
                    {({ row }) => (
                      <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] p-5 gap-5">
                        <div className="bg-teal-700 p-5 rounded-xl h-full flex flex-col">
                          <div className="flex items-center justify-between gap-5 mb-4">
                            <h2 className="text-xl text-white font-medium mb-2">
                              {t('nachislenie')}
                            </h2>
                          </div>
                          <div className="flex-1 overflow-auto scrollbar">
                            <GenericTable
                              data={row.otdelniyRaschetPaymentDtos ?? []}
                              columnDefs={[
                                {
                                  key: 'paymentName',
                                  header: 'name'
                                },
                                {
                                  key: 'percentage',
                                  header: 'foiz'
                                },
                                {
                                  numeric: true,
                                  key: 'summa',
                                  renderCell: (row) => <SummaCell summa={row.summa} />
                                }
                              ]}
                              className="table-generic-xs shadow-md rounded overflow-hidden"
                            />
                          </div>
                        </div>
                        <div className="bg-teal-700 p-5 rounded-xl">
                          <div className="flex items-center justify-between gap-5 mb-4">
                            <h2 className="text-xl text-white font-medium mb-2">
                              {t('uderjanie')}
                            </h2>
                          </div>
                          <GenericTable
                            data={row.otdelniyRaschetDeductionDtos ?? []}
                            columnDefs={[
                              {
                                key: 'deductionName',
                                header: 'name'
                              },
                              {
                                key: 'percentage',
                                header: 'foiz'
                              },
                              {
                                numeric: true,
                                key: 'summa',
                                renderCell: (row) => <SummaCell summa={row.summa} />
                              }
                            ]}
                            className="table-generic-xs shadow-md rounded overflow-hidden"
                          />
                        </div>
                      </div>
                    )}
                  </CollapsibleTable>
                </div>
              )}
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <NachislenieCreateDialog
        mainId={nachislenieId!}
        isOpen={createChildModal.isOpen}
        onOpenChange={createChildModal.setOpen}
      />
      <NachislenieOtdelniyRaschetDialog
        isOpen={!!otdelniyRaschetData}
        onOpenChange={(state) => {
          if (!state) setOtdelniyRaschetData(null)
        }}
        data={otdelniyRaschetData}
      />
    </>
  )
}

export interface NachislenieUpdateFormProps extends Omit<DialogTriggerProps, 'children'> {
  currentIndex: number
  onNavigateItem: (index: number) => void
  nachislenieMainId: number
  nachislenieProvodka: NachislenieProvodka[]
  isDownloading: boolean
  downloadPDF: () => void
}
const NachislenieUpdateForm: FC<NachislenieUpdateFormProps> = ({
  currentIndex,
  onNavigateItem,
  nachislenieMainId,
  nachislenieProvodka,
  isDownloading,
  downloadPDF
}) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [paymentData, setPaymentData] = useState<NachisleniePaymentDto>()
  const [deductionData, setDeductionData] = useState<NachislenieDeductionDto>()

  const paymentToggle = useToggle()
  const deductionToggle = useToggle()

  const currentNachislenie = nachislenieProvodka?.[currentIndex]
  const nachislenieQuery = useQuery({
    queryKey: [NachislenieService.QueryKeys.GetChildById, currentNachislenie?.id],
    queryFn: () => NachislenieService.getChildById(currentNachislenie?.id)
  })
  const nachislenie = nachislenieQuery?.data

  const deletePaymentMutation = useMutation({
    mutationFn: NachislenieService.deletePayment,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetChildById, currentNachislenie?.id]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const deleteDeductionMutation = useMutation({
    mutationFn: NachislenieService.deleteDeduction,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetChildById, currentNachislenie?.id]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const queryClient = useQueryClient()
  const updateChildNachislenie = useMutation({
    mutationFn: (values: {
      id: number
      mainZarplataId: number
      fio: string
      doljnost: string
      rabDni: number
      otrabDni: number
      noch: number
      prazdnik: number
      pererabodka: number
      kazarma: number
    }) => NachislenieService.updateChild(currentNachislenie?.id, values),
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetChildById, currentNachislenie?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetById, currentNachislenie?.id]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const calculateChild = useMutation({
    mutationFn: (childId: number) => NachislenieService.calculateChild(childId),
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetChildById, currentNachislenie?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetById, currentNachislenie?.id]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const form = useForm({
    defaultValues
  })

  return (
    <>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(console.log)}
          className="relative flex-1 h-full flex flex-col gap-5 overflow-y-auto scrollbar"
        >
          <div className="relative flex flex-col">
            {nachislenie ? <MainZarplataInfo mainZarplataId={nachislenie?.mainZarplataId} /> : null}
            <div className="p-5">
              <div className="flex items-end flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="rabDni"
                  render={({ field }) => (
                    <FormElement
                      label={t('workdays')}
                      direction="column"
                      className="max-w-32"
                      hideDescription
                    >
                      <NumericInput
                        ref={field.ref}
                        value={nachislenie?.tabel?.rabDni || 0}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otrabDni"
                  render={({ field }) => (
                    <FormElement
                      label={t('worked_days')}
                      direction="column"
                      className="max-w-32"
                      hideDescription
                    >
                      <NumericInput
                        ref={field.ref}
                        value={nachislenie?.tabel?.otrabDni || 0}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noch"
                  render={({ field }) => (
                    <FormElement
                      label={t('night_shift')}
                      direction="column"
                      className="max-w-32"
                      hideDescription
                    >
                      <NumericInput
                        ref={field.ref}
                        value={nachislenie?.tabel?.noch || 0}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prazdnik"
                  render={({ field }) => (
                    <FormElement
                      label={t('holiday')}
                      direction="column"
                      className="max-w-32"
                      hideDescription
                    >
                      <NumericInput
                        ref={field.ref}
                        value={nachislenie?.tabel?.prazdnik || 0}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pererabodka"
                  render={({ field }) => (
                    <FormElement
                      label={t('overtime')}
                      direction="column"
                      className="max-w-32"
                      hideDescription
                    >
                      <NumericInput
                        ref={field.ref}
                        value={nachislenie?.tabel?.pererabodka || 0}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kazarma"
                  render={({ field }) => (
                    <FormElement
                      label={t('kazarma')}
                      direction="column"
                      className="max-w-32"
                      hideDescription
                    >
                      <NumericInput
                        ref={field.ref}
                        value={nachislenie?.tabel?.kazarma || 0}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <Button
                  onClick={downloadPDF}
                  isDisabled={isDownloading}
                  className="pdf-hidden ml-auto"
                  IconStart={Download}
                >
                  {t('download_as_pdf')}
                </Button>

                <Button
                  type="button"
                  onPress={() => {
                    updateChildNachislenie.mutate({
                      id: nachislenie?.tabel?.id ?? 0,
                      doljnost: nachislenie?.doljnostName ?? '',
                      fio: nachislenie?.fio ?? '',
                      kazarma: form.getValues('kazarma'),
                      noch: form.getValues('noch'),
                      rabDni: form.getValues('rabDni'),
                      otrabDni: form.getValues('otrabDni'),
                      prazdnik: form.getValues('prazdnik'),
                      pererabodka: form.getValues('pererabodka'),
                      mainZarplataId: nachislenie?.mainZarplataId ?? 0
                    })
                  }}
                  className="pdf-hidden"
                  isPending={updateChildNachislenie.isPending}
                >
                  <Sigma className="btn-icon icon-start" /> {t('recalculate_from_passport')}
                </Button>
              </div>
            </div>
            <div className="flex-1 px-5 grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-5">
              <div className="bg-teal-700 p-5 rounded-xl h-full flex flex-col">
                <div className="flex items-center justify-between gap-5 mb-4">
                  <h2 className="text-xl text-white font-medium mb-2">{t('nachislenie')}</h2>
                  <Button
                    className="-my-10 pdf-hidden"
                    onPress={() => {
                      setPaymentData(undefined)
                      paymentToggle.open()
                    }}
                  >
                    <Plus className="btn-icon icon-start" /> {t('add')}
                  </Button>
                </div>
                <div className="flex-1 overflow-auto scrollbar">
                  <GenericTable
                    data={nachislenie?.nachisleniePayrollPayments ?? []}
                    columnDefs={[
                      {
                        key: 'name'
                      },
                      {
                        key: 'percentage',
                        header: 'foiz'
                      },
                      {
                        numeric: true,
                        key: 'summa',
                        renderCell: (row) => <SummaCell summa={row.summa} />
                      }
                    ]}
                    className="table-generic-xs shadow-md rounded overflow-hidden"
                    onEdit={(row) => {
                      setPaymentData(row)
                      paymentToggle.open()
                    }}
                    onDelete={(row) => {
                      confirm({
                        onConfirm: () => {
                          deletePaymentMutation.mutate(row.id)
                        }
                      })
                    }}
                    footer={
                      <FooterRow>
                        <FooterCell
                          title={t('total')}
                          colSpan={3}
                        />
                        <FooterCell content={formatNumber(nachislenie?.totalNachislenie ?? 0)} />
                        <FooterCell />
                      </FooterRow>
                    }
                  />
                </div>
              </div>
              <div className="bg-teal-700 p-5 rounded-xl">
                <div className="flex items-center justify-between gap-5 mb-4">
                  <h2 className="text-xl text-white font-medium mb-2">{t('uderjanie')}</h2>
                  <Button
                    className="-my-10 pdf-hidden"
                    onPress={() => {
                      setDeductionData(undefined)
                      deductionToggle.open()
                    }}
                  >
                    <Plus className="btn-icon icon-start" /> {t('add')}
                  </Button>
                </div>
                <GenericTable
                  data={nachislenie?.nachisleniePayrollDeductions ?? []}
                  columnDefs={[
                    {
                      key: 'name'
                    },
                    {
                      key: 'percentage',
                      header: 'foiz'
                    },
                    {
                      numeric: true,
                      key: 'summa',
                      renderCell: (row) => <SummaCell summa={row.summa} />
                    }
                  ]}
                  className="table-generic-xs shadow-md rounded overflow-hidden"
                  onEdit={(row) => {
                    setDeductionData(row)
                    deductionToggle.open()
                  }}
                  onDelete={(row) => {
                    confirm({
                      onConfirm: () => {
                        deleteDeductionMutation.mutate(row.id)
                      }
                    })
                  }}
                  footer={
                    <FooterRow>
                      <FooterCell
                        title={t('total')}
                        colSpan={3}
                      />
                      <FooterCell content={formatNumber(nachislenie?.totalUderjanie ?? 0)} />
                      <FooterCell />
                    </FooterRow>
                  }
                />
              </div>
            </div>
            <div className="px-5 mt-5 flex items-center gap-10">
              <h6 className="font-bold">
                {t('na_ruki')}: {formatNumber(nachislenie?.totalNaruki ?? 0)}
              </h6>
              <Button
                onPress={() => {
                  calculateChild.mutate(nachislenie?.id ?? 0)
                }}
                isPending={calculateChild.isPending}
                className="pdf-hidden"
              >
                <Sigma className="btn-icon icon-start" /> {t('recalculate_salary')}
              </Button>
              <div className="mt-6 ml-auto flex items-center gap-2.5 pdf-only-visible">
                <h5 className="font-bold">{t('podpis')}</h5>
                <span className="inline-block border-b border-b-current w-56 h-5"> </span>
              </div>
            </div>
            <div className="mt-5 pr-5 flex items-center justify-between pdf-hidden">
              <ContentStepper
                currentIndex={currentIndex}
                onIndexChange={onNavigateItem}
                itemsCount={nachislenieProvodka.length}
              />
            </div>
          </div>
        </form>
      </Form>
      {nachislenie ? (
        <>
          <NachisleniePaymentDialog
            mainZarplataId={nachislenie?.mainZarplataId}
            nachislenieId={nachislenieMainId}
            childId={nachislenie.id}
            paymentData={paymentData}
            isOpen={paymentToggle.isOpen}
            onOpenChange={paymentToggle.setOpen}
          />
          <NachisleniePaymentDialog
            isDeduction
            nachislenieId={nachislenieMainId}
            childId={nachislenie.id}
            mainZarplataId={nachislenie?.mainZarplataId}
            paymentData={deductionData}
            isOpen={deductionToggle.isOpen}
            onOpenChange={deductionToggle.setOpen}
          />
        </>
      ) : null}
    </>
  )
}

export interface NachislenieCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainId?: number
}
const NachislenieCreateDialog: FC<NachislenieCreateDialogProps> = ({ mainId, ...props }) => {
  const { t } = useTranslation(['app'])
  const { search, setSearch, filteredTreeNodes, vacantsQuery } = useVacantTreeNodes()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)
  const [selectedMainZarplata, setSelectedMainZarplata] = useState<MainZarplata | null>(null)

  const mainZarplataQuery = useMainZarplataList({ vacantId: selectedVacant?.id ?? undefined })
  const queryClient = useQueryClient()
  const form = useForm<NachislenieCreateChildPayload>({
    defaultValues: {
      mainZarplataId: 0,
      rabDni: 0,
      otrabDni: 0,
      noch: 0,
      prazdnik: 0,
      pererabodka: 0,
      kazarma: 0
    }
  })

  const createChildMutation = useMutation({
    mutationFn: NachislenieService.createChild,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetById, mainId]
      })
      props?.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (!selectedMainZarplata) {
      toast.error(t('select_main_zarplata'))
      return
    }
    createChildMutation.mutate({
      mainId: mainId ?? 0,
      values: {
        mainZarplataId: selectedMainZarplata.id,
        rabDni: values.rabDni ?? 0,
        otrabDni: values.otrabDni ?? 0,
        noch: values.noch ?? 0,
        prazdnik: values.prazdnik ?? 0,
        pererabodka: values.pererabodka ?? 0,
        kazarma: values.kazarma ?? 0
      }
    })
  })

  useEffect(() => {
    if (!props.isOpen) {
      form.reset()
    }
  }, [form, props.isOpen])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-[800px] p-0">
          <div className="flex flex-col">
            <DialogHeader className="p-5">
              <DialogTitle>
                {t('create-something', { something: t('nachislenie').toLowerCase() })}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col px-5"
              >
                <div className="w-full max-w-6xl grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-5 gap-y-2.5 ">
                  <FormField
                    control={form.control}
                    name="rabDni"
                    render={({ field }) => (
                      <FormElement
                        label={t('workdays')}
                        direction="column"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otrabDni"
                    render={({ field }) => (
                      <FormElement
                        label={t('worked_days')}
                        direction="column"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noch"
                    render={({ field }) => (
                      <FormElement
                        label={t('night_shift')}
                        direction="column"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prazdnik"
                    render={({ field }) => (
                      <FormElement
                        label={t('holiday')}
                        direction="column"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pererabodka"
                    render={({ field }) => (
                      <FormElement
                        label={t('overtime')}
                        direction="column"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kazarma"
                    render={({ field }) => (
                      <FormElement
                        label={t('kazarma')}
                        direction="column"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <Allotment className="h-full">
                    <Allotment.Pane
                      preferredSize={300}
                      maxSize={600}
                      minSize={300}
                      className="w-full bg-gray-50"
                    >
                      <div className="relative h-full flex flex-col">
                        {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
                        <VacantTreeSearch
                          search={search}
                          onValueChange={setSearch}
                          treeNodes={filteredTreeNodes}
                        />
                        <div className="flex-1 overflow-auto scrollbar">
                          <VacantTree
                            nodes={filteredTreeNodes}
                            selectedIds={selectedVacant ? [selectedVacant.id] : []}
                            onSelectNode={setSelectedVacant}
                          />
                        </div>
                      </div>
                    </Allotment.Pane>
                    <Allotment.Pane>
                      <div className="relative w-full h-full overflow-auto scrollbar pl-px">
                        {mainZarplataQuery.isFetching && <LoadingOverlay />}
                        <MainZarplataTable
                          data={mainZarplataQuery.data ?? []}
                          selectedIds={selectedMainZarplata ? [selectedMainZarplata.id] : []}
                          onClickRow={(row) => {
                            setSelectedMainZarplata(row)
                          }}
                        />
                      </div>
                    </Allotment.Pane>
                  </Allotment>
                </div>
                <DialogFooter className="p-5">
                  <Button type="submit">{t('save')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
