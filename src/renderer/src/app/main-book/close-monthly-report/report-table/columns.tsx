import type { Autocomplete } from '@renderer/common/lib/types'
import type { CloseMonthlyReportTableItem } from '@renderer/common/models'
import type { ComponentType } from 'react'
import type { ReportTableProps } from './table'

type ColumnDef = {
  alphanumeric?: boolean
  sticky?: true
  key: Autocomplete<keyof CloseMonthlyReportTableItem>
  header: string
  className?: string
  hidden?: boolean
  rowSpan?: number
  colSpan?: number
  cellElement?: ComponentType<
    Pick<ReportTableProps, 'onEdit' | 'onDelete'> & { row: CloseMonthlyReportTableItem }
  >
}

const columns: ColumnDef[] = [
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5 max-w-80',
    rowSpan: 2,
    key: 'name',
    header: 'Операция'
  },
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    rowSpan: 2,
    key: 'schet',
    header: 'Счет'
  },
  {
    key: 'start_debet',
    header: 'Нач. сал. ',
    colSpan: 2
  },
  {
    key: 'start_kredit',
    header: 'Нач. сал.',
    hidden: true
  },
  {
    key: 'jur1_debet',
    header: 'Жур. 1',
    colSpan: 2
  },
  {
    key: 'jur1_kredit',
    header: 'Жур. 1',
    hidden: true
  },
  {
    key: 'jur2_debet',
    header: 'Жур. 2',
    colSpan: 2
  },
  {
    key: 'jur2_kredit',
    header: 'Жур. 2',
    hidden: true
  },
  {
    key: 'jur3_debet',
    header: 'Жур. 3',
    colSpan: 2
  },
  {
    key: 'jur3_kredit',
    header: 'Жур. 3',
    hidden: true
  },
  {
    key: 'jur4_debet',
    header: 'Жур. 4',
    colSpan: 2
  },
  {
    key: 'jur4_kredit',
    header: 'Жур. 4',
    hidden: true
  },
  {
    key: 'jur5_debet',
    header: 'Жур. 5',
    colSpan: 2
  },
  {
    key: 'jur5_kredit',
    header: 'Жур. 5',
    hidden: true
  },
  {
    key: 'jur6_debet',
    header: 'Жур. 6',
    colSpan: 2
  },
  {
    key: 'jur6_kredit',
    header: 'Жур. 6',
    hidden: true
  },
  {
    key: 'jur7_debet',
    header: 'Жур. 7',
    colSpan: 2
  },
  {
    key: 'jur7_kredit',
    header: 'Жур. 7',
    hidden: true
  },
  {
    key: 'jur8_debet',
    header: 'Жур. 8',
    colSpan: 2
  },
  {
    key: 'jur8_kredit',
    header: 'Жур. 8',
    hidden: true
  },
  {
    key: 'end_debet',
    header: 'Ой оборотка',
    colSpan: 2
  },
  {
    key: 'end_kredit',
    header: 'Ой оборотка',
    hidden: true
  }
]

export { columns }
export type { ColumnDef }
