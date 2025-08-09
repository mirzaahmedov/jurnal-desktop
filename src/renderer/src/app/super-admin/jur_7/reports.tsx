import type { AdminMaterialMainSchet } from './interfaces'
import type { GenericTableProps } from '@/common/components'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MaterialReportModal } from '@/app/jur_7/__components__/material-report-modal'
import { DailyReportDialog } from '@/app/jur_7/monitor/daily-report-dialog'
import { TurnoverReportDialog } from '@/app/jur_7/monitor/turnover-report-dialog'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { DownloadFile } from '@/common/features/file'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { parseDate } from '@/common/lib/date'

export const AdminMaterialReports = ({
  row,
  tableProps
}: {
  row: AdminMaterialMainSchet
  tableProps: GenericTableProps<AdminMaterialMainSchet>
}) => {
  const { t } = useTranslation(['app'])

  const popoverToggle = useToggle()
  const dailyReportToggle = useToggle()
  const materialReportToggle = useToggle()
  const turnoverToggle = useToggle()

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
                onClick={() => {
                  dailyReportToggle.open()
                  popoverToggle.close()
                }}
                className="inline-flex items-center justify-start"
              >
                <Download className="btn-icon !size-4 icon-start" />
                {t('daily-report')}
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  materialReportToggle.open()
                  popoverToggle.close()
                }}
                className="justify-start"
              >
                <Download className="btn-icon icon-start icon-sm" /> {t('material')}
              </Button>

              <Button
                IconStart={Download}
                variant="ghost"
                onClick={() => {
                  turnoverToggle.open()
                  popoverToggle.close()
                }}
                className="justify-start"
              >
                {t('summarized_circulation')}
              </Button>

              <DownloadFile
                fileName={`material_${t('cap')}_${date.getMonth() + 1}-${date.getFullYear()}.xlsx`}
                url="/jur_7/monitoring/cap/report"
                params={{
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                  from: from,
                  to: to,
                  budjet_id,
                  main_schet_id,
                  report_title_id: reportTitleId,
                  region_id: regionId,
                  excel: true
                }}
                buttonText={t('cap')}
                className="justify-start"
              />

              <DownloadFile
                fileName={`material_${t('cap_prixod_rasxod')}_${from}&${to}.xlsx`}
                url="jur_7/monitoring/by-schets"
                buttonText={t('cap_prixod_rasxod')}
                params={{
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                  from: from,
                  to: to,
                  budjet_id,
                  main_schet_id,
                  region_id: regionId,
                  report_title_id: reportTitleId,
                  excel: true
                }}
              />

              <DownloadFile
                fileName={`${t('summarized_circulation')}(${t('year')})_${date.getMonth() + 1}-${date.getFullYear()}.xlsx`}
                url="/jur_7/monitoring/schet"
                params={{
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                  is_year: true,
                  main_schet_id,
                  region_id: regionId,
                  excel: true
                }}
                buttonText={`${t('summarized_circulation')} (${t('year')})`}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('summarized_circulation')}(${t('month')})_${date.getMonth() + 1}-${date.getFullYear()}.xlsx`}
                url="/jur_7/monitoring/schet"
                params={{
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                  is_year: false,
                  main_schet_id,
                  region_id: regionId,
                  excel: true
                }}
                buttonText={`${t('summarized_circulation')} (${t('month')})`}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.material-warehouse')}_2169_${t('report')}_${from}&${to}.xlsx`}
                url="/jur_7/monitoring/2169"
                buttonText={`2169 ${t('report')}`}
                params={{
                  budjet_id,
                  main_schet_id,
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
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        region_id={regionId}
        defaultFrom={from}
        defaultTo={to}
      />

      <MaterialReportModal
        withIznos
        withResponsible={false}
        isOpen={materialReportToggle.isOpen}
        onOpenChange={materialReportToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        to={to}
        from={from}
        year={date.getFullYear()}
        month={date.getMonth() + 1}
        region_id={regionId}
      />

      <TurnoverReportDialog
        withResponsible={false}
        isOpen={turnoverToggle.isOpen}
        onOpenChange={turnoverToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        region_id={regionId}
        to={to}
        year={date.getFullYear()}
        month={date.getMonth() + 1}
      />
    </>
  )
}
