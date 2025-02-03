import type { ExpensesTableRow } from '../details/utils'
import type { ReportTableProps } from './table'
import type { Autocomplete } from '@renderer/common/lib/types'
import type { ComponentType } from 'react'

type ColumnDef = {
  alphanumeric?: boolean
  sticky?: true
  key: Autocomplete<keyof ExpensesTableRow>
  header: string
  className?: string
  hidden?: boolean
  rowSpan?: number
  colSpan?: number
  cellElement?: ComponentType<
    Pick<ReportTableProps, 'onEdit' | 'onDelete'> & { row: ExpensesTableRow }
  >
}

const columns: ColumnDef[] = [
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
    header: 'number'
  },
  {
    key: 'start_debet',
    header: 'start_saldo',
    colSpan: 2
  },
  {
    key: 'start_kredit',
    header: 'Нач. сал.',
    hidden: true
  },
  {
    key: 'jur1_debet',
    header: 'mo-1-short',
    colSpan: 2
  },
  {
    key: 'jur1_kredit',
    header: 'Жур. 1',
    hidden: true
  },
  {
    key: 'jur2_debet',
    header: 'mo-2-short',
    colSpan: 2
  },
  {
    key: 'jur2_kredit',
    header: 'Жур. 2',
    hidden: true
  },
  {
    key: 'jur3_debet',
    header: 'mo-3-short',
    colSpan: 2
  },
  {
    key: 'jur3_kredit',
    header: 'Жур. 3',
    hidden: true
  },
  {
    key: 'jur4_debet',
    header: 'mo-4-short',
    colSpan: 2
  },
  {
    key: 'jur4_kredit',
    header: 'Жур. 4',
    hidden: true
  },
  {
    key: 'jur5_debet',
    header: 'mo-5-short',
    colSpan: 2
  },
  {
    key: 'jur5_kredit',
    header: 'Жур. 5',
    hidden: true
  },
  {
    key: 'jur6_debet',
    header: 'mo-6-short',
    colSpan: 2
  },
  {
    key: 'jur6_kredit',
    header: 'Жур. 6',
    hidden: true
  },
  {
    key: 'jur7_debet',
    header: 'mo-7-short',
    colSpan: 2
  },
  {
    key: 'jur7_kredit',
    header: 'Жур. 7',
    hidden: true
  },
  {
    key: 'jur8_debet',
    header: 'mo-8-short',
    colSpan: 2
  },
  {
    key: 'jur8_kredit',
    header: 'Жур. 8',
    hidden: true
  },
  {
    key: 'itogo_debet',
    header: 'month-phase',
    colSpan: 2
  },
  {
    key: 'itogo_kredit',
    header: 'month-phase',
    hidden: true
  },
  {
    key: 'end_debet',
    header: 'end_saldo',
    colSpan: 2
  },
  {
    key: 'end_kredit',
    header: 'end_saldo',
    hidden: true
  }
]

export { columns }
export type { ColumnDef }
