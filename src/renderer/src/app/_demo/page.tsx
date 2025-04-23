import type { RangeValue } from '@react-types/shared'
import type { DateValue } from 'react-aria-components'

import { useMemo, useRef, useState } from 'react'

import { CalendarDate } from '@internationalized/date'
import 'react-stately'

import { JollyDateRangePicker } from '@/common/components/jolly/date-picker'
import { Input } from '@/common/components/ui/input'

const DemoPage = () => {
  const valid = useRef(true)

  const [selected, setSelected] = useState<RangeValue<DateValue> | null>(null)

  const minValue = useMemo(() => {
    return new CalendarDate(2023, 1, 1)
  }, [])
  const maxValue = useMemo(() => {
    return new CalendarDate(2023, 1, 31)
  }, [])

  return (
    <div className="p-10">
      <div className="flex items-center ">
        <JollyDateRangePicker
          shouldForceLeadingZeros
          value={selected}
          onChange={(value) => {
            setSelected(value)
          }}
          validate={(value) => {
            const validDate = value.start.compare(minValue) > 0 && value.end.compare(maxValue) < 0
            if (!validDate) {
              valid.current = false
              return null
            }

            const validRange = value.start.compare(value.end) < 0
            if (!validRange) {
              valid.current = false
              return null
            }

            valid.current = true
            return true
          }}
          onBlur={() => {
            if (!valid.current) {
              setSelected(null)
            }
          }}
          calendarProps={{
            minValue,
            maxValue
          }}
        />

        <Input value="DD.MM.YYYY" />
      </div>
    </div>
  )
}

export default DemoPage
