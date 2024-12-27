import { ReportStatus, type ColumnDef } from '@renderer/common/components'
import type { Mainbook } from '@renderer/common/models'
import { formatLocaleDateTime } from '@renderer/common/lib/format'
import { getMonthName } from '@renderer/common/lib/date'

export const columns: ColumnDef<Mainbook.AdminReport>[] = [
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'month',
    header: 'Месяц',
    renderCell(row) {
      return getMonthName(row.month)
    }
  },
  {
    key: 'name',
    header: 'Бюджет'
  },
  {
    key: 'status',
    header: 'Статус',
    renderCell(row) {
      return <ReportStatus status={row.status} />
    }
  },
  {
    key: 'user_id',
    header: 'Создатель',
    renderCell(row) {
      return (
        <div>
          <h6 className="font-bold text-base">@{row.user_login}</h6>
          <p>{formatLocaleDateTime(row.created_at)}</p>
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
          <p>{row.accepted_time ? formatLocaleDateTime(row.accepted_time) : null}</p>
        </div>
      ) : null
    }
  },
  {
    key: 'region_name',
    header: 'Регион'
  }
]
