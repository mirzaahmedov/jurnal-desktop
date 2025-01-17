import {
  formatDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  parseDate
} from '@renderer/common/lib/date'

import { Button } from '@renderer/common/components/ui/button'
import { LoadingSpinner } from '@renderer/common/components'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ostatokService } from '@renderer/app/jurnal-7/ostatok'
import { toast } from 'react-toastify'
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
      toast.success('Сальдо успешно зарегистрировано')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при регистрации - ' + error.message)
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
        className="flex items-center gap-2"
      >
        {isPending ? (
          <LoadingSpinner className="border-2 border-white border-r-transparent size-4" />
        ) : null}
        Регистрация сальдо
      </Button>
    </div>
  )
}
