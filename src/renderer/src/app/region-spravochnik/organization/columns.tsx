import type { ColumnDef } from '@/common/components'
import type { Organization } from '@/common/models'

import { Copyable } from '@/common/components'

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    key: 'name',
    className: 'min-w-80'
  },
  {
    key: 'inn',
    renderCell(row) {
      return <Copyable value={row.inn}>{row.inn}</Copyable>
    }
  },
  {
    key: 'mfo',
    renderCell(row) {
      return <Copyable value={row.mfo}>{row.mfo}</Copyable>
    }
  },
  {
    key: 'bank_klient',
    header: 'bank',
    className: 'min-w-80 w-full break-all'
  },
  {
    key: 'raschet_schet',
    header: 'raschet-schet',
    renderCell(row) {
      return <Copyable value={row.raschet_schet}>{row.raschet_schet}</Copyable>
    }
  },
  {
    key: 'raschet_schet_gazna',
    header: 'raschet-schet-gazna',
    renderCell(row) {
      return <Copyable value={row.raschet_schet_gazna}>{row.raschet_schet_gazna}</Copyable>
    }
  }
]
