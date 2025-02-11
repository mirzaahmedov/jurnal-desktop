import type { ColumnDef } from '@/common/components'
import type { Avans } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'

import { TooltipCell } from '@/common/components/table/renderers/tooltip'

export const avansColumns: ColumnDef<Avans>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'spravochnik_podotchet_litso_id',
    header: 'podotchet-litso',
    renderCell: (row) => (
      <TooltipCell
        data={row}
        title={row.spravochnik_podotchet_litso_name}
        description="spravochnik_podotchet_litso_rayon"
        elements={{
          spravochnik_podotchet_litso_rayon: 'Регион'
        }}
      />
    )
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'opisanie'
  }
]
