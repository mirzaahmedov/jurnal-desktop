import type { ColumnDef } from '@/common/components'
import type { RaschetSchet } from '@/common/models'

import { TooltipCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'

export const raschetSchetColumns: ColumnDef<RaschetSchet>[] = [
  {
    key: 'id',
    renderCell: (row) => <IDCell id={row.account_number.id} />
  },
  {
    key: 'raschet_schet',
    header: 'raschet-schet',
    renderCell(row) {
      return row.account_number.raschet_schet
    }
  },
  {
    key: 'organization',
    renderCell(row) {
      return (
        <TooltipCell
          data={row.organization}
          description="inn"
          title={row.organization.name ?? '-'}
          elements={{
            inn: 'ИНН',
            okonx: 'ОКОНХ',
            bank_klient: 'Банк клиент',
            mfo: 'МФО'
          }}
        />
      )
    }
  }
]
