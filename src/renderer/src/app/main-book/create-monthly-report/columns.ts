import type { ColumnDef } from '@renderer/common/components'
import type { CreateMonthlyReport } from '@renderer/common/models'

const createMonthlyReportColumns: ColumnDef<CreateMonthlyReport>[] = [
  {
    key: 'month',
    header: 'Месяц'
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'kredit',
    header: 'Кредит'
  },
  {
    key: 'debet_sum',
    header: 'Дебет'
  },
  {
    key: 'type_document',
    header: 'Тип документа'
  }
]

export { createMonthlyReportColumns }
