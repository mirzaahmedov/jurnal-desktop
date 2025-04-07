import type { Response } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { eachMonthOfInterval, endOfYear, format, parse } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { uz } from 'date-fns/locale/uz'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { Badge } from '@/common/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { http } from '@/common/lib/http'
import { cn } from '@/common/lib/utils'

export interface MonthlySaldoTrackerDialogProps extends DialogProps {
  onSelect: (month: Date) => void
}
export const MonthlySaldoTrackerDialog = ({
  onSelect,
  ...props
}: MonthlySaldoTrackerDialogProps) => {
  const [year, setYear] = useState(new Date().getFullYear())

  const { budjet_id } = useRequisitesStore()
  const { t, i18n } = useTranslation()
  const { data: saldoMonths, isFetching: isFetchingSaldoMonths } = useQuery({
    queryKey: [
      'saldo/calendar',
      {
        year: year,
        budjet_id: budjet_id
      }
    ],
    queryFn: async () => {
      const res = await http.get<Response<{ year: number; month: number }[]>>(
        '/jur_7/monitoring/saldo/date',
        {
          params: {
            year: year,
            budjet_id
          }
        }
      )
      return res.data
    }
  })

  const firstDayCurrentYear = parse(String(year), 'yyyy', new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear)
  })

  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="flex flex-row items-center gap-10">
          <DialogTitle>{t('monthly_saldo')}</DialogTitle>
          <YearSelect
            value={year}
            onValueChange={setYear}
            triggerClassName="w-24"
          />
        </DialogHeader>
        <div className="p-3">
          <div className="flex flex-col items-center gap-5">
            <div
              className="relative mx-auto grid grid-cols-4 border-t border-l"
              role="grid"
              aria-labelledby="month-picker"
            >
              {isFetchingSaldoMonths ? <LoadingOverlay /> : null}
              {months.map((month) => (
                <div
                  key={month.toString()}
                  className={cn(
                    'hover:bg-slate-50 cursor-pointer size-48 flex items-center justify-center font-medium relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800 border-b border-r',
                    saldoMonths?.data?.find((item) => item.month === month.getMonth() + 1) &&
                      'font-bold text-brand'
                  )}
                  role="presentation"
                  onClick={() => {
                    onSelect(month)
                  }}
                >
                  <time
                    dateTime={format(month, 'yyyy-MM-dd')}
                    className="text-base font-semibold"
                  >
                    {format(month, 'MMMMMM', {
                      locale: i18n.language === 'ru' ? ru : uz
                    })}
                  </time>
                  {saldoMonths?.data?.find((item) => item.month === month.getMonth() + 1) ? (
                    <Badge className="absolute bottom-2 right-2">{t('saldo_exists_short')}</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="absolute bottom-2 right-2"
                    >
                      {t('no_saldo_short')}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
