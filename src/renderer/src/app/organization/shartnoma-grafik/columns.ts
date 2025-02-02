import type { ColumnDef } from '@/common/components'
import type { ShartnomaGrafik } from '@/common/models'

import { t } from 'i18next'

import { formatLocaleDate } from '@/common/lib/format'

export const shartnomaGrafikColumns: ColumnDef<ShartnomaGrafik>[] = [
  {
    key: 'shartnomalar_organization_doc_num',
    header: 'doc_num'
  },
  {
    key: 'shartnomalar_organization_doc_date',
    header: 'doc_date',
    renderCell: (row) =>
      row.shartnomalar_organization_doc_date
        ? formatLocaleDate(row.shartnomalar_organization_doc_date)
        : '-'
  },
  {
    key: 'smeta_number',
    header: 'smeta'
  },
  {
    key: 'shartnomalar_organization_opisanie',
    header: 'opisanie'
  },
  {
    numeric: true,
    key: 'shartnomalar_organization_summa',
    header: 'summa'
  },
  {
    key: 'shartnomalar_organization_pudratchi_bool',
    header: 'supplier',
    renderCell: (row) => (row.shartnomalar_organization_pudratchi_bool ? t('supplier') : t('buyer'))
  }
]
