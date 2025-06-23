import type { ColumnDef } from '@/common/components'
import type { Podpis } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'
import { Badge } from '@/common/components/ui/badge'
import { useConstantsStore } from '@/common/features/constants/store'

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
    key: 'doljnost_name'
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
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]

const TypeDocumentCell = ({ value }: { value: string }) => {
  const podpisTypes = useConstantsStore((store) => store.podpisTypes)
  const podpisType = podpisTypes.find((item) => item.key === value)

  if (podpisType) {
    return <Badge variant="secondary">{podpisType.name}</Badge>
  }
  return value
}
