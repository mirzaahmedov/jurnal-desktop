import type { ColumnDef } from '@renderer/common/components'
import type { Zarplata } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const columnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  },
  {
    key: 'spravochnikOperatsiiName',
    header: 'operatsii'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'schet'
  },
  {
    key: 'subSchet',
    header: 'subschet'
  },
  {
    numeric: true,
    key: 'sena1',
    header: 'sena_1'
  },
  {
    numeric: true,
    key: 'sena2',
    header: 'sena_2'
  }
]
