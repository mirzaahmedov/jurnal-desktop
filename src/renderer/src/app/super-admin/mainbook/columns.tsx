import type { Mainbook } from '@renderer/common/models'

import { type ColumnDef, ReportStatus } from '@renderer/common/components'
import { getMonthName } from '@renderer/common/lib/date'
import { formatLocaleDateTime } from '@renderer/common/lib/format'

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
    key: 'budjet_name',
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
          <p>{formatLocaleDateTime(row.document_yaratilgan_vaqt)}</p>
        </div>
      )
    }
  },
  {
    key: 'document_qabul_qilingan_vaqt',
    header: 'Действия',
    renderCell(row) {
      return row.user_login_qabul_qilgan ? (
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
    key: 'region_name',
    header: 'Регион'
  }
]
