import type { Podpis } from '@/common/models'
import type { ColumnDef } from '@/common/components'

const podpisColumns: ColumnDef<Podpis>[] = [
  {
    header: '№',
    key: 'numeric_poryadok'
  },
  {
    header: 'Должность',
    key: 'doljnost_name'
  },
  {
    header: 'ФИО',
    key: 'fio_name'
  },
  {
    header: 'Тип документа',
    key: 'type_document'
  }
]

export { podpisColumns }
