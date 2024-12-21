import type { CloseMonthlyReport } from '@renderer/common/models'
import type { ColumnDef } from '@renderer/common/components'

const closeMonthlyReportColumns: ColumnDef<CloseMonthlyReport>[] = [
  {
    key: 'month',
    header: 'Месяц'
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'user_id',
    header: 'Создатель'
  },
  {
    key: 'user_id_qabul_qilgan',
    header: 'Действия'
  },
  {
    key: 'status',
    header: 'Статус'
  }
]

export { closeMonthlyReportColumns }
