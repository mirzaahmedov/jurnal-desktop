import {
  formatDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  parseDate
} from '@renderer/common/lib/date'

import { Button } from '@renderer/common/components/ui/button'
import { LoadingSpinner } from '@renderer/common/components'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ostatokService } from '@renderer/app/jurnal7/ostatok'
import { toast } from '@renderer/common/hooks'
import { useJurnal7DateRange } from '../../components/use-date-range'
import { useJurnal7DefaultsStore } from './store'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

export const ChangeJurnal7Defaults = () => {
  const { from, setDates } = useJurnal7DefaultsStore()
  const { setParams } = useJurnal7DateRange()
  const { pathname } = useLocation()

  const { mutate: createOstatok, isPending } = useMutation({
    mutationFn: ostatokService.create,
    onSuccess() {
      toast({
        title: 'Сальдо успешно зарегистрировано'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        title: 'Ошибка при регистрации сальдо',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const handleChange = (dateString: string) => {
    const date = parseDate(dateString)
    const from = formatDate(getFirstDayOfMonth(date))
    const to = formatDate(getLastDayOfMonth(date))

    setDates({
      from,
      to
    })
    if (pathname.includes('jurnal-7')) {
      setParams({
        from,
        to
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <MonthPicker
        value={from}
        onChange={handleChange}
        className="w-56"
      />
      <Button
        disabled={isPending}
        onClick={() => {
          const [year, month] = from.split('-').map(Number)
          createOstatok({
            year,
            month
          })
        }}
      >
        {isPending ? <LoadingSpinner /> : null} Регистрация сальдо
      </Button>
    </div>
  )
}
