import type { MainZarplata } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay, NumericInput, Spinner } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { MonthSelect } from '@/common/components/month-select'
import { Form, FormField } from '@/common/components/ui/form'
import { YearSelect } from '@/common/components/year-select'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { formatLocaleDate } from '@/common/lib/format'

import { MainZarplataInfo } from '../components'
import { OtdelniyRaschetFormSchema, defaultValues } from './config'
import { OtdelniyRaschetService } from './service'

export interface OtdelniyRaschetFormProps {
  mainZarplata: MainZarplata
  onFinish: VoidFunction
}
export const OtdelniyRaschetForm = ({ mainZarplata, onFinish }: OtdelniyRaschetFormProps) => {
  useRequisitesRedirect(-1)

  const { t } = useTranslation(['app'])

  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(OtdelniyRaschetFormSchema)
  })

  const getMaxDocNumMutation = useMutation({
    mutationFn: OtdelniyRaschetService.getMaxDocNum,
    onSuccess: (docNum) => {
      form.setValue('docNum', docNum)
    }
  })

  const getMainZarplatMutation = useMutation({
    mutationFn: MainZarplataService.getById
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

  const year = form.watch('nachislenieYear')
  const month = form.watch('nachislenieMonth')
  useEffect(() => {
    if (year && month && mainZarplata.id) {
      getMainZarplatMutation.mutate(
        {
          queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplata.id, { year, month }]
        } as any,
        {
          onSuccess: (res) => {
            const { day } = res.data ?? {}
            form.setValue('rabDni', day ?? 0)
            form.setValue('otrabDni', day ?? 0)
          }
        }
      )
    }
  }, [year, month])

  useEffect(() => {
    getMaxDocNumMutation.mutate()
  }, [getMaxDocNumMutation.mutate])

  return (
    <div className="flex-1 min-h-0 relative flex flex-col gap-5 px-5">
      {otdelniyRaschetCreateMutation.isPending ? <LoadingOverlay /> : null}

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 flex flex-col gap-8"
        >
          <div className="flex-1 overflow-x-visible overflow-y-auto scrollbar bg-gray-100">
            <MainZarplataInfo mainZarplataId={mainZarplata.id} />
            <div className="p-5 ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="docNum"
                  render={({ field }) => (
                    <FormElement
                      label={t('doc_num')}
                      direction="column"
                      hideDescription
                    >
                      <div className="flex items-center gap-2">
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                          className="w-full"
                        />
                        <Button
                          type="button"
                          size="icon"
                          className="size-10 flex-shrink-0"
                          variant="ghost"
                          isDisabled={getMaxDocNumMutation.isPending}
                          onClick={() => {
                            getMaxDocNumMutation.mutate()
                          }}
                          aria-label={t('refresh_doc_num')}
                        >
                          {getMaxDocNumMutation.isPending ? (
                            <Spinner className="size-5 border-2" />
                          ) : (
                            <RefreshCw />
                          )}
                        </Button>
                      </div>
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
                      <JollyDatePicker
                        {...field}
                        className="w-full"
                      />
                    </FormElement>
                  )}
                />

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
                        className="w-full"
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
                        className="w-full"
                      />
                    </FormElement>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-5 p-5 py-10 rounded-xl border border-gray-200 bg-white">
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
                        className="w-full"
                        min={0}
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
                        className="w-full"
                        min={0}
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
                        className="w-full"
                        min={0}
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
                        className="w-full"
                        min={0}
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
                        className="w-full"
                        min={0}
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
                        className="w-full"
                        min={0}
                      />
                    </FormElement>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t">
            <Button
              type="submit"
              isPending={otdelniyRaschetCreateMutation.isPending}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
