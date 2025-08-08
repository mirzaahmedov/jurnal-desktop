import type { AdminOrgan159, AdminOrgan159MainSchet, AdminOrgan159Schet } from './interfaces'
import type { ColumnDef, GenericTableProps } from '@/common/components'
import type { CollapsibleColumnDef } from '@/common/components/collapsible-table'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DailyReportDialog } from '@/app/jur_3/159/monitor/daily-report-dialog'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { DownloadFile } from '@/common/features/file'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { parseDate } from '@/common/lib/date'

export const AdminOrgan159RegionColumnDefs: ColumnDef<AdminOrgan159>[] = [
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

export const AdminOrgan159MainSchetColumnDefs: CollapsibleColumnDef<AdminOrgan159MainSchet>[] = [
  {
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'budjet_name',
    header: 'budjet'
  },
  {
    numeric: true,
    key: 'summa_from',
    width: 200,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    width: 200,
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    width: 200,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    key: 'summa_to',
    width: 200,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  }
]

export const AdminOrgan159SchetColumnDefs: ColumnDef<AdminOrgan159Schet>[] = [
  {
    key: 'schet',
    header: 'schet'
  },
  {
    numeric: true,
    key: 'summa_from',
    header: 'summa_from',
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
    width: 200,
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    width: 200,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    key: 'summa_to',
    header: 'summa_to',
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
    fit: true,
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
  row: AdminOrgan159Schet
  tableProps: GenericTableProps<AdminOrgan159Schet>
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
                onClick={() => {
                  dailyReportToggle.open()
                  popoverToggle.close()
                }}
                className="justify-start"
              >
                <Download className="btn-icon !size-4 icon-start" />
                {t('daily-report')}
              </Button>

              <DownloadFile
                fileName={`159_${t('cap')}-${to}.xlsx`}
                url="/159/monitoring/cap"
                params={{
                  budjet_id: budjetId,
                  main_schet_id: mainSchetId,
                  schet_id: schetId,
                  region_id: regionId,
                  from: from,
                  to: to,
                  report_title_id: reportTitleId,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  excel: true
                }}
                buttonText={t('cap')}
                className="justify-start"
              />

              <DownloadFile
                fileName={`159_${t('cap_prixod_rasxod')}_${from}&${to}.xlsx`}
                url="159/monitoring/by-schets"
                buttonText={t('cap_prixod_rasxod')}
                params={{
                  budjet_id: budjetId,
                  main_schet_id: mainSchetId,
                  schet_id: schetId,
                  region_id: regionId,
                  from: from,
                  to: to,
                  report_title_id: reportTitleId,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  excel: true
                }}
                className="justify-start"
              />

              <DownloadFile
                fileName={`debitor_kreditor_${to}.xlsx`}
                url="/159/monitoring/prixod/rasxod"
                params={{
                  main_schet_id: mainSchetId,
                  budjet_id: budjetId,
                  schet_id: schetId,
                  region_id: regionId,
                  to: to,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  excel: true
                }}
                buttonText={t('debitor_kreditor_report')}
                className="justify-start"
              />

              <DownloadFile
                fileName={`${t('pages.organization')}:159_2169_${t('report')}_${date.getFullYear()}&${date.getMonth() + 1}.xlsx`}
                url="/159/monitoring/2169"
                buttonText={`2169 ${t('report')}`}
                params={{
                  main_schet_id: mainSchetId,
                  schet_id: schetId,
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
