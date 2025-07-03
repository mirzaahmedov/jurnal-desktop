import type { ColumnDef } from '@/common/components'
import type { Deduction } from '@/common/models/deduction'

import { IDCell } from '@/common/components/table/renderers/id'

export const PaymentColumnDefs: ColumnDef<Deduction>[] = [
  {
    key: 'id',
    minWidth: 120,
    renderCell: IDCell
  },
  {
    key: 'code'
  },
  {
    minWidth: 200,
    key: 'name'
  },
  {
    minWidth: 200,
    key: 'shortName',
    header: 'name_short'
  },
  {
    width: 80,
    minWidth: 80,
    key: 'debitAccount',
    header: 'expense_schet'
  },
  {
    width: 80,
    minWidth: 80,
    key: 'creditAccount',
    header: 'credit_schet'
  },
  {
    width: 80,
    minWidth: 80,
    key: 'subAccount',
    header: 'subschet'
  },
  {
    minWidth: 300,
    key: 'calculationFormula',
    header: 'calc_formula'
  }
]
