import { useForm } from 'react-hook-form'
import { Form, FormField } from './ui/form'
import { DatePicker } from './date-picker'
import { FormElement } from './form'
import { Button } from './ui/button'
import { CircleArrowDown } from 'lucide-react'

type RangeDateValues = {
  from: string
  to: string
}
type RangeDatePickerProps = RangeDateValues & {
  onChange: (values: Partial<RangeDateValues>) => void
}
const RangeDatePicker = ({ from, to, onChange }: RangeDatePickerProps) => {
  const form = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const onSubmit = form.handleSubmit(onChange)

  return (
    <Form {...form}>
      <form className="flex items-center gap-10" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormElement label="За период с">
              <DatePicker autoFocus {...field} />
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
          <Button type="submit" variant="outline">
            <CircleArrowDown className="btn-icon icon-start" />
            Загрузить
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { RangeDatePicker }
export type { RangeDatePickerProps }
