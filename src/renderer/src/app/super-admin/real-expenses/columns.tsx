import type { RealExpenses } from '@renderer/common/models'

import { type ColumnDef, ReportStatus } from '@renderer/common/components'
import { getMonthName } from '@renderer/common/lib/date'
import { formatLocaleDateTime } from '@renderer/common/lib/format'

export const columns: ColumnDef<RealExpenses.AdminReport>[] = [
  {
    key: 'year'
  },
  {
    key: 'month',
    renderCell(row) {
      return getMonthName(row.month)
    }
  },
  {
    key: 'budjet_name',
    header: 'budjet'
  },
  {
    key: 'status',
    renderCell(row) {
      return <ReportStatus status={row.status} />
    }
  },
  {
    key: 'user_id',
    header: 'creator',
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
    header: 'action',
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
    key: 'region_name',
    header: 'region'
  }
]
