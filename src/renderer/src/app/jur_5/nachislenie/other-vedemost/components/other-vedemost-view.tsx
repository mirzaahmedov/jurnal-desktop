import type { OtherVedemost, OtherVedemostProvodka } from '@/common/models'
import type { PayrollDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Edit, Plus, Search, Sigma } from 'lucide-react'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { type ColumnDef, GenericTable, NumericInput } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { ContentStepper } from '@/common/components/content-stepper'
import { FormElement } from '@/common/components/form'
import { FormElementUncontrolled } from '@/common/components/form/form-element-uncontrolled'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { MonthSelect } from '@/common/components/month-select'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Form } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { Textarea } from '@/common/components/ui/textarea'
import { YearSelect } from '@/common/components/year-select'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import { useToggle } from '@/common/hooks'
import { formatDate, parseLocaleDate } from '@/common/lib/date'

import { type OtherVedemostDeductionFormValues, defaultValues } from '../config'
import { OtherVedemostService } from '../service'
import { type DeductionType, OtherVedemostDeductionDialog } from './other-vedemost-deduction-dialog'

enum TabOptions {
  View = 'view',
  Update = 'update'
}

export interface PremyaMatPomoshViewDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedVedemost: OtherVedemost | undefined
}
export const PremyaMatPomoshViewDialog = ({
  selectedVedemost,
  ...props
}: PremyaMatPomoshViewDialogProps) => {
  const { t } = useTranslation(['app'])

  const [tabValue, setTabValue] = useState<TabOptions>(TabOptions.View)
  const [comboValue, setComboValue] = useState(null)
  const [otherVedemostId, setOtherVedemostId] = useState<number | null>(null)

  const comboToggle = useToggle()

  const form = useForm({
    defaultValues
  })

  const otherVedemostProvodkaQuery = useQuery({
    queryKey: [OtherVedemostService.QueryKeys.GetChildren, selectedVedemost?.id ?? 0],
    queryFn: OtherVedemostService.getChildren,
    enabled: !!selectedVedemost?.id
  })

  const otherVedemostProvodka = otherVedemostProvodkaQuery.data ?? []
  const currentIndex = otherVedemostProvodka.findIndex((i) => i.id === otherVedemostId) ?? 0

  const paymentsQuery = useQuery({
    queryKey: [OtherVedemostService.QueryKeys.GetPayments, selectedVedemost?.id ?? 0],
    queryFn: OtherVedemostService.getPayments,
    enabled: !!selectedVedemost?.id
  })

  const handleSubmit = form.handleSubmit(() => {})

  const handleSearchVedemost = (id: number | null) => {
    if (id) {
      setOtherVedemostId(id)
    }
    setComboValue(null)
    comboToggle.close()
  }

  useEffect(() => {
    if (otherVedemostProvodka?.findIndex((i) => i.id === otherVedemostId) !== -1) {
      return
    }
    if (otherVedemostProvodka.length) {
      setOtherVedemostId(otherVedemostProvodka[0].id)
    }
  }, [otherVedemostProvodka, otherVedemostId])

  const Header = () => {
    return (
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
                value={selectedVedemost?.docNum}
              />
            </FormElement>
            <FormElement
              label={t('doc_date')}
              direction="column"
            >
              <JollyDatePicker
                readOnly
                value={
                  selectedVedemost?.docDate
                    ? formatDate(parseLocaleDate(selectedVedemost?.docDate ?? ''))
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
                selectedKey={selectedVedemost?.nachislenieYear ?? ''}
                className="w-40"
              />
            </FormElement>
            <FormElement
              label={t('month')}
              direction="column"
            >
              <MonthSelect
                isReadOnly
                selectedKey={selectedVedemost?.nachislenieMonth ?? ''}
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
                  selectedVedemost?.givenDocDate
                    ? formatDate(parseLocaleDate(selectedVedemost?.givenDocDate ?? ''))
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
                  value={t(selectedVedemost?.paymentType ?? '')}
                />
              </FormElement>
              <FormElement
                label={t('amount')}
                direction="column"
              >
                <NumericInput
                  readOnly
                  value={selectedVedemost?.amount ?? 0}
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
                  value={selectedVedemost?.paymentName || ''}
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
                  value={selectedVedemost?.description ?? ''}
                />
              </FormElement>

              {selectedVedemost ? (
                <DownloadFile
                  isZarplata
                  url="Excel/mat-pomoch"
                  params={{
                    mainId: selectedVedemost.id
                  }}
                  buttonText={t('vedemost')}
                  fileName={`vedemost_premya_mat_pomosh_${selectedVedemost.docNum}.xlsx`}
                  variant="default"
                  className="ml-auto"
                />
              ) : null}
              {selectedVedemost ? (
                <DownloadFile
                  isZarplata
                  url="Excel/plastik-otchet-others-vedemost"
                  params={{
                    mainId: selectedVedemost.id
                  }}
                  buttonText={t('plastik')}
                  fileName={`plastik_${selectedVedemost.docNum}.xlsx`}
                  variant="default"
                />
              ) : null}
            </div>
          </form>
        </Form>
      </div>
    )
  }

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full p-0">
          <div className="overflow-hidden h-full flex flex-col overflow-y-auto scrollbar">
            <DialogHeader className="p-5 flex flex-row items-center gap-5">
              <DialogTitle>{t('premya_mat_pomosh')}</DialogTitle>

              <Tabs
                value={tabValue}
                onValueChange={(value) => {
                  setTabValue(value as TabOptions)
                  comboToggle.close()
                }}
              >
                <TabsList>
                  <TabsTrigger value={TabOptions.View}>{t('view')}</TabsTrigger>
                  <TabsTrigger value={TabOptions.Update}>{t('update')}</TabsTrigger>
                </TabsList>
              </Tabs>

              {tabValue === TabOptions.Update && (
                <div className="flex items-center bg-gray-100 rounded-md">
                  <JollyComboBox
                    hideLabel
                    defaultItems={otherVedemostProvodka}
                    selectedKey={comboValue}
                    menuTrigger="focus"
                    inputProps={{
                      onClick: () => comboToggle.open()
                    }}
                    onOpenChange={comboToggle.setOpen}
                    onSelectionChange={(value) =>
                      handleSearchVedemost(value ? Number(value) : null)
                    }
                    popoverProps={{
                      isOpen: comboToggle.isOpen
                    }}
                    className="mt-0"
                  >
                    {(item) => (
                      <ComboboxItem
                        id={item.id}
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
            </DialogHeader>

            {tabValue === TabOptions.View ? (
              <>
                <Header />
                <div className="flex-1 min-h-0 grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-5 p-5 pt-0">
                  <div className="h-full min-h-[400px] overflow-auto scrollbar">
                    <CollapsibleTable
                      data={otherVedemostProvodkaQuery?.data ?? []}
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
                        ] satisfies ColumnDef<OtherVedemostProvodka>[]
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
              </>
            ) : null}
            {tabValue === TabOptions.Update ? (
              <>
                <Header />
                <div className="flex-1">
                  <OtherVedemostUpdateForm
                    otherVedemostProvodka={otherVedemostProvodka}
                    currentIndex={currentIndex}
                    onNavigateItem={(index) => {
                      setOtherVedemostId(otherVedemostProvodka?.[index]?.id ?? null)
                    }}
                    otherVedemostMainId={selectedVedemost?.id ?? 0}
                    downloadPDF={() => {}}
                    isDownloading={false}
                  />
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export interface NachislenieUpdateFormProps extends Omit<DialogTriggerProps, 'children'> {
  currentIndex: number
  onNavigateItem: (index: number) => void
  otherVedemostMainId: number
  otherVedemostProvodka: OtherVedemostProvodka[]
  isDownloading: boolean
  downloadPDF: () => void
}
const OtherVedemostUpdateForm: FC<NachislenieUpdateFormProps> = ({
  currentIndex,
  onNavigateItem,
  otherVedemostMainId,
  otherVedemostProvodka,
  isDownloading,
  downloadPDF
}) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [deductionData, setDeductionData] = useState<PayrollDeduction>()
  const [newSumma, setNewSumma] = useState<number>(0)

  const queryClient = useQueryClient()
  const deductionToggle = useToggle()

  const currentVedemost = otherVedemostProvodka?.[currentIndex]
  const vedemostQuery = useQuery({
    queryKey: [OtherVedemostService.QueryKeys.GetChildById, currentVedemost?.id],
    queryFn: OtherVedemostService.getChildById
  })
  const vedemost = vedemostQuery?.data

  const invalidateQueries = () => {
    queryClient.invalidateQueries({})
    queryClient.invalidateQueries({
      queryKey: [OtherVedemostService.QueryKeys.GetChildById, otherVedemostMainId]
    })
  }

  const createDeductionMutation = useMutation({
    mutationFn: OtherVedemostService.createDeduction,
    onSuccess: () => {
      toast.success(t('create_success'))
      invalidateQueries()
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const updateDeductionMutation = useMutation({
    mutationFn: OtherVedemostService.updateDeduction,
    onSuccess: () => {
      toast.success(t('update_success'))
      invalidateQueries()
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const deleteDeductionMutation = useMutation({
    mutationFn: OtherVedemostService.deleteDeduction,
    onSuccess: () => {
      toast.success(t('delete_success'))
      invalidateQueries()
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const updateSummaMutation = useMutation({
    mutationFn: OtherVedemostService.updateSumma,
    onSuccess: () => {
      toast.success(t('update_success'))
      invalidateQueries()
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const calculateChild = useMutation({
    mutationFn: OtherVedemostService.calculateChildById,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [OtherVedemostService.QueryKeys.GetChildById, currentVedemost?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [OtherVedemostService.QueryKeys.GetById, currentVedemost?.id]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const handleSubmitDeduction = (
    values: OtherVedemostDeductionFormValues,
    type: DeductionType,
    form: UseFormReturn<OtherVedemostDeductionFormValues>
  ) => {
    if (!currentVedemost) {
      return
    }
    if (type === 'summa') {
      values.percentage = 0
    } else {
      values.summa = 0
    }

    if (deductionData) {
      updateDeductionMutation.mutate(
        {
          values: {
            ...values,
            mainZarplataId: currentVedemost?.mainZarplataId
          },
          deductionId: deductionData.id
        },
        {
          onSuccess: () => {
            form.reset()
            deductionToggle.close()
            invalidateQueries()
          }
        }
      )
    } else {
      createDeductionMutation.mutate(
        {
          childId: currentVedemost.id,
          values: {
            ...values,
            mainZarplataId: currentVedemost?.mainZarplataId
          }
        },
        {
          onSuccess: () => {
            form.reset()
            deductionToggle.close()
            invalidateQueries()
          }
        }
      )
    }
  }

  useEffect(() => {
    setNewSumma(vedemost?.summa ?? 0)
  }, [vedemost])

  return (
    <>
      <div className="relative flex-1 h-full flex flex-col gap-5 overflow-y-auto scrollbar">
        <div className="relative flex flex-col">
          <div className="p-5">
            <div className="flex items-start flex-wrap gap-4">
              <FormElementUncontrolled
                label={t('card_num')}
                direction="column"
              >
                <Input
                  readOnly
                  value={vedemost?.kartochka}
                />
              </FormElementUncontrolled>
              <FormElementUncontrolled
                label={t('fio')}
                direction="column"
              >
                <Input
                  readOnly
                  value={vedemost?.fio}
                />
              </FormElementUncontrolled>
              <FormElementUncontrolled
                label={t('doljnost')}
                direction="column"
              >
                <Input
                  readOnly
                  value={vedemost?.doljnostName}
                />
              </FormElementUncontrolled>
              <FormElementUncontrolled
                label={t('summa')}
                direction="column"
              >
                <NumericInput
                  readOnly
                  value={vedemost?.summa}
                />
              </FormElementUncontrolled>
              <PopoverTrigger>
                <Button
                  size="icon"
                  className="self-end"
                >
                  <Edit className="btn-icon" />
                </Button>
                <PopoverDialog>
                  {({ close }) => (
                    <Popover className="p-5">
                      <FormElementUncontrolled
                        label={t('summa')}
                        direction="column"
                      >
                        <NumericInput
                          value={newSumma}
                          onValueChange={(values) => setNewSumma(values.floatValue ?? 0)}
                        />
                      </FormElementUncontrolled>
                      <Button
                        type="button"
                        className="w-full mt-2.5"
                        onPress={() => {
                          updateSummaMutation.mutate(
                            {
                              childId: vedemost?.id ?? 0,
                              summa: newSumma
                            },
                            {
                              onSuccess: close
                            }
                          )
                        }}
                      >
                        {t('save')}
                      </Button>
                    </Popover>
                  )}
                </PopoverDialog>
              </PopoverTrigger>

              <Button
                onClick={downloadPDF}
                isDisabled={isDownloading}
                className="pdf-hidden ml-auto self-end"
                IconStart={Download}
              >
                {t('download_as_pdf')}
              </Button>
            </div>
          </div>
          <div className="flex-1 px-5 grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-5">
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
                data={vedemost?.deductions ?? []}
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
              />
            </div>
          </div>
          <div className="px-5 mt-5 flex items-center gap-10">
            <Button
              onPress={() => {
                calculateChild.mutate({
                  childId: vedemost?.id ?? 0
                })
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
              itemsCount={otherVedemostProvodka.length}
            />
          </div>
        </div>
      </div>
      {vedemost ? (
        <>
          <OtherVedemostDeductionDialog
            onSubmit={handleSubmitDeduction}
            selected={deductionData}
            isOpen={deductionToggle.isOpen}
            onOpenChange={deductionToggle.setOpen}
          />
        </>
      ) : null}
    </>
  )
}
