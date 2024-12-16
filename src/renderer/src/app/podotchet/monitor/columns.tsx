import type { ColumnDef } from '@/common/components'
import type { PodotchetMonitor } from '@/common/models'

import { TooltipCellRenderer } from '@/common/components/table/renderers'
import { formatNumber } from '@/common/lib/format'

const podotchetMonitoringColumns: ColumnDef<PodotchetMonitor>[] = [
  {
    header: 'Номер документа',
    key: 'doc_num'
  },
  {
    header: 'Дата документа',
    key: 'doc_date'
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
            provodki_sub_schet: 'Проводка подсчет'
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
    key: 'schet_array',
    header: 'Операция',
    renderCell(row) {
      return row.schet_array ? row.schet_array.join(', ') : row.operatsii
    }
  },
  {
    key: 'user_id',
    header: 'Создано пользователем',
    renderCell: (row) => `${row.fio} (@${row.login})`
  }
]

export { podotchetMonitoringColumns }
