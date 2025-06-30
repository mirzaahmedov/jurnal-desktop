import type { ColumnDef } from '@/common/components'
import type { Workplace } from '@/common/models/workplace'

import { IDCell } from '@/common/components/table/renderers/id'

export const WorkplaceColumns: ColumnDef<Workplace>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'poryadNum',
    header: 'numeric-order'
  },
  {
    key: 'rayon'
  },
  {
    numeric: true,
    key: 'setka',
    header: 'net'
  },
  {
    key: 'prOk',
    header: 'pr_ok'
  },
  {
    numeric: true,
    key: 'oklad'
  },
  {
    numeric: true,
    key: 'okladPrikaz',
    header: 'prikaz_oklad'
  },
  {
    key: 'stavka'
  },
  {
    key: 'stavkaPrikaz',
    header: 'prikaz_stavka'
  }
]
