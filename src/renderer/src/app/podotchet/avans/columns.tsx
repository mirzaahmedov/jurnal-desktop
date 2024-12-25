import type { Avans } from '@/common/models'
import type { ColumnDef } from '@/common/components'
import { TooltipCellRenderer } from '@/common/components/table/renderers/tooltip'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const avansColumns: ColumnDef<Avans>[] = [
  {
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    key: 'doc_date',
    header: 'Документ дата',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'spravochnik_podotchet_litso_id',
    header: 'Подотчёт лицо',
    renderCell: (row) => (
      <TooltipCellRenderer
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
    key: 'summa',
    header: 'Сумма'
  },
  {
    key: 'opisanie',
    header: 'Описание'
  }
]
