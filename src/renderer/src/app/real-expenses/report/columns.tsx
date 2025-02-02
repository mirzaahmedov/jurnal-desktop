import type { ColumnDef } from '@renderer/common/components'
import type { RealExpenses } from '@renderer/common/models'

import { Badge } from '@renderer/common/components/ui/badge'
import { getMonthName } from '@renderer/common/lib/date'

import { documentTypes } from '../common/data'

export const expensesReportColumns: ColumnDef<RealExpenses.Report>[] = [
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
    key: 'debet_sum',
    header: 'Дебет'
  },
  {
    numeric: true,
    key: 'kredit_sum',
    header: 'Кредит'
  },
  {
    key: 'type_document',
    header: 'Тип документа',
    renderCell: (row) => {
      const found = documentTypes.find((type) => type.key === row.type_document)
      return found ? (
        <Badge
          variant="secondary"
          className="bg-brand/10 text-brand"
        >
          {found.name}
        </Badge>
      ) : null
    }
  }
]
