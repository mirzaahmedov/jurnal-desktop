import type { ColumnDef } from '@renderer/common/components'
import type { RealExpenses } from '@renderer/common/models'

import { Badge } from '@renderer/common/components/ui/badge'
import { getMonthName } from '@renderer/common/lib/date'
import { formatLocaleDateTime } from '@renderer/common/lib/format'

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

export const expensesColumns: ColumnDef<RealExpenses.ReportPreview>[] = [
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
          <p>{formatLocaleDateTime(row.document_yaratilgan_vaqt)}</p>
        </div>
      )
    }
  },
  {
    key: 'accepted_id',
    header: 'Действия',
    renderCell(row) {
      return row.user_id_qabul_qilgan ? (
        <div>
          <h6 className="font-bold text-base">
            {row.user_login_qabul_qilgan ? `@${row.user_login_qabul_qilgan}` : null}
          </h6>
          <p>
            {row.document_qabul_qilingan_vaqt
              ? formatLocaleDateTime(row.document_qabul_qilingan_vaqt)
              : null}
          </p>
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
