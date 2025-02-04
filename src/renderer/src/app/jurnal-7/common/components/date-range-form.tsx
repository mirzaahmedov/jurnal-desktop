import { useEffect } from 'react'

import { DatePicker } from '@renderer/common/components/date-picker'
import { FormElement } from '@renderer/common/components/form'
import { Button } from '@renderer/common/components/ui/button'
import { Form, FormField } from '@renderer/common/components/ui/form'
import { CircleArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useJurnal7DateRange } from './use-date-range'

export type DateRangeFormProps = {
  form: ReturnType<typeof useJurnal7DateRange>['form']
  onSubmit: ReturnType<typeof useJurnal7DateRange>['applyFilters']
}
export const DateRangeForm = (props: DateRangeFormProps) => {
  const { form, onSubmit } = props

  const { from, to } = useJurnal7DateRange()
  const { t } = useTranslation()

  useEffect(() => {
    form.reset({
      from,
      to
    })
  }, [form, from, to])

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-10"
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormElement label={t('from')}>
              <DatePicker
                autoFocus
                {...field}
              />
            </FormElement>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormElement label={t('to')}>
              <DatePicker {...field} />
            </FormElement>
          )}
        />
        <div className="space-x-1">
          <Button
            type="submit"
            variant="outline"
          >
            <CircleArrowDown className="btn-icon icon-start" />
            {t('load')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
