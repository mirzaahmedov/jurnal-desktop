import type { ColumnDef } from '@/common/components'
import type { BankPrixodType } from '@/common/models'

import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { TooltipCellRenderer } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<BankPrixodType>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankPrixodType] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'about-counteragent',
    renderCell(row) {
      return (
        <TooltipCellRenderer
          data={row}
          description="spravochnik_organization_inn"
          title={row.spravochnik_organization_name ?? '-'}
          elements={{
            spravochnik_organization_inn: 'ИНН',
            spravochnik_organization_okonx: 'ОКОНХ',
            spravochnik_organization_bank_klient: 'Банк клиент',
            spravochnik_organization_raschet_schet: 'Расчет счет',
            spravochnik_organization_raschet_schet_gazna: 'Расчет счет Газна',
            spravochnik_organization_mfo: 'МФО'
          }}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'summa',
    renderCell(row) {
      return !row.summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa}
          schet={row.provodki_array?.[0]?.provodki_schet}
          sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
        />
      )
    }
  },
  {
    key: 'opisanie'
  }
]
