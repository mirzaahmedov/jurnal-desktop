import type { ColumnDef } from '@/common/components'
import type { RaschetSchetGazna } from '@/common/models'

import { TooltipCell } from '@renderer/common/components/table/renderers'

export const raschetSchetGaznaColumns: ColumnDef<RaschetSchetGazna>[] = [
  {
    key: 'raschet_schet',
    header: 'raschet-schet-gazna',
    renderCell(row) {
      return row.gazna.raschet_schet_gazna
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
