import type { MainZarplata } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Sigma } from 'lucide-react'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  FooterCell,
  FooterRow,
  GenericTable,
  LoadingOverlay,
  NumericInput
} from '@/common/components'
import { ContentStepper } from '@/common/components/content-stepper'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
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
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useToggle } from '@/common/hooks'
import { formatDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

import { MainZarplataInfo } from '../components'
import { OtdelniyRaschetFormSchema, type OtdelniyRaschetFormValues, defaultValues } from './config'
import { OtdelniyRaschetPaymentDialog } from './otdelniy-raschet-payments-dialog'
import { OtdelniyRaschetService } from './service'

export interface OtdelniyRaschetDetailsProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplata: MainZarplata
  items: OtdelniyRaschet[]
  currentIndex: number
  onIndexChange: (index: number) => void
}
export const OtdelniyRaschetDetails: FC<OtdelniyRaschetDetailsProps> = ({
  items,
  currentIndex,
  onIndexChange,
  mainZarplata,
  ...props
}) => {
  useRequisitesRedirect(-1)

  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(OtdelniyRaschetFormSchema)
  })
  const queryClient = useQueryClient()

  const currentItem = items?.[currentIndex]
  const otdelniyRaschetQuery = useQuery({
    queryKey: [OtdelniyRaschetService.QueryKeys.GetById, currentItem?.id],
    queryFn: () => OtdelniyRaschetService.getById(currentItem?.id ?? 0),
    enabled: !!currentItem?.id
  })
  const otdelniyRaschetCalculateMutation = useMutation({
    mutationFn: OtdelniyRaschetService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetById, currentItem?.id]
      })
    }
  })
  const otdelniyRaschet = otdelniyRaschetQuery?.data ?? ({} as OtdelniyRaschet)
  const payments = otdelniyRaschet?.otdelniyRaschetPaymentDtos ?? []
  const deductions = otdelniyRaschet?.otdelniyRaschetDeductionDtos ?? []

  const paymentToggle = useToggle()
  const deductionToggle = useToggle()

  const handleCalculateSalary = () => {
    const values = form.getValues()
    otdelniyRaschetCalculateMutation.mutate({
      id: otdelniyRaschet.id,
      values: {
        docDate: formatLocaleDate(values.docDate),
        docNum: values.docNum,
        kazarma: values.kazarma,
        mainSchetId: otdelniyRaschet.mainSchetId,
        nachislenieMonth: values.nachislenieMonth,
        nachislenieYear: values.nachislenieYear,
        otrabDni: values.otrabDni,
        prazdnik: values.prazdnik,
        rabDni: values.rabDni,
        spravochnikBudjetNameId: otdelniyRaschet.spravochnikBudjetNameId,
        mainZarplataId: otdelniyRaschet.mainZarplataId,
        noch: values.noch,
        pererabodka: values.pererabodka
      }
    })
  }

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-full h-full max-h-full flex flex-col p-0">
            <div className="h-full flex flex-col overflow-hidden">
              <DialogHeader className="p-5">
                <DialogTitle>{t('otdelniy_raschet')}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 flex flex-col overflow-auto scrollbar relative bg-gray-100">
                <MainZarplataInfo mainZarplata={mainZarplata} />
                {otdelniyRaschetQuery.isLoading ? (
                  <LoadingOverlay />
                ) : !otdelniyRaschet ? (
                  <div className="flex-1 grid place-items-center">
                    <h6 className="text-xl text-gray-500">{t('not_found')}</h6>
                  </div>
                ) : (
                  <>
                    <OtdelniyRaschetInfo
                      form={form}
                      otdelniyRaschet={otdelniyRaschet}
                    />
                    <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] px-5 gap-5">
                      <div className="bg-teal-700 p-5 rounded-xl h-full flex flex-col">
                        <div className="flex items-center justify-between gap-5 mb-4">
                          <h2 className="text-xl text-white font-medium mb-2">
                            {t('nachislenie')}
                          </h2>
                          <Button
                            className="-my-10"
                            onPress={paymentToggle.open}
                          >
                            <Plus className="btn-icon icon-start" /> {t('add')}
                          </Button>
                        </div>
                        <div className="flex-1 overflow-auto scrollbar">
                          <GenericTable
                            data={payments}
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
                            footer={
                              <FooterRow>
                                <FooterCell
                                  title={t('total')}
                                  content={formatNumber(otdelniyRaschet?.nachislenieSum ?? 0)}
                                  colSpan={6}
                                />
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
                            onPress={deductionToggle.open}
                          >
                            <Plus className="btn-icon icon-start" /> {t('add')}
                          </Button>
                        </div>
                        <GenericTable
                          data={deductions}
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
                          footer={
                            <FooterRow>
                              <FooterCell
                                title={t('total')}
                                colSpan={3}
                              />
                              <FooterCell
                                content={formatNumber(otdelniyRaschet?.uderjanieSum ?? 0)}
                              />
                            </FooterRow>
                          }
                        />
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between border-t">
                      <ContentStepper
                        currentIndex={currentIndex}
                        onIndexChange={onIndexChange}
                        itemsCount={items.length}
                      />
                      <Button
                        onPress={handleCalculateSalary}
                        isPending={otdelniyRaschetCalculateMutation.isPending}
                      >
                        <Sigma className="btn-icon icon-start" /> {t('recalculate_salary')}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
      <OtdelniyRaschetPaymentDialog
        otdelniyRaschetMainId={otdelniyRaschet.id}
        isOpen={paymentToggle.isOpen}
        onOpenChange={paymentToggle.setOpen}
      />
      <OtdelniyRaschetPaymentDialog
        isDeduction
        otdelniyRaschetMainId={otdelniyRaschet.id}
        isOpen={deductionToggle.isOpen}
        onOpenChange={deductionToggle.setOpen}
      />
    </>
  )
}

