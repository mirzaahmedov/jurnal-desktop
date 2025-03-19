import type { ColumnDef } from '@/common/components'
import type { Podpis } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { Badge } from '@renderer/common/components/ui/badge'
import { useTranslation } from 'react-i18next'

import { getPodpisDoljnostOptions, getPodpisTypeDocumentOptions } from './config'

export const podpisColumns: ColumnDef<Podpis>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    header: '№',
    key: 'numeric_poryadok'
  },
  {
    header: 'doljnost',
    key: 'doljnost_name',
    renderCell(row) {
      return <DoljnostCell value={row.doljnost_name} />
    }
  },
  {
    header: 'fio',
    key: 'fio_name'
  },
  {
    key: 'type_document',
    header: 'type-document',
    renderCell(row) {
      return <TypeDocumentCell value={row.type_document} />
    }
  }
]

const DoljnostCell = ({ value }: { value: string }) => {
  const { t } = useTranslation()
  const doljnost = getPodpisDoljnostOptions(t).find((item) => item.key === value)
  if (doljnost) {
    return <Badge>{doljnost.name}</Badge>
  }
  return value
}

const TypeDocumentCell = ({ value }: { value: string }) => {
  const { t } = useTranslation()
  const typeDocument = getPodpisTypeDocumentOptions(t).find((item) => item.key === value)
  if (typeDocument) {
    return <Badge variant="secondary">{typeDocument.name}</Badge>
  }
  return value
}
