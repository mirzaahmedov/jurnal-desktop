import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { DatePicker } from '@/common/components'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { DownloadFile } from '@/common/features/file'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth, parseDate } from '@/common/lib/date'

export interface DailyReportDialogProps extends Omit<DialogTriggerProps, 'children'> {
  main_schet_id: number
  budjet_id: number
  report_title_id: number
}
export const DailyReportDialog = ({
  isOpen,
  onOpenChange,
  budjet_id,
  main_schet_id,
  report_title_id
}: DailyReportDialogProps) => {
  const { startDate } = useSelectedMonthStore()
  const { t } = useTranslation(['app'])

  const [dates, setDates] = useState({
    from: formatDate(getFirstDayOfMonth(startDate)),
    to: formatDate(getLastDayOfMonth(startDate))
  })

  const date = parseDate(dates.from)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('daily-report')}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-5 pb-5">
            <DatePicker
              value={dates.from}
              onChange={(value) => {
                setDates((prev) => ({
                  ...prev,
                  from: value
                }))
              }}
            />
            -
            <DatePicker
              value={dates.to}
              onChange={(value) => {
                setDates((prev) => ({
                  ...prev,
                  to: value
                }))
              }}
            />
          </div>
          <DialogFooter>
            <DownloadFile
              disabled={!dates.from || !dates.to}
              fileName={`${t('pages.kassa')}-${t('daily-report')}_${dates.from}&${dates.to}.xlsx`}
              url="kassa/monitoring/daily"
              buttonText={t('daily-report')}
              params={{
                main_schet_id,
                budjet_id,
                report_title_id,
                from: dates.from,
                to: dates.to,
                year,
                month,
                excel: true
              }}
              variant="default"
            />
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
