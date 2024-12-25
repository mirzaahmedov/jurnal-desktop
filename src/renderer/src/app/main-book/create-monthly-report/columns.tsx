import { Badge } from '@renderer/common/components/ui/badge'
import type { ColumnDef } from '@renderer/common/components'
import type { OpenMonthlyReport } from '@renderer/common/models'
import { documentTypes } from '../common/data'
import { formatNumber } from '@renderer/common/lib/format'
import { getMonthName } from '@renderer/common/lib/date'

export const openMonthlyReportColumns: ColumnDef<OpenMonthlyReport>[] = [
  {
    key: 'month',
    header: 'Месяц',
    renderCell: (row) => {
      return getMonthName(row.month)
    }
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    numeric: true,
    key: 'summa.debet_sum',
    header: 'Дебет',
    renderCell(row) {
      return formatNumber(row.summa?.debet_sum)
    }
  },
  {
    numeric: true,
    key: 'summa.kredit',
    header: 'Кредит',
    renderCell(row) {
      return formatNumber(row.summa?.kredit_sum)
    }
  },
  {
    key: 'type_document',
    header: 'Тип документа',
    renderCell: (row) => {
      const found = documentTypes.find((type) => type.key === row.type_document)
      return found ? (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-500"
        >
          {found.name}
        </Badge>
      ) : null
    }
  }
]
