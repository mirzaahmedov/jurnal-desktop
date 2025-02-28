import type { ColumnDef } from '@/common/components'
import type { Organization } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

import { Copyable } from '@/common/components'

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    key: 'id',
    className: 'pr-1',
    renderCell: IDCell
  },
  {
    key: 'name',
    className: 'min-w-[300px]'
  },
  {
    key: 'inn',
    className: 'pr-0',
    renderCell(row) {
      return (
        <Copyable
          value={row.inn}
          className="gap-0"
        >
          {row.inn}
        </Copyable>
      )
    }
  },
  {
    key: 'mfo',
    className: 'pr-0',
    renderCell(row) {
      return (
        <Copyable
          value={row.mfo}
          className="gap-0"
        >
          {row.mfo}
        </Copyable>
      )
    }
  },
  {
    key: 'bank_klient',
    header: 'bank',
    className: 'min-w-[300px] break-all'
  },
  {
    key: 'raschet_schet',
    header: 'raschet-schet',
    className: 'py-2 pr-0',
    renderCell(row) {
      return (
        <ul>
          {row.account_numbers?.map((schet) => (
            <li key={schet.id}>
              <Copyable
                className="gap-0"
                value={schet.raschet_schet}
              >
                {schet.raschet_schet}
              </Copyable>
            </li>
          ))}
        </ul>
      )
      return
    }
  },
  {
    fit: true,
    key: 'raschet_schet_gazna',
    header: 'raschet-schet-gazna',
    className: 'py-2 pr-0',
    renderCell(row) {
      return (
        <ul>
          {row.gaznas?.map((schet) => (
            <li key={schet.id}>
              <Copyable
                className="gap-0"
                value={schet.raschet_schet_gazna}
              >
                {schet.raschet_schet_gazna}
              </Copyable>
            </li>
          ))}
        </ul>
      )
    }
  }
]
