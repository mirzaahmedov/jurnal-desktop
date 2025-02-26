import type { ColumnDef } from '@/common/components'
import type { PokazatUslugi } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { TooltipCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'

export const pokazatUslugiColumns: ColumnDef<PokazatUslugi>[] = [
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
    key: 'id_spravochnik_organization',
    header: 'organization',
    renderCell: (row) => (
      <TooltipCell
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
    header: 'shartnoma',
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
    renderCell: (row) => (
      <ProvodkaCell
        summa={row.summa}
        provodki={row.provodki_array}
      />
    )
  },
  {
    key: 'opisanie'
  }
]
