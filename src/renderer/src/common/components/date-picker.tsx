import {
  ButtonHTMLAttributes,
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { formatDate, parseDate, validateLocaleDate } from '@/common/lib/date'
import { formatLocaleDate, unformatLocaleDate } from '@/common/lib/format'

import { Calendar } from '@/common/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from './ui/input'
import type { InputProps } from './ui/input'
import { PatternFormat } from 'react-number-format'
import type { PatternFormatProps } from 'react-number-format'
import { cn } from '@/common/lib/utils'
import { toast } from '../hooks'
import { useToggle } from '@/common/hooks/use-toggle'

export type DatePickerProps = Omit<PatternFormatProps<InputProps>, 'format' | 'onChange'> & {
  value?: string
  onChange?: (value: string) => void
  className?: string
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>
  placeholder?: string
  formatValue?: (value: string) => string
  unformatValue?: (value: string) => string
  validate?: (value: string) => boolean
}
const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder,
      className,
      formatValue = formatLocaleDate,
      unformatValue = unformatLocaleDate,
      validate = validateLocaleDate,
      triggerProps = {},
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [internalValue, setInternalValue] = useState(formatValue(value ?? ''))

    const calendarToggle = useToggle()

    useEffect(() => {
      setInternalValue(formatValue(value ?? ''))
    }, [formatValue, value])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInternalValue(value)
      if (validate(value)) {
        onChange?.(unformatValue(value))
      }
    }

    const handleBlur = () => {
      if (!validate(internalValue)) {
        toast({
          title: 'Неверный формат даты или дата не существует',
          variant: 'destructive'
        })
        setInternalValue(formatValue(value ?? ''))
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
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
      calendarToggle.setIsOpen(active)
    }

    return (
      <Popover open={calendarToggle.isOpen} onOpenChange={handleChangeActive}>
        <PopoverTrigger asChild ref={ref}>
          <button
            tabIndex={-1}
            onFocus={() => {
              inputRef.current?.focus()
            }}
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
              onChange={handleChange}
              placeholder={placeholder ?? 'дд.мм.гггг'}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={cn('w-full', className)}
            />
            <CalendarIcon className="absolute top-1/2 right-2 -translate-y-1/2 mr-2 h-4 w-4 text-slate-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Calendar
            mode="single"
            selected={value ? parseDate(value) : undefined}
            onSelect={(date) => {
              if (!date) {
                return
              }
              onChange?.(formatDate(date))
              calendarToggle.close()
            }}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { DatePicker }
