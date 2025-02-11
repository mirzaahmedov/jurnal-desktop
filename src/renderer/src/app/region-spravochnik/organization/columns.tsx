import type { ColumnDef } from '@/common/components'
import type { Organization } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

import { Copyable } from '@/common/components'

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
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
      return row.account_numbers?.map((schet) => schet.raschet_schet)?.join(',')
    }
  },
  {
    fit: true,
    key: 'raschet_schet_gazna',
    header: 'raschet-schet-gazna',
    renderCell(row) {
      return row.gaznas?.map((schet) => schet.raschet_schet_gazna)?.join(',')
    }
  }
]
