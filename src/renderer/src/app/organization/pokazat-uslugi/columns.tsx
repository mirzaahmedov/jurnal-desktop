import type { ColumnDef } from '@/common/components'
import type { PokazatUslugi } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'
import { TooltipCellRenderer } from '@/common/components/table/renderers'

export const pokazatUslugiColumns: ColumnDef<PokazatUslugi>[] = [
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
    key: 'id_spravochnik_organization',
    header: 'Организация',
    renderCell: (row) => (
      <TooltipCellRenderer
        data={row}
        title={row.spravochnik_organization_name}
        elements={{
          spravochnik_organization_inn: 'ИНН',
          spravochnik_organization_raschet_schet: 'Расчетный счет'
        }}
        description="spravochnik_organization_inn"
      />
    )
  },
  {
    key: 'shartnomalar_organization_id',
    header: 'О договоре',
    renderCell: (row) => (
      <div>
        <h6 className="text-base leading-none font-bold">
          <span>№: </span>
          {row.shartnomalar_organization_doc_num}
        </h6>
        <p className="text-xs text-slate-500 font-medium mt-2">
          {row.shartnomalar_organization_doc_date}
        </p>
      </div>
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
