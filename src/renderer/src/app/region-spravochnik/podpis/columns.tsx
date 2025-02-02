import type { ColumnDef } from '@/common/components'
import type { Podpis } from '@/common/models'

import { Badge } from '@renderer/common/components/ui/badge'

import { podpisDoljnostOptions } from './constants'
import { podpisTypeDocumentOptions } from './constants'

const podpisColumns: ColumnDef<Podpis>[] = [
  {
    header: '№',
    key: 'numeric_poryadok'
  },
  {
    header: 'doljnost',
    key: 'doljnost_name',
    renderCell(row, col) {
      const doljnost = podpisDoljnostOptions.find(
        (item) => item.key === row[col.key as keyof Podpis]
      )
      if (doljnost) {
        return (
          <Badge
            variant="secondary"
            className="bg-brand/10 text-brand hover:bg-brand/10"
          >
            {doljnost.name}
          </Badge>
        )
      }
      return row[col.key as keyof Podpis]
    }
  },
  {
    header: 'fio',
    key: 'fio_name'
  },
  {
    key: 'type_document',
    renderCell(row, col) {
      const typeDocument = podpisTypeDocumentOptions.find(
        (item) => item.key === row[col.key as keyof Podpis]
      )
      if (typeDocument) {
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-500 hover:bg-green-100"
          >
            {typeDocument.name}
          </Badge>
        )
      }
      return row[col.key as keyof Podpis]
    }
  }
]

export { podpisColumns }
