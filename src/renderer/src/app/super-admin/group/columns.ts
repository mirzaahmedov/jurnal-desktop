import type { ColumnDef } from '@/common/components'
import type { Group } from '@/common/models'

export const groupColumns: ColumnDef<Group>[] = [
  {
    key: 'name',
    header: 'Наименования'
  },
  {
    key: 'schet',
    header: 'Счет',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'iznos_foiz',
    header: 'Износ %',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'provodka_debet',
    header: 'Дебет',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'provodka_subschet',
    header: 'Субсчет',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'provodka_kredit',
    header: 'Кредит',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'pod_group',
    header: 'Подгруппа',
    className: 'w-32'
  }
]
