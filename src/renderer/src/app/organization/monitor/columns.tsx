import type { OrganizationMonitor, OrganizationMonitorProvodka } from '@/common/models'
import type { ColumnDef } from '@renderer/common/components'

import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Badge } from '@renderer/common/components/ui/badge'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const organizationMonitorColumns: ColumnDef<OrganizationMonitor>[] = [
  {
    fit: true,
    key: 'doc_num'
  },
  {
    fit: true,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'opisanie',
    className: 'max-w-md'
  },
  {
    key: 'organ_name',
    header: 'organization'
  },
  {
    numeric: true,
    key: 'summa_prixod',
    header: 'debet',
    renderCell(row) {
      return !row.summa_prixod ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa_prixod}
          schet={row.provodki_schet}
          sub_schet={row.provodki_sub_schet}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'summa_rasxod',
    header: 'kredit',
    renderCell(row) {
      return !row.summa_rasxod ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa_rasxod}
          schet={row.provodki_schet}
          sub_schet={row.provodki_sub_schet}
        />
      )
    }
  },
  {
    fit: true,
    key: 'shartnoma_doc_num',
    header: 'shartnoma-number'
  },
  {
    fit: true,
    key: 'type',
    header: 'type-operatsii',
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
    fit: true,
    key: 'user_id',
    header: 'created-by-user',
    renderCell: (row) => `${row.fio} (@${row.login})`
  }
]

const getProvodkaName = (type: OrganizationMonitorProvodka) => {
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
