import type { DatePickerProps, DateValue } from 'react-aria-components'

import { CalendarIcon } from 'lucide-react'

import { Button } from '@/common/components/jolly/button'
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading
} from '@/common/components/jolly/calendar'
import { DateInput } from '@/common/components/jolly/date-field'
import { DatePicker, DatePickerContent } from '@/common/components/jolly/date-picker'
import { FieldGroup, Label } from '@/common/components/jolly/field'

export const DatePickerField = <T extends DateValue>(props: DatePickerProps<T>) => {
  return (
    <DatePicker
      {...props}
      className="min-w-[208px] space-y-1"
    >
      <Label>Date</Label>
      <FieldGroup>
        <DateInput
          className="flex-1"
          variant="ghost"
        />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <CalendarIcon
            aria-hidden
            className="size-4"
          />
        </Button>
      </FieldGroup>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </DatePicker>
  )
}
