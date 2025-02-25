import type { InputProps } from './ui/input'
import type { DayPickerSingleProps } from 'react-day-picker'
import type { OnValueChange, PatternFormatProps } from 'react-number-format'

import {
  type HTMLAttributes,
  type KeyboardEvent,
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react'

import { Calendar as CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PatternFormat } from 'react-number-format'
import { toast } from 'react-toastify'

import { Calendar } from '@/common/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { useToggle } from '@/common/hooks/use-toggle'
import { formatDate, localeDateToISO, parseDate, validateDate } from '@/common/lib/date'
import { formatLocaleDate, unformatLocaleDate } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'

export type DatePickerProps = Omit<PatternFormatProps<InputProps>, 'format' | 'onChange'> & {
  value?: string
  onChange?: (value: string) => void
  className?: string
  triggerProps?: HTMLAttributes<HTMLDivElement>
  placeholder?: string
  formatValue?: (value: string) => string
  unformatValue?: (value: string) => string
  validate?: (value: string) => boolean
  calendarProps?: DayPickerSingleProps
}
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder,
      className,
      formatValue = formatLocaleDate,
      unformatValue = unformatLocaleDate,
      validate = validateDate,
      triggerProps = {},
      calendarProps = {},
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [monthValue, setMonthValue] = useState(value ? parseDate(value) : new Date())
    const [internalValue, setInternalValue] = useState(formatValue(value ?? ''))

    const calendarToggle = useToggle()

    const { t } = useTranslation()

    useEffect(() => {
      if (document.activeElement && document.activeElement === inputRef.current) {
        return
      }
      setInternalValue(formatValue(value ?? ''))
      setMonthValue(value ? parseDate(value) : new Date())
    }, [formatValue, value])

    const handleChange: OnValueChange = (values) => {
      const value = values.formattedValue
      setInternalValue(value)

      if (values.value.length !== 8) {
        onChange?.('')
        return
      }

      const isValid = validate(localeDateToISO(value))
      if (isValid) {
        const rawValue = unformatValue(value)
        onChange?.(rawValue)
        setMonthValue(parseDate(rawValue))
      } else {
        toast.error(t('date_does_not_exists'))
        onChange?.('')
        setInternalValue('')
        setMonthValue(new Date())
      }
    }

    const handleBlur = () => {
      if (!internalValue) {
        onChange?.('')
        setMonthValue(new Date())
        return
      }
      if (!validate(localeDateToISO(internalValue))) {
        toast.error(t('date_does_not_exists'))
        onChange?.('')
        setInternalValue('')
      }
    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      if (e.key.match(/[0-9]/) || e.key === 'Backspace' || e.key === 'Delete') {
        const isValid = validate(localeDateToISO(value))
        if (isValid) {
          calendarToggle.open()
        } else {
          calendarToggle.close()
        }
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        calendarToggle.open()
      }
    }

    const handleChangeActive = (active: boolean) => {
      if (!active) {
        inputRef.current?.focus()
      }
      calendarToggle.setOpen(active)
    }

    const selected = value ? parseDate(value) : undefined

    return (
      <Popover
        open={calendarToggle.isOpen}
        onOpenChange={handleChangeActive}
      >
        <div
          {...triggerProps}
          className={cn('relative min-w-52', triggerProps.className)}
        >
          <PatternFormat
            {...props}
            getInputRef={inputRef}
            customInput={Input}
            format="##.##.####"
            mask={['д', 'д', 'м', 'м', 'г', 'г', 'г', 'г']}
            value={internalValue}
            onValueChange={handleChange}
            placeholder={placeholder ?? 'дд.мм.гггг'}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            className={cn('w-full', className)}
          />
          <PopoverTrigger
            asChild
            ref={ref}
          >
            <Button
              variant="ghost"
              size="icon"
              className="group absolute top-1/2 right-2 -translate-y-1/2 size-7"
              tabIndex={-1}
            >
              <CalendarIcon className="h-4 w-4 text-slate-500 group-hover:text-brand" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="w-auto p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            {...calendarProps}
            mode="single"
            selected={selected}
            month={monthValue}
            onMonthChange={setMonthValue}
            onDayClick={(date) => {
              if (selected && date?.getTime() === selected.getTime()) {
                calendarToggle.close()
                return
              }
              if (!date || !validate(formatDate(date))) {
                console.log({ date }, 'invalid')
                onChange?.('')
                setMonthValue(new Date())
                calendarToggle.close()
                return
              }
              onChange?.(formatDate(date))
              setMonthValue(date)
              calendarToggle.close()
            }}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = 'DatePicker'
