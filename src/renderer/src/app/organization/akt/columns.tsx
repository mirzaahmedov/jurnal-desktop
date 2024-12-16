import type { ColumnDef } from '@/common/components'
import type { Akt } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'
import { Copyable } from '@/common/components'
import { TooltipCellRenderer } from '@/common/components/table/renderers'

export const columns: ColumnDef<Akt>[] = [
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
    renderCell: (row) =>
      row.shartnomalar_organization_doc_num ? (
        <div>
          <h6 className="text-sm leading-none font-bold">
            <span>№ </span>
            <span>{row.shartnomalar_organization_doc_num}</span>
          </h6>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            <Copyable value={row.shartnomalar_organization_doc_date}>
              <div>{formatLocaleDate(row.shartnomalar_organization_doc_date)}</div>
            </Copyable>
          </p>
        </div>
      ) : (
        '-'
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
