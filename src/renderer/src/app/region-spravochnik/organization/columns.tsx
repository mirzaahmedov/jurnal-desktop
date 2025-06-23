import type { ColumnDef } from '@/common/components'
import type { Organization } from '@/common/models'

import { Copyable } from '@/common/components'
import { ExpandableList } from '@/common/components/table/renderers/expandable-list'
import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'

export const OrganizationColumns: ColumnDef<Organization>[] = [
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
    fit: true,
    key: 'raschet_schet',
    header: 'raschet-schet',
    className: 'py-2',
    renderCell: (row) => (
      <ExpandableList
        items={row.account_numbers}
        renderItem={(account_number) => (
          <Copyable
            side="start"
            className="gap-0 text-sm"
            value={account_number.raschet_schet}
          >
            {account_number.raschet_schet}
          </Copyable>
        )}
      />
    )
  },
  {
    fit: true,
    key: 'raschet_schet_gazna',
    header: 'raschet-schet-gazna',
    className: 'py-2',
    renderCell: (row) => (
      <ExpandableList
        items={row.gaznas}
        renderItem={(gazna) => (
          <Copyable
            side="start"
            className="gap-0 text-sm"
            value={gazna.raschet_schet_gazna}
          >
            {gazna.raschet_schet_gazna}
          </Copyable>
        )}
      />
    )
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]
