import type { MainZarplata } from '@/common/models'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { MonthSelect } from '@/common/components/month-select'
import { Form, FormField } from '@/common/components/ui/form'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { formatLocaleDate } from '@/common/lib/format'

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

  console.log({ values: form.watch() })

  return (
    <div className="h-full relative flex flex-col gap-5 p-5">
      {otdelniyRaschetCreateMutation.isPending ? <LoadingOverlay /> : null}

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="h-full space-y-6 flex flex-col"
        >
          <div className="flex-1 overflow-x-visible overflow-y-auto scrollbar">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
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
                      className="w-full"
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
                    <JollyDatePicker
                      {...field}
                      className="w-full"
                    />
                  </FormElement>
                )}
              />

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
                    />
                  </FormElement>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
