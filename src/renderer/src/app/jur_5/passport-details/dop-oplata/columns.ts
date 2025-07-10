import type { ColumnDef } from '@/common/components'
import type { DopOplata } from '@/common/models/dop-oplata'

export const DopOplataColumnDefs: ColumnDef<DopOplata>[] = [
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'typesName',
    header: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'razmer',
    header: 'size'
  },
  {
    key: 'elements',
    header: 'listed_accruals'
  }
]
