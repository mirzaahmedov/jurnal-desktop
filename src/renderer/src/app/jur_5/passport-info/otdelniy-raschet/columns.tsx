import type { ColumnDef } from '@/common/components'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'

export const OtdelniyRaschetColumnDefs: ColumnDef<OtdelniyRaschet>[] = [
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'docDate',
    header: 'doc_date'
  },
  {
    key: 'nachislenieYear',
    header: 'year'
  },
  {
    key: 'nachislenieMonth',
    header: 'month'
  },
  {
    key: 'rabDni',
    header: 'workdays'
  },
  {
    key: 'otrabDni',
    header: 'worked_days'
  },
  {
    key: 'noch',
    header: 'night_shift'
  },
  {
    key: 'pererabodka',
    header: 'overtime'
  },
  {
    key: 'prazdnik',
    header: 'holiday'
  },
  {
    key: 'kazarma'
  }
]
