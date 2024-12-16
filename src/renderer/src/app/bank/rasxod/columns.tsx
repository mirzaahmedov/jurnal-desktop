import type { ColumnDef } from '@/common/components'
import type { BankRasxodType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'
import { TooltipCellRenderer } from '@/common/components/table/renderers'

export const columns: ColumnDef<BankRasxodType>[] = [
  {
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    key: 'doc_date',
    header: 'Дата проводки',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankRasxodType] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'О получателя',
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
    header: 'Сумма'
  },
  {
    key: 'opisanie',
    header: 'Описания',
    className: 'max-w-md'
  }
]
