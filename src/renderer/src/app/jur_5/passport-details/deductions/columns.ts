import type { ColumnDef } from '@/common/components'
import type { UderjanieNew } from '@/common/models/uderjanie_new'

export const DeductionsColumnDefs: ColumnDef<UderjanieNew>[] = [
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'spravochnikZarplataId',
    header: 'name'
  },
  {
    key: 'type'
  },
  {
    key: 'razmer',
    header: 'size'
  },
  {
    key: 'summa'
  },
  {
    key: 'deadline'
  },
  {
    key: 'stop'
  },
  {
    key: 'typeCode'
  },
  {
    key: 'typesTypeCode'
  },
  {
    key: 'elements',
    header: 'listed_accruals'
  }
]
