import type { AdminBank, AdminBankMainSchet } from './interfaces'
import type { ColumnDef, GenericTableProps } from '@/common/components'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DailyReportDialog } from '@/app/jur_2/monitor/daily-report-dialog'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { DownloadFile } from '@/common/features/file'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { parseDate } from '@/common/lib/date'

export const AdminBankRegionColumnDefs: ColumnDef<AdminBank>[] = [
  {
    key: 'name'
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa_from',
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa_to',
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  }
]

export const AdminBankMainSchetColumnDefs: ColumnDef<AdminBankMainSchet>[] = [
  {
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'jur2_schet',
    header: 'schet'
  },
  {
    key: 'budjet_name',
    header: 'budjet',
    width: 400
  },
  {
    numeric: true,
    key: 'summa_from',
    minWidth: 200,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    key: 'summa_to',
    minWidth: 200,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  },
  {
    key: 'actions',
    renderCell: (row, _, tableProps) => {
      return (
        <ReportsContainer
          row={row}
          tableProps={tableProps}
        />
      )
    }
  }
]

const ReportsContainer = ({
  row,
  tableProps
}: {
  row: AdminBankMainSchet
  tableProps: GenericTableProps<AdminBankMainSchet>
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
                onClick={() => {
                  popoverToggle.close()
                  dailyReportToggle.open()
                }}
                className="justify-start"
              >
                <Download className="btn-icon icon-sm icon-start" />
                {t('daily-report')}
              </Button>

              <DownloadFile
                fileName={`${t('pages.bank')}-${t('report')}_${from}&${to}.xlsx`}
                url="bank/monitoring/cap"
                buttonText={t('cap-report')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id: reportTitleId,
                  from: from,
                  to: to,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  region_id: regionId,
                  excel: true
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.bank')}-${t('by_contract')}_${from}&${to}.xlsx`}
                url="/bank/monitoring/by-contract"
                buttonText={t('by_contract')}
                params={{
                  main_schet_id,
                  region_id: regionId,
                  from: from,
                  to: to,
                  excel: true
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.bank')}-${t('by_smeta')}_${from}&${to}.xlsx`}
                url="/bank/monitoring/by-smeta"
                buttonText={t('by_smeta')}
                params={{
                  main_schet_id,
                  region_id: regionId,
                  from: from,
                  to: to,
                  excel: true
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.bank')}_${t('cap_prixod_rasxod')}_${from}&${to}.xlsx`}
                url="bank/monitoring/by-schet"
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
                fileName={`${t('pages.bank')}_2169_${t('report')}_${date.getFullYear()}&${date.getMonth() + 1}.xlsx`}
                url="/bank/monitoring/2169"
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
