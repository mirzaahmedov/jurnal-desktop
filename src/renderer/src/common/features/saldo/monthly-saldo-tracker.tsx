import type { MonthValue } from './interfaces'

import { eachMonthOfInterval, endOfYear, format, parse } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { uz } from 'date-fns/locale/uz'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { Badge } from '@/common/components/ui/badge'
import { cn } from '@/common/lib/utils'

export interface MonthlySaldoTrackerProps {
  loading: boolean
  year: number
  data: MonthValue[]
  onSelect: (month: Date) => void
}
export const MonthlySaldoTracker = ({
  loading,
  year,
  data,
  onSelect
}: MonthlySaldoTrackerProps) => {
  const { t, i18n } = useTranslation()

  const firstDayCurrentYear = parse(String(year), 'yyyy', new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear)
  })

  return (
    <div className="p-3 relative">
      <div className="flex flex-col items-center gap-5">
        <div
          className="relative mx-auto grid grid-cols-4 border-t border-l"
          role="grid"
          aria-labelledby="month-picker"
        >
          {loading ? <LoadingOverlay /> : null}
          {months.map((month) => (
            <div
              key={month.toString()}
              className={cn(
                'hover:bg-slate-50 cursor-pointer size-48 flex items-center justify-center font-medium relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800 border-b border-r',
                data?.find((item) => item.year === year && item.month === month.getMonth() + 1) &&
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
              {data?.find((item) => item.month === month.getMonth() + 1) ? (
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
  )
}
