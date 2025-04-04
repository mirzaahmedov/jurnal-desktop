import type { ReportTableProps } from './table'
import type { Autocomplete } from '@/common/lib/types'
import type { OX } from '@/common/models'
import type { ComponentType } from 'react'

export type ColumnDef = {
  alphanumeric?: boolean
  sticky?: true
  key: Autocomplete<keyof OX.ReportPreviewProvodka>
  header: string
  className?: string
  hidden?: boolean
  rowSpan?: number
  colSpan?: number
  cellElement?: ComponentType<
    Pick<ReportTableProps, 'onEdit' | 'onDelete'> & { row: OX.ReportPreviewProvodka }
  >
}

export const columns: ColumnDef[] = [
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5 !min-w-80',
    rowSpan: 2,
    key: 'smeta_name',
    header: 'name'
  },
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    rowSpan: 2,
    key: 'smeta_number',
    header: 'smeta_number'
  },
  {
    key: 'summa.ajratilgan_mablag',
    header: 'allocated-funds',
    cellElement: ({ row }) => <span>{row.summa?.ajratilgan_mablag}</span>
  },
  {
    key: 'summa.tulangan_mablag_smeta_buyicha',
    header: 'payed-money',
    cellElement: ({ row }) => <span>{row.summa?.tulangan_mablag_smeta_buyicha}</span>
  },
  {
    key: 'summa.kassa_rasxod',
    header: 'kassa-rasxod',
    cellElement: ({ row }) => <span>{row.summa?.kassa_rasxod}</span>
  },
  {
    key: 'summa.haqiqatda_harajatlar',
    header: 'real-expenses',
    cellElement: ({ row }) => <span>{row.summa?.haqiqatda_harajatlar}</span>
  },
  {
    key: 'summa.qoldiq',
    header: 'ostatok',
    cellElement: ({ row }) => <span>{row.summa?.qoldiq}</span>
  },
  {
    key: 'year_summa.ajratilgan_mablag',
    header: 'allocated-funds',
    cellElement: ({ row }) => <span>{row.year_summa?.ajratilgan_mablag}</span>
  },
  {
    key: 'year_summa.tulangan_mablag_smeta_buyicha',
    header: 'payed-money',
    cellElement: ({ row }) => <span>{row.year_summa?.tulangan_mablag_smeta_buyicha}</span>
  },
  {
    key: 'year_summa.kassa_rasxod',
    header: 'kassa-rasxod',
    cellElement: ({ row }) => <span>{row.year_summa?.kassa_rasxod}</span>
  },
  {
    key: 'year_summa.haqiqatda_harajatlar',
    header: 'real-expenses',
    cellElement: ({ row }) => <span>{row.year_summa?.haqiqatda_harajatlar}</span>
  },
  {
    key: 'year_summa.qoldiq',
    header: 'ostatok',
    cellElement: ({ row }) => <span>{row.year_summa?.qoldiq}</span>
  }
]
