import type { ColumnDef } from '@/common/components'
import type { MainSchet } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { TooltipCell } from '@renderer/common/components/table/renderers/tooltip-old'

export const mainSchetColumns: ColumnDef<MainSchet>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'account_name',
    header: 'name'
  },
  {
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'gazna_number',
    header: 'raschet-schet-gazna'
  },
  {
    key: 'tashkilot_inn',
    header: 'organization',
    renderCell(row) {
      return (
        <TooltipCell
          data={row}
          title={row.tashkilot_nomi}
          description="tashkilot_inn"
          elements={{
            tashkilot_inn: 'ИНН',
            tashkilot_bank: 'Банк',
            tashkilot_mfo: 'МФО',
            tashkilot_nomi: 'Название'
          }}
        />
      )
    }
  },
  {
    key: 'budjet_name',
    header: 'budjet'
  }
]
