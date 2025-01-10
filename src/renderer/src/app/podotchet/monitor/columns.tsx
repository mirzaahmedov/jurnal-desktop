import { formatLocaleDate, formatNumber } from '@/common/lib/format'

import { Badge } from '@renderer/common/components/ui/badge'
import type { ColumnDef } from '@/common/components'
import type { PodotchetMonitor } from '@/common/models'
import { TooltipCellRenderer } from '@/common/components/table/renderers'

export const podotchetMonitoringColumns: ColumnDef<PodotchetMonitor>[] = [
  {
    header: 'Номер документа',
    key: 'doc_num'
  },
  {
    header: 'Дата документа',
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    header: 'Разъяснительный текст',
    key: 'opisanie'
  },
  {
    numeric: true,
    header: 'Дебет',
    key: 'prixod_sum',
    renderCell(row) {
      return !row.prixod_sum ? (
        '-'
      ) : (
        <TooltipCellRenderer
          data={row}
          title={formatNumber(row.prixod_sum)}
          elements={{
            provodki_schet: 'Проводка счет',
            provodki_sub_schet: 'Проводка субсчет'
          }}
          className="text-start"
        />
      )
    }
  },
  {
    numeric: true,
    header: 'Кредит',
    key: 'rasxod_sum',
    renderCell(row) {
      return !row.rasxod_sum ? (
        '-'
      ) : (
        <TooltipCellRenderer
          data={row}
          title={formatNumber(row.rasxod_sum)}
          elements={{
            provodki_schet: 'Проводка счет',
            provodki_sub_schet: 'Проводка подсчет'
          }}
          className="text-start"
        />
      )
    }
  },
  {
    key: 'podotchet_name',
    header: 'Подотчет'
  },
  {
    fit: true,
    key: 'type',
    header: 'Тип операции',
    renderCell: (row) => (
      <Badge
        variant="secondary"
        className="text-brand bg-brand/10 pointer-events-none"
      >
        {getProvodkaName(row.type)}
      </Badge>
    )
  },

  {
    key: 'user_id',
    header: 'Создано пользователем',
    renderCell: (row) => `${row.fio} (@${row.login})`
  }
]

const getProvodkaName = (type: string) => {
  switch (type) {
    case 'bank_rasxod':
      return 'Банк расход'
    case 'bank_prixod':
      return 'Банк приход'
    case 'kassa_rasxod':
      return 'Касса расход'
    case 'kassa_prixod':
      return 'Касса приход'
    case 'show_service':
      return 'Показать услуги'
    case 'akt':
      return 'Акт-приём пересдач'
    case 'jur7_prixod':
      return 'Журнал 7 приход'
    case 'jur7_rasxod':
      return 'Журнал 7 расход'
    case 'jur7_internal':
      return 'Журнал 7 внутренний'
    default:
      return ''
  }
}
