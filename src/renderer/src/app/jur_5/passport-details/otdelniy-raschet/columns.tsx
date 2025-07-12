import type { ColumnDef } from '@/common/components'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'

import { IDCell } from '@/common/components/table/renderers/id'

export const OtdelniyRaschetColumnDefs: ColumnDef<OtdelniyRaschet>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'prikazNum',
    header: 'order_number'
  },
  {
    key: 'prikazDate',
    header: 'order_date'
  },
  {
    key: 'opisanie'
  },
  {
    key: 'forMonth',
    header: 'for_month'
  },
  {
    key: 'forYear',
    header: 'for_year'
  },
  {
    key: 'summa'
  }
]
