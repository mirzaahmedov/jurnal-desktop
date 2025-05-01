import type { ColumnDef } from '@/common/components'

import { Trans } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Badge } from '@/common/components/ui/badge'
import { formatLocaleDate } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'
import { type WarehouseMonitoring, WarehouseMonitoringType } from '@/common/models'

export const columns: ColumnDef<WarehouseMonitoring>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    sort: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    fit: true,
    sort: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'type',
    header: 'type',
    minWidth: 170,
    renderCell: (row) => (
      <Badge
        className={cn(
          row.type === WarehouseMonitoringType.prixod && 'bg-emerald-500',
          row.type === WarehouseMonitoringType.rasxod && 'bg-red-500'
        )}
      >
        {row.type === WarehouseMonitoringType.prixod ? (
          <Trans>prixod</Trans>
        ) : row.type === WarehouseMonitoringType.rasxod ? (
          <Trans>rasxod</Trans>
        ) : (
          <Trans>internal</Trans>
        )}
      </Badge>
    )
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa_prixod',
    header: 'prixod',
    renderCell: (row) => <SummaCell summa={row.summa_prixod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa_rasxod',
    header: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.summa_rasxod} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'from_name',
    header: 'from-who'
  },
  {
    fill: true,
    minWidth: 350,
    key: 'to_name',
    header: 'to-whom'
  },
  {
    key: 'debet',
    headerClassName: 'py-1 text-center',
    columns: [
      {
        key: 'debet_schet',
        header: 'schet',
        headerClassName: 'py-1',
        renderCell: (row) => row.schets?.map((item) => item.debet_schet).join(', ')
      },
      {
        key: 'debet_sub_schet',
        header: 'subschet',
        headerClassName: 'py-1',
        renderCell: (row) => row.schets?.map((item) => item.debet_sub_schet).join(', ')
      }
    ]
  },
  {
    key: 'kredit',
    headerClassName: 'py-1 text-center',
    columns: [
      {
        key: 'kredit_schet',
        header: 'schet',
        headerClassName: 'py-1',
        renderCell: (row) => row.schets?.map((item) => item.kredit_schet).join(', ')
      },
      {
        key: 'kredit_sub_schet',
        header: 'subschet',
        headerClassName: 'py-1',
        renderCell: (row) => row.schets?.map((item) => item.kredit_sub_schet).join(', ')
      }
    ]
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
