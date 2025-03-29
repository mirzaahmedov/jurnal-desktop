import type { ColumnDef } from '@renderer/common/components'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { MonthNameCell } from '@renderer/common/components/table/renderers/month-name'
import { UserCell } from '@renderer/common/components/table/renderers/user'
import { Badge } from '@renderer/common/components/ui/badge'
import { cn } from '@renderer/common/lib/utils'
import { type AdminMainbook, MainbookStatus } from '@renderer/common/models'
import { Trans } from 'react-i18next'

export const mainbookColumns: ColumnDef<AdminMainbook>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.month} />
  },
  {
    key: 'year'
  },
  {
    key: 'region_name',
    header: 'region'
  },
  {
    key: 'status',
    renderCell: (row) => (
      <Badge
        className={cn(
          row.status === MainbookStatus.REJECT && 'bg-red-500',
          row.status === MainbookStatus.ACCEPT && 'bg-green-500'
        )}
      >
        {row.status === MainbookStatus.SEND ? (
          <Trans>mainbook.send</Trans>
        ) : row.status === MainbookStatus.REJECT ? (
          <Trans>mainbook.reject</Trans>
        ) : (
          <Trans>mainbook.accept</Trans>
        )}
      </Badge>
    )
  },
  {
    key: 'accept_user_id',
    header: 'accepted-by-user',
    renderCell: (row) =>
      row.accept_user_id ? (
        <UserCell
          fio={row.accept_user_fio!}
          login={row.accept_user_login!}
          id={row.accept_user_id!}
        />
      ) : null
  },
  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        fio={row.fio}
        login={row.login}
        id={row.user_id}
      />
    )
  }
]
