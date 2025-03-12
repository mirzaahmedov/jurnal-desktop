import type { User } from '@renderer/common/models'

import { type ColumnDef, Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { Trans } from 'react-i18next'

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
        hoverContent={
          <DataList
            list={[
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
