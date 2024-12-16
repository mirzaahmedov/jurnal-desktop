import type { ColumnDef } from '@/common/components'
import type { Group } from '@/common/models'

export const groupColumns: ColumnDef<Group>[] = [
  {
    key: 'name',
    header: 'Наименования'
  },
  {
    key: 'pod_group',
    header: 'Номер группы'
  },
  {
    key: 'smeta_name',
    header: 'Смета'
  },
  {
    key: 'schet',
    header: 'Счет'
  },
  {
    key: 'iznos_foiz',
    header: 'Износ %'
  },
  {
    key: 'provodka_debet',
    header: 'Дебет'
  },
  {
    key: 'provodka_subschet',
    header: 'Субсчет'
  },
  {
    key: 'provodka_kredit',
    header: 'Кредит'
  }
]