export interface OtdelniyRaschetInfoProps {
  form: UseFormReturn<OtdelniyRaschetFormValues>
  otdelniyRaschet: OtdelniyRaschet
}
export const OtdelniyRaschetInfo = ({ form, otdelniyRaschet }: OtdelniyRaschetInfoProps) => {
  const { t } = useTranslation(['app'])

  useEffect(() => {
    if (otdelniyRaschet) {
      form.reset({
        nachislenieYear: otdelniyRaschet.nachislenieYear,
        nachislenieMonth: otdelniyRaschet.nachislenieMonth,
        docNum: otdelniyRaschet.docNum,
        docDate: formatDate(parseLocaleDate(otdelniyRaschet.docDate)),
        rabDni: otdelniyRaschet.rabDni,
        otrabDni: otdelniyRaschet.otrabDni,
        noch: otdelniyRaschet.noch,
        prazdnik: otdelniyRaschet.prazdnik,
        pererabodka: otdelniyRaschet.pererabodka,
        kazarma: otdelniyRaschet.kazarma
      })
    } else {
      form.reset(defaultValues)
    }
  }, [otdelniyRaschet])

  return (
    <div className="relative flex flex-col gap-5 p-5 mt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          className="h-full space-y-3 flex flex-col"
        >
          <div className="p-1 flex-1 overflow-x-visible overflow-y-auto scrollbar">
            <div>
              <div className="flex items-center flex-wrap gap-5">
                <FormField
                  control={form.control}
                  name="nachislenieYear"
                  render={({ field }) => (
                    <FormElement
                      label={t('year')}
                      direction="column"
                      hideDescription
                    >
                      <YearSelect
                        {...field}
                        selectedKey={field.value}
                        onSelectionChange={(value) => field.onChange(value ?? 0)}
                        className="w-24"
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nachislenieMonth"
                  render={({ field }) => (
                    <FormElement
                      label={t('month')}
                      direction="column"
                      hideDescription
                    >
                      <MonthSelect
                        {...field}
                        selectedKey={field.value}
                        onSelectionChange={(value) => field.onChange(value ?? 0)}
                        className="w-32"
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="docNum"
                  render={({ field }) => (
                    <FormElement
                      label={t('doc_num')}
                      direction="column"
                      hideDescription
                    >
                      <NumericInput
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-32"
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="docDate"
                  render={({ field }) => (
                    <FormElement
                      label={t('doc_date')}
                      direction="column"
                      hideDescription
                    >
                      <JollyDatePicker {...field} />
                    </FormElement>
                  )}
                />
              </div>

              <div className="flex items-center flex-wrap gap-5 mt-5">
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
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-40"
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
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-40"
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
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-40"
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
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-40"
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
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-40"
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
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        className="w-40"
                      />
                    </FormElement>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
