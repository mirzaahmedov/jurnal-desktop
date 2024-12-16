import type { ColumnDef } from '@/common/components'
import type { BankMonitoringType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'
import { TooltipCellRenderer } from '@/common/components/table/renderers'

export const columns: ColumnDef<BankMonitoringType>[] = [
  {
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    key: 'doc_date',
    header: 'Дата проводки',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankMonitoringType] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'О контрагенте',
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
    header: 'Приход'
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'Расход'
  },
  {
    key: 'opisanie',
    header: 'Описания'
  },
  {
    key: 'user_id',
    header: 'Создано пользователем',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
