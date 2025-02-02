import type { ColumnDef } from '@/common/components'
import type { MainSchet } from '@/common/models'

import { TooltipCellRenderer } from '@/common/components/table/renderers/tooltip'

export const mainSchetColumns: ColumnDef<MainSchet>[] = [
  {
    key: 'account_name',
    header: 'Название'
  },
  {
    key: 'account_number',
    header: 'Номер'
  },
  {
    key: 'tashkilot_inn',
    header: 'Организация',
    renderCell(row) {
      return (
        <TooltipCellRenderer
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
    header: 'Бюджет'
  }
]
