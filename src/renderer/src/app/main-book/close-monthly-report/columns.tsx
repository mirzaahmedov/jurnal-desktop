import type { CloseMonthlyReport } from '@renderer/common/models'
import type { ColumnDef } from '@renderer/common/components'
import { formatLocaleDate } from '@renderer/common/lib/format'

const statusMap = {
  1: 'Отправлено',
  2: 'Получено',
  3: 'Отказано'
}

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
    header: 'Создатель',
    renderCell(row) {
      return (
        <div>
          <h6 className="font-bold text-base">@{row.login}</h6>
          <p>{formatLocaleDate(row.document_yaratilgan_vaqt)}</p>
        </div>
      )
    }
  },
  {
    key: 'document_qabul_qilingan_vaqt',
    header: 'Действия',
    renderCell(row) {
      return row.cofirm_login || row.document_qabul_qilingan_vaqt ? (
        <div>
          <h6 className="font-bold text-base">
            {row.cofirm_login ? `@${row.cofirm_login}` : null}
          </h6>
          <p>
            {row.document_qabul_qilingan_vaqt
              ? formatLocaleDate(row.document_yaratilgan_vaqt)
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

export { closeMonthlyReportColumns }
