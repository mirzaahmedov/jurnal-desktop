import type { ColumnDef } from '@renderer/common/components'
import type { Iznos } from '@renderer/common/models'

export const columns: ColumnDef<Iznos>[] = [
  {
    key: 'inventar_num',
    header: 'Инвентар №'
  }
]
