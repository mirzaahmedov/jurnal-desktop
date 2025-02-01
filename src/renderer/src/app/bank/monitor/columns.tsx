import type { ColumnDef } from '@/common/components'
import type { BankMonitoringType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'
import { TooltipCellRenderer } from '@/common/components/table/renderers'

export const columns: ColumnDef<BankMonitoringType>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankMonitoringType] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'about-counteragent',
    className: 'w-96',
    renderCell(row) {
      return (
        <TooltipCellRenderer
          data={row}
          description="spravochnik_organization_inn"
          title={row.spravochnik_organization_name ?? '-'}
          elements={{
            spravochnik_organization_name: 'Наименование',
            spravochnik_organization_raschet_schet: 'Расчетный счет',
            spravochnik_organization_inn: 'ИНН'
          }}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'prixod_sum',
    header: 'prixod'
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'rasxod'
  },
  {
    key: 'opisanie'
  },
  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
