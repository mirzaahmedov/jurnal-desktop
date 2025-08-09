import type { AdminKassaMainSchet } from './interfaces'
import type { GenericTableProps } from '@/common/components'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DailyReportDialog } from '@/app/jur_1/monitor/daily-report-dialog'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { DownloadFile } from '@/common/features/file'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { parseDate } from '@/common/lib/date'

export const AdminKassaReports = ({
  row,
  tableProps
}: {
  row: AdminKassaMainSchet
  tableProps: GenericTableProps<AdminKassaMainSchet>
}) => {
  const { t } = useTranslation(['app'])

  const popoverToggle = useToggle()
  const dailyReportToggle = useToggle()

  const reportTitleId = useSettingsStore((store) => store.report_title_id)

  const { budjet_id, id: main_schet_id } = row
  const { from, to, regionId } = tableProps.params as { from: string; to: string; regionId: number }

  const date = parseDate(from)

  return (
    <>
      <PopoverTrigger
        isOpen={popoverToggle.isOpen}
        onOpenChange={popoverToggle.setOpen}
      >
        <Button
          variant="ghost"
          size="icon"
        >
          <Download className="btn-icon icon-sm" />
        </Button>
        <Popover>
          <PopoverDialog>
            <div className="flex flex-col">
              <Button
                variant="ghost"
                onPress={() => {
                  dailyReportToggle.open()
                  popoverToggle.close()
                }}
                className="justify-start"
              >
                <Download className="btn-icon icon-sm icon-start" />
                {t('daily-report')}
              </Button>
              <DownloadFile
                fileName={`${t('pages.kassa')}_${'cap'}_${from}&${to}.xlsx`}
                url="kassa/monitoring/cap"
                buttonText={t('cap')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id: reportTitleId,
                  region_id: regionId,
                  from: from,
                  to: to,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  excel: true
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.kassa')}_${t('cap_prixod_rasxod')}_${from}&${to}.xlsx`}
                url="kassa/monitoring/by-schet"
                buttonText={t('cap_prixod_rasxod')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id: reportTitleId,
                  region_id: regionId,
                  from: from,
                  to: to,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  excel: true
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.kassa')}_2169_${t('report')}_${date.getFullYear()}&${date.getMonth() + 1}.xlsx`}
                url="/kassa/monitoring/2169"
                buttonText={`2169 ${t('report')}`}
                params={{
                  main_schet_id,
                  region_id: regionId,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  excel: true
                }}
                className="justify-start"
              />
            </div>
          </PopoverDialog>
        </Popover>
      </PopoverTrigger>

      <DailyReportDialog
        isOpen={dailyReportToggle.isOpen}
        onOpenChange={dailyReportToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        report_title_id={reportTitleId!}
        region_id={regionId}
        defaultFrom={from}
        defaultTo={to}
      />
    </>
  )
}
