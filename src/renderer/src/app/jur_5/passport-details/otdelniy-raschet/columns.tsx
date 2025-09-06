import type { OtdelniyRaschet } from './service'
import type { ColumnDef } from '@/common/components'

export const DopOplataColumnDefs: ColumnDef<OtdelniyRaschet>[] = [
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
    key: 'nachislenieYear',
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
