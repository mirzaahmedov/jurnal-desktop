import type { ColumnDef } from '@/common/components'

import { Trans } from 'react-i18next'

import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { UserCell } from '@/common/components/table/renderers/user'
import { Badge } from '@/common/components/ui/badge'
import { cn } from '@/common/lib/utils'
import { type AdminRealCost, ReportStatus } from '@/common/models'

export const AdminRealCostColumns: ColumnDef<AdminRealCost>[] = [
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
    key: 'status',
    renderCell: (row) => (
      <Badge
        className={cn(
          row.status === ReportStatus.REJECT && 'bg-red-500',
          row.status === ReportStatus.ACCEPT && 'bg-green-500'
        )}
      >
        {row.status === ReportStatus.SEND ? (
          <Trans>reports_common.send</Trans>
        ) : row.status === ReportStatus.REJECT ? (
          <Trans>reports_common.reject</Trans>
        ) : (
          <Trans>reports_common.accept</Trans>
        )}
      </Badge>
    )
  },
  {
    key: 'region_name',
    header: 'region',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.region_name}
        secondaryText={
          <>
            <Trans>raschet-schet</Trans>: {row.account_number}
          </>
        }
      />
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
