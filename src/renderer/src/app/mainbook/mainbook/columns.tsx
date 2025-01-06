import { ReportStatus, type ColumnDef } from '@renderer/common/components'
import type { Mainbook } from '@renderer/common/models'
import { formatLocaleDateTime } from '@renderer/common/lib/format'
import { getMonthName } from '@renderer/common/lib/date'

export const mainbookColumns: ColumnDef<Mainbook.ReportPreview>[] = [
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
    key: 'document_qabul_qilingan_vaqt',
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
    renderCell: (row) => <ReportStatus status={row.status} />
  }
]
