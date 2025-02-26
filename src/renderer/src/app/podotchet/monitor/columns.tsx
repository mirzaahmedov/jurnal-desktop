import type { ColumnDef } from '@/common/components'
import type { PodotchetMonitor } from '@/common/models'
import type { TFunction } from 'i18next'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Badge } from '@renderer/common/components/ui/badge'
import { useTranslation } from 'react-i18next'

import { formatLocaleDate } from '@/common/lib/format'

export const podotchetMonitoringColumns: ColumnDef<PodotchetMonitor>[] = [
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
    key: 'opisanie'
  },
  {
    numeric: true,
    header: 'debet',
    key: 'prixod_sum',
    renderCell(row) {
      return !row.prixod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_sum}
          provodki={[
            {
              provodki_schet: row.provodki_schet,
              provodki_sub_schet: row.provodki_sub_schet
            }
          ]}
        />
      )
    }
  },
  {
    numeric: true,
    header: 'kredit',
    key: 'rasxod_sum',
    renderCell(row) {
      return !row.rasxod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_sum}
          provodki={[
            {
              provodki_schet: row.provodki_schet,
              provodki_sub_schet: row.provodki_sub_schet
            }
          ]}
        />
      )
    }
  },
  {
    key: 'podotchet_name',
    header: 'podotchet'
  },
  {
    fit: true,
    key: 'type',
    header: 'type-operatsii',
    renderCell: (row) => <DocumentTypeCell type={row.type} />
  },

  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell: (row) => `${row.fio} (@${row.login})`
  }
]

interface DocumentTypeCellProps {
  type: string
}
const DocumentTypeCell = ({ type }: DocumentTypeCellProps) => {
  const { t } = useTranslation(['app'])

  return (
    <Badge
      variant="secondary"
      className="text-brand bg-brand/10 pointer-events-none"
    >
      <span className="titlecase">{getProvodkaName(type, t)}</span>
    </Badge>
  )
}

const getProvodkaName = (type: string, t: TFunction) => {
  switch (type) {
    case 'bank_rasxod':
      return `${t('pages.bank')} ${t('pages.rasxod-docs')}`
    case 'bank_prixod':
      return `${t('pages.bank')} ${t('pages.prixod-docs')}`
    case 'kassa_rasxod':
      return `${t('pages.kassa')} ${t('pages.rasxod-docs')}`
    case 'kassa_prixod':
      return `${t('pages.kassa')} ${t('pages.prixod-docs')}`
    case 'show_service':
      return t('pages.service')
    case 'avans':
      return t('pages.avans')
    case 'akt':
      return t('pages.akt')
    case 'jur7_prixod':
      return `${t('pages.material-warehouse')} ${t('pages.prixod-docs')}`
    case 'jur7_rasxod':
      return `${t('pages.material-warehouse')} ${t('pages.rasxod-docs')}`
    case 'jur7_internal':
      return `${t('pages.material-warehouse')} ${t('pages.internal-docs')}`
    default:
      return ''
  }
}
