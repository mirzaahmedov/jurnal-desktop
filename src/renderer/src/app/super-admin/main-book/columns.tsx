import { AdminMainbook } from '@renderer/common/models'
import { ColumnDef } from '@renderer/common/components'
import { getMonthName } from '@renderer/common/lib/date'
import { statusMap } from '@renderer/app/main-book/complete-monthly-report/columns'

export const columns: ColumnDef<AdminMainbook>[] = [
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
      return statusMap[row.status]
    }
  },
  {
    key: 'user_id',
    header: 'Создатель',
    renderCell(row) {
      return (
        <div>
          <h6 className="font-bold text-base">@{row.user_login}</h6>
          {/* <p>{formatLocaleDate(row.)}</p> */}
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
          {/* <p>{row.accepted_time ? formatLocaleDate(row.accepted_time) : null}</p> */}
        </div>
      ) : null
    }
  },
  {
    key: 'region_name',
    header: 'Регион'
  }
]
