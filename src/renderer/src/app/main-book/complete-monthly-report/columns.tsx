import { Badge } from '@renderer/common/components/ui/badge'
import type { ColumnDef } from '@renderer/common/components'
import type { CompleteMonthlyReport } from '@renderer/common/models'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { getMonthName } from '@renderer/common/lib/date'

export const statusMap = {
  1: (
    <Badge
      variant="secondary"
      className="bg-slate-100 text-slate-500"
    >
      Отправлено
    </Badge>
  ),
  2: (
    <Badge
      variant="secondary"
      className="bg-emerald-100 text-emerald-500"
    >
      Получено
    </Badge>
  ),
  3: (
    <Badge
      variant="secondary"
      className="bg-red-100 text-red-500"
    >
      Отказано
    </Badge>
  )
}

export const completeMonthlyReportColumns: ColumnDef<CompleteMonthlyReport>[] = [
  {
    key: 'month',
    header: 'Месяц',
    renderCell(row) {
      return getMonthName(row.month)
    }
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'user_id',
    header: 'Создатель',
    renderCell(row) {
      return (
        <div>
          <h6 className="font-bold text-base">@{row.user_login}</h6>
          <p>{formatLocaleDate(row.created_at)}</p>
        </div>
      )
    }
  },
  {
    key: 'document_qabul_qilingan_vaqt',
    header: 'Действия',
    renderCell(row) {
      return row.accepted_login ? (
        <div>
          <h6 className="font-bold text-base">
            {row.accepted_login ? `@${row.accepted_login}` : null}
          </h6>
          <p>{row.accepted_time ? formatLocaleDate(row.accepted_time) : null}</p>
        </div>
      ) : null
    }
  },
  {
    key: 'status',
    header: 'Статус',
    renderCell: (row) => statusMap[row.status]
  }
]
