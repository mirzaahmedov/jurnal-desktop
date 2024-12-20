import type { OrganizationMonitor, OrganizationMonitorProvodka } from '@/common/models'

import { Badge } from '@/common/components/ui/badge'
import type { ColumnDef } from '@/common/components'
import { formatLocaleDate } from '@/common/lib/format'

const orgMonitorColumns: ColumnDef<OrganizationMonitor>[] = [
  {
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    key: 'doc_date',
    header: 'Дата',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },

  {
    key: 'opisanie',
    header: 'Разъяснительный текст',
    className: 'max-w-md'
  },
  {
    key: 'organ_name',
    header: 'Организация'
  },
  {
    numeric: true,
    key: 'summa_prixod',
    header: 'Дебет'
  },
  {
    numeric: true,
    key: 'summa_rasxod',
    header: 'Кредит'
  },
  {
    key: 'shartnoma_doc_num',
    header: '№ договора'
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
    fit: true,
    key: 'user_id',
    header: 'Создано пользователем',
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

export { orgMonitorColumns }
