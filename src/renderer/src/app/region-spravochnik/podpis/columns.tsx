import type { ColumnDef } from '@/common/components'
import type { Podpis } from '@/common/models'

import { Trans, useTranslation } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'
import { Badge } from '@/common/components/ui/badge'
import { useConstantsStore } from '@/common/features/constants/store'

import { PodpisDoljnostOptions } from './config'

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
  const { t } = useTranslation('podpis')
  const doljnost = PodpisDoljnostOptions(t).find((item) => item.key === value)
  if (doljnost) {
    return (
      <Badge>
        <Trans>{doljnost.name}</Trans>
      </Badge>
    )
  }
  return value
}

const TypeDocumentCell = ({ value }: { value: string }) => {
  const podpisTypes = useConstantsStore((store) => store.podpisTypes)
  const podpisType = podpisTypes.find((item) => item.key === value)

  if (podpisType) {
    return <Badge variant="secondary">{podpisType.name}</Badge>
  }
  return value
}
