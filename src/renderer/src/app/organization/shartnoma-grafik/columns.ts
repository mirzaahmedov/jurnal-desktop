import type { ColumnDef } from '@/common/components'
import type { ShartnomaGrafik } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const shartnomaGrafikColumns: ColumnDef<ShartnomaGrafik>[] = [
  {
    key: 'shartnomalar_organization_doc_num',
    header: '№ договора'
  },
  {
    key: 'shartnomalar_organization_doc_date',
    header: 'Дата договора',
    renderCell: (row) =>
      row.shartnomalar_organization_doc_date
        ? formatLocaleDate(row.shartnomalar_organization_doc_date)
        : '-'
  },
  {
    key: 'smeta_number',
    header: 'Смета'
  },
  {
    key: 'shartnomalar_organization_opisanie',
    header: 'Описание'
  },
  {
    numeric: true,
    key: 'shartnomalar_organization_summa',
    header: 'Сумма'
  },
  {
    key: 'shartnomalar_organization_pudratchi_bool',
    header: 'Поставщик',
    renderCell: (row) => (row.shartnomalar_organization_pudratchi_bool ? 'Пудратчи' : 'Бошқа')
  }
]
