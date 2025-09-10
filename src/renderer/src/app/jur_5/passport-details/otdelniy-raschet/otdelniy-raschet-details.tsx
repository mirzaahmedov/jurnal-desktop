import type { MainZarplata } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'
import type { FC } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { LoadingOverlay, NumericInput } from '@/common/components'
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
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { formatLocaleDate } from '@/common/lib/format'

import { OtdelniyRaschetFormSchema, defaultValues } from './config'
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
  const { t } = useTranslation()

  const currentItem = items?.[currentIndex]

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-full flex flex-col p-0">
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader className="p-5">
              <DialogTitle>{t('otdelniy_raschet')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0 flex flex-col overflow-auto scrollbar">
              {!currentItem ? (
                <div className="flex-1 grid place-items-center">
                  <h6 className="text-xl text-gray-500">{t('not_found')}</h6>
                </div>
              ) : (
                <>
                  <div className="border border-gray-200 m-5 rounded-xl">
                    <Header
                      mainZarplata={mainZarplata}
                      onFinish={console.log}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] px-5 gap-5">
                    <div className="bg-teal-700 p-5 rounded-xl h-full flex flex-col">
                      <h2 className="text-xl text-white font-medium mb-2">{t('nachislenie')}</h2>
                      <div className="flex-1 overflow-auto scrollbar">
                        <GenericTable
                          data={currentItem.otdelniyRaschetPaymentDtos ?? []}
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
                              key: 'summa',
                              renderCell: (row) => <SummaCell summa={row.summa} />
                            }
                          ]}
                          className="table-generic-xs shadow-md rounded overflow-hidden"
                        />
                      </div>
                    </div>
                    <div className="bg-teal-700 p-5 rounded-xl">
                      <h2 className="text-xl text-white font-medium mb-2">{t('uderjanie')}</h2>
                      <GenericTable
                        data={currentItem.otdelniyRaschetDeductionDtos ?? []}
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
                            key: 'summa',
                            renderCell: (row) => <SummaCell summa={row.summa} />
                          }
                        ]}
                        className="table-generic-xs shadow-md rounded overflow-hidden"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <ContentStepper
                      currentIndex={currentIndex}
                      onIndexChange={onIndexChange}
                      itemsCount={items.length}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export interface HeaderProps {
  mainZarplata: MainZarplata
  onFinish: VoidFunction
}
export const Header = ({ mainZarplata, onFinish }: HeaderProps) => {
  useRequisitesRedirect(-1)

  const { t } = useTranslation(['app'])

  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(OtdelniyRaschetFormSchema)
  })

  const otdelniyRaschetCreateMutation = useMutation({
    mutationFn: OtdelniyRaschetService.create,
    onSuccess: () => {
      form.reset(defaultValues)
      onFinish?.()
      toast.success(t('create_success'))
    },
    onError: (error) => {
      console.log(error)
      toast.error(t('create_failed'))
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    otdelniyRaschetCreateMutation.mutate({
      ...values,
      docDate: formatLocaleDate(values.docDate),
      spravochnikBudjetNameId: budjetId!,
      mainSchetId: mainSchetId!,
      mainZarplataId: mainZarplata.id
    })
  })

  return (
    <div className="h-full relative flex flex-col gap-5 p-5">
      {otdelniyRaschetCreateMutation.isPending ? <LoadingOverlay /> : null}

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
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

          <div className="flex justify-end gap-3 pt-5 border-t">
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
