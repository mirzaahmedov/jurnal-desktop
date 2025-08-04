import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { DownloadFile } from '@/common/features/file'
import { useDates } from '@/common/hooks'

export interface ReportDialogProps extends Omit<DialogTriggerProps, 'children'> {
  main_schet_id: number
  budjet_id: number
}
export const ReportDialog = ({
  isOpen,
  onOpenChange,
  budjet_id,
  main_schet_id
}: ReportDialogProps) => {
  const defaultDates = useDates()

  const { t } = useTranslation(['app'])

  const [dates, setDates] = useState({
    from: defaultDates.from,
    to: defaultDates.to
  })

  useEffect(() => {
    if (isOpen) {
      setDates({
        from: defaultDates.from,
        to: defaultDates.to
      })
    }
  }, [isOpen])

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
            <JollyDatePicker
              value={dates.from}
              onChange={(value) => {
                setDates((prev) => ({
                  ...prev,
                  from: value
                }))
              }}
            />
            -
            <JollyDatePicker
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
              isDisabled={!!budjet_id || !!main_schet_id}
              url="/jur_7/doc_rasxod/report"
              fileName={`${t('report')}-${dates.from}-${dates.to}.xlsx`}
              params={{
                from: dates.from,
                to: dates.to,
                budjet_id,
                main_schet_id,
                excel: true
              }}
              buttonText={t('report')}
              variant="default"
            />
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
