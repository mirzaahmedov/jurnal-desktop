import type { Autocomplete } from '@renderer/common/lib/types'
import type { CloseMonthlyReportDetails } from '@renderer/common/models'
import type { ComponentType } from 'react'
import type { ReportTableProps } from './table'

type ColumnDef = {
  alphanumeric?: boolean
  sticky?: true
  key: Autocomplete<keyof CloseMonthlyReportDetails>
  header: string
  className?: string
  cellElement?: ComponentType<
    Pick<ReportTableProps, 'onEdit' | 'onDelete'> & { row: CloseMonthlyReportDetails }
  >
}

const columns: ColumnDef[] = [
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    key: 'spravochnik_operatsii_name',
    header: 'Операция'
  },
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    key: 'spravochnik_operatsii_schet',
    header: 'Счет'
  },
  {
    key: 'start_debet',
    header: 'Нач. сал. дебет'
  },
  {
    key: 'start_kredit',
    header: 'Нач. сал. кредит'
  },
  {
    key: 'jur1_debet',
    header: 'Жур. 1 дебет'
  },
  {
    key: 'jur1_kredit',
    header: 'Жур. 1 кредит'
  },
  {
    key: 'jur2_debet',
    header: 'Жур. 2 дебет'
  },
  {
    key: 'jur2_kredit',
    header: 'Жур. 2 кредит'
  },
  {
    key: 'jur5_debet',
    header: 'Жур. 5 дебет'
  },
  {
    key: 'jur5_kredit',
    header: 'Жур. 5 кредит'
  },
  {
    key: 'jur6_debet',
    header: 'Жур. 6 дебет'
  },
  {
    key: 'jur6_kredit',
    header: 'Жур. 6 кредит'
  },
  {
    key: 'jur7_debet',
    header: 'Жур. 7 дебет'
  },
  {
    key: 'jur7_kredit',
    header: 'Жур. 7 кредит'
  },
  {
    key: 'jur8_debet',
    header: 'Жур. 8 дебет'
  },
  {
    key: 'jur8_kredit',
    header: 'Жур. 8 кредит'
  },
  {
    sticky: true,
    key: 'end_debet',
    header: 'Ой оборотка дебет'
  },
  {
    sticky: true,
    key: 'end_kredit',
    header: 'Ой оборотка кредит'
  }
]

export { columns }
export type { ColumnDef }
