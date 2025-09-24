import type { AdminPodotchetSchet } from './interfaces'
import type { GenericTableProps } from '@/common/components'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DailyReportDialog } from '@/app/jur_4/monitor/daily-report-dialog'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { DownloadFile } from '@/common/features/file'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { parseDate } from '@/common/lib/date'

export const AdminPodotchetReports = ({
  row,
  tableProps
}: {
  row: AdminPodotchetSchet
  tableProps: GenericTableProps<AdminPodotchetSchet>
}) => {
  const { t } = useTranslation(['app'])

  const popoverToggle = useToggle()
  const dailyReportToggle = useToggle()

  const reportTitleId = useSettingsStore((store) => store.report_title_id)

  const { id: schetId } = row
  const { from, to, regionId, mainSchetId, budjetId } = tableProps.params as {
    from: string
    to: string
    regionId: number
    mainSchetId: number
    budjetId: number
  }

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
                className="inline-flex items-center justify-start"
              >
                <Download className="btn-icon !size-4 icon-start" />
                {t('daily-report')}
              </Button>

              <DownloadFile
                fileName={`дебитор-кредитор_отчет-${to}.xlsx`}
                url="podotchet/monitoring/prixod/rasxod/"
                params={{
                  excel: true,
                  to: to,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  budjet_id: budjetId,
                  region_id: regionId,
                  main_schet_id: mainSchetId,
                  schet_id: schetId
                }}
                buttonText={t('debitor_kreditor_report')}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('cap')}-${from}&${to}.xlsx`}
                url={`/podotchet/monitoring/cap`}
                params={{
                  budjet_id: budjetId,
                  main_schet_id: mainSchetId,
                  schet_id: schetId,
                  region_id: regionId,
                  from: from,
                  to: to,
                  excel: true,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  report_title_id: reportTitleId
                }}
                buttonText={t('cap-report')}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('podotchet-litso')}_${t('cap_prixod_rasxod')}_${from}&${to}.xlsx`}
                url="podotchet/monitoring/by-schets"
                buttonText={t('cap_prixod_rasxod')}
                params={{
                  budjet_id: budjetId,
                  main_schet_id: mainSchetId,
                  schet_id: schetId,
                  region_id: regionId,
                  from: from,
                  to: to,
                  excel: true,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  report_title_id: reportTitleId
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.podotchet')}_2169_${t('report')}_${from}&${to}.xlsx`}
                url="/podotchet/monitoring/2169"
                buttonText={`2169 ${t('report')}`}
                params={{
                  budjet_id: budjetId,
                  main_schet_id: mainSchetId,
                  schet_id: schetId,
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
            </div>
          </PopoverDialog>
        </Popover>
      </PopoverTrigger>

      <DailyReportDialog
        isOpen={dailyReportToggle.isOpen}
        onOpenChange={dailyReportToggle.setOpen}
        budjet_id={budjetId!}
        main_schet_id={mainSchetId!}
        report_title_id={reportTitleId!}
        schet_id={schetId}
        region_id={regionId}
        defaultFrom={from}
        defaultTo={to}
      />
    </>
  )
}
