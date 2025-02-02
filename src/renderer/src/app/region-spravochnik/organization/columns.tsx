import type { ColumnDef } from '@/common/components'
import type { Organization } from '@/common/models'

import { Copyable } from '@/common/components'

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    key: 'name',
    header: 'Название',
    className: 'min-w-80'
  },
  {
    key: 'inn',
    header: 'ИНН',
    renderCell(row) {
      return <Copyable value={row.inn}>{row.inn}</Copyable>
    }
  },
  {
    key: 'mfo',
    header: 'МФО',
    renderCell(row) {
      return <Copyable value={row.mfo}>{row.mfo}</Copyable>
    }
  },
  {
    key: 'bank_klient',
    header: 'Название банка',
    className: 'min-w-80 w-full break-all'
  },
  {
    key: 'raschet_schet',
    header: 'Расчетный счет',
    renderCell(row) {
      return <Copyable value={row.raschet_schet}>{row.raschet_schet}</Copyable>
    }
  },
  {
    key: 'raschet_schet_gazna',
    header: 'Расчетный счет газна',
    renderCell(row) {
      return <Copyable value={row.raschet_schet_gazna}>{row.raschet_schet_gazna}</Copyable>
    }
  }
]
