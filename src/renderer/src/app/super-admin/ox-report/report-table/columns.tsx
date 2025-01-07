import type { Autocomplete } from '@renderer/common/lib/types'
import type { ComponentType } from 'react'
import { OX } from '@renderer/common/models'
import type { ReportTableProps } from './table'

type ColumnDef = {
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

const columns: ColumnDef[] = [
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5 !min-w-80',
    rowSpan: 2,
    key: 'smeta_name',
    header: 'Наименование сметы'
  },
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    rowSpan: 2,
    key: 'smeta_number',
    header: 'Номер сметы'
  },
  {
    key: 'summa.ajratilgan_mablag',
    header: 'Ажратилган маблағ',
    cellElement: ({ row }) => <span>{row.summa.ajratilgan_mablag}</span>
  },
  {
    key: 'summa.tulangan_mablag_smeta_buyicha',
    header: 'Туланган маблағ смета бўйича',
    cellElement: ({ row }) => <span>{row.summa.tulangan_mablag_smeta_buyicha}</span>
  },
  {
    key: 'summa.kassa_rasxod',
    header: 'Касса расход',
    cellElement: ({ row }) => <span>{row.summa.kassa_rasxod}</span>
  },
  {
    key: 'summa.haqiqatda_harajatlar',
    header: 'Хакикатда харажатлар',
    cellElement: ({ row }) => <span>{row.summa.haqiqatda_harajatlar}</span>
  },
  {
    key: 'summa.qoldiq',
    header: 'Колдик',
    cellElement: ({ row }) => <span>{row.summa.qoldiq}</span>
  },
  {
    key: 'year_summa.ajratilgan_mablag',
    header: 'Ажратилган маблағ',
    cellElement: ({ row }) => <span>{row.year_summa?.ajratilgan_mablag}</span>
  },
  {
    key: 'year_summa.tulangan_mablag_smeta_buyicha',
    header: 'Туланган маблағ смета бўйича',
    cellElement: ({ row }) => <span>{row.year_summa?.tulangan_mablag_smeta_buyicha}</span>
  },
  {
    key: 'year_summa.kassa_rasxod',
    header: 'Касса расход',
    cellElement: ({ row }) => <span>{row.year_summa?.kassa_rasxod}</span>
  },
  {
    key: 'year_summa.haqiqatda_harajatlar',
    header: 'Хакикатда харажатлар',
    cellElement: ({ row }) => <span>{row.year_summa?.haqiqatda_harajatlar}</span>
  },
  {
    key: 'year_summa.qoldiq',
    header: 'Колдик',
    cellElement: ({ row }) => <span>{row.year_summa?.qoldiq}</span>
  }
]

export { columns }
export type { ColumnDef }
