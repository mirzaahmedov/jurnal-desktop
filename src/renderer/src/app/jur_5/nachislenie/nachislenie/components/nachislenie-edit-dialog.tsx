import type { VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import type { NachislenieProvodka } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookUser, Plus, Search, Sigma } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { MainZarplataInfo } from '@/app/jur_5/passport-info/components'
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
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { YearSelect } from '@/common/components/year-select'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import { useZarplataStore } from '@/common/features/zarplata/store'
import { useToggle } from '@/common/hooks'
import { formatDate, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import {
  type NachislenieDeductionDto,
  type NachisleniePaymentDto
} from '@/common/models/nachislenie'

import { defaultValues } from '../config'
import { NachislenieService } from '../service'
import { NachisleniePaymentDialog } from './nachislenie-payments-dialog'

enum TabOptions {
  View = 'view',
  Update = 'update'
}

export interface NachislenieEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  nachislenieId: number | undefined
  vacant: VacantTreeNode | undefined
}
export const NachislenieEditDialog = ({
  nachislenieId,
  vacant,
  ...props
}: NachislenieEditDialogProps) => {
  const { t } = useTranslation(['app'])
  const { openMainZarplataView } = useZarplataStore()

  const [tabValue, setTabValue] = useState(TabOptions.View)
  const [comboValue, setComboValue] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const comboModal = useToggle()

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

  const handleSearchMainZarplata = (value: number | null) => {
    if (value) {
      setCurrentIndex(nachislenieProvodka.findIndex((i) => i.id === value) ?? 0)
    }
    setComboValue(null)
    comboModal.close()
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

        {nachislenieData ? (
          <div className="flex items-center gap-2.5 ml-auto">
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
                  onValueChange={(value) => setTabValue(value as TabOptions)}
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
                      {(item) => <ComboboxItem id={item.id}>{item.fio}</ComboboxItem>}
                    </JollyComboBox>
                    <div className="size-10 grid place-items-center">
                      <Search className="btn-icon text-gray-400" />
                    </div>
                  </div>
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
                          <BookUser className="btn-icon" />
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
                <div className="relative mt-5 flex-1 mih-h-0 flex flex-col gap-5 overflow-hidden">
                  <div className="px-5">
                    <Header />
                  </div>
                  <NachislenieUpdateForm
                    currentIndex={currentIndex}
                    onNavigateItem={setCurrentIndex}
                    nachislenieProvodka={nachislenieProvodka}
                    nachislenieMainId={nachislenieData?.id ?? 0}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}

export interface NachislenieUpdateFormProps extends Omit<DialogTriggerProps, 'children'> {
  currentIndex: number
  onNavigateItem: (index: number) => void
  nachislenieMainId: number
  nachislenieProvodka: NachislenieProvodka[]
}
const NachislenieUpdateForm: FC<NachislenieUpdateFormProps> = ({
  currentIndex,
  onNavigateItem,
  nachislenieMainId,
  nachislenieProvodka
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
                  type="button"
                  onPress={() => {
                    updateChildNachislenie.mutate({
                      id: nachislenie?.id ?? 0,
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
                  className="ml-auto"
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
                    className="-my-10"
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
                    className="-my-10"
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
              >
                <Sigma className="btn-icon icon-start" /> {t('recalculate_salary')}
              </Button>
            </div>
            <div className="mt-5 pr-5 flex items-center justify-between">
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
