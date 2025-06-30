import type { ColumnDef } from '@/common/components'
import type { Workplace } from '@/common/models/workplace'

import { IDCell } from '@/common/components/table/renderers/id'

export const WorkplaceColumns: ColumnDef<Workplace>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    minWidth: 90
  },
  {
    minWidth: 80,
    key: 'poryadNum',
    header: 'numeric-order'
  },
  {
    minWidth: 300,
    key: 'spravochnikZarpaltaDoljnostName',
    header: 'doljnost'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'setka',
    header: 'net'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'koef',
    header: 'razryad'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'oklad'
  },
  {
    key: 'prOk',
    header: 'pr_ok',
    className: 'text-center'
  },
  {
    key: 'stavka',
    className: 'text-center'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'okladPrikaz',
    header: 'prikaz_oklad'
  },
  {
    minWidth: 200,
    key: 'spravochnikZarplataIstochnikFinanceName',
    header: 'source_of_finance'
  },
  {
    minWidth: 200,
    key: 'spravochnikSostavName',
    header: 'sostav'
  }
]
