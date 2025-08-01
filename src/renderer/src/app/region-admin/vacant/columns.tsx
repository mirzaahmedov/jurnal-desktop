import type { User } from '@/common/models'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'

export const columnDefs: ColumnDef<User>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'fio',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.fio}
        secondaryText={`@${row.login}`}
        tooltipContent={
          <DataList
            items={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.id}
                  >
                    #{row.id}
                  </Copyable>
                )
              },
              {
                name: <Trans>fio</Trans>,
                value: row.fio
              },
              {
                name: <Trans>login</Trans>,
                value: row.login
              },
              {
                name: <Trans>region</Trans>,
                value: row.region_name
              },
              {
                name: <Trans>role</Trans>,
                value: row.role_name
              }
            ]}
          />
        }
      />
    )
  }
]
