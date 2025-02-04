import { useEffect } from 'react'

import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker } from './date-picker'
import { FormElement } from './form'
import { Button } from './ui/button'
import { Form, FormField } from './ui/form'

type RangeDateValues = {
  from: string
  to: string
}
type RangeDatePickerProps = RangeDateValues & {
  onChange: (values: Partial<RangeDateValues>) => void
}
const RangeDatePicker = ({ from, to, onChange }: RangeDatePickerProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const onSubmit = form.handleSubmit(onChange)

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

export { RangeDatePicker }
export type { RangeDatePickerProps }
