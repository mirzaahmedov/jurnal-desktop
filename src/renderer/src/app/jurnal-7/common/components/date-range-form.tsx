import { Form, FormField } from '@renderer/common/components/ui/form'

import { Button } from '@renderer/common/components/ui/button'
import { CircleArrowDown } from 'lucide-react'
import { DatePicker } from '@renderer/common/components/date-picker'
import { FormElement } from '@renderer/common/components/form'
import { useDateRange } from '@/common/hooks/use-date-range'
import { useEffect } from 'react'
import { useJurnal7DateRange } from './use-date-range'

export type DateRangeFormProps = {
  form: ReturnType<typeof useDateRange>['form']
  onSubmit: ReturnType<typeof useDateRange>['applyFilters']
}
export const DateRangeForm = (props: DateRangeFormProps) => {
  const { form, onSubmit } = props

  const { from, to } = useJurnal7DateRange()

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
            <FormElement label="За период с">
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
            <FormElement label="по">
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
            Загрузить
          </Button>
        </div>
      </form>
    </Form>
  )
}
